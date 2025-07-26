import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth-config';
import { pool } from '../../../../lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    let query = 'SELECT * FROM media_files ORDER BY uploaded_at DESC';
    const params: any[] = [];

    if (filter !== 'all') {
      if (filter === 'image') {
        query = 'SELECT * FROM media_files WHERE file_type LIKE $1 ORDER BY uploaded_at DESC';
        params.push('image/%');
      } else if (filter === 'video') {
        query = 'SELECT * FROM media_files WHERE file_type LIKE $1 ORDER BY uploaded_at DESC';
        params.push('video/%');
      } else if (filter === 'document') {
        query = 'SELECT * FROM media_files WHERE file_type NOT LIKE $1 AND file_type NOT LIKE $2 ORDER BY uploaded_at DESC';
        params.push('image/%', 'video/%');
      }
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Media API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Generate unique filename
      const fileExtension = file.name.split('.').pop();
      const filename = `${uuidv4()}.${fileExtension}`;
      
      // Create upload directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }

      // Save file to disk
      const filePath = join(uploadDir, filename);
      const bytes = await file.arrayBuffer();
      await writeFile(filePath, new Uint8Array(bytes));

      // Save file info to database
      const fileUrl = `/uploads/${filename}`;
      const result = await pool.query(
        `INSERT INTO media_files (filename, original_name, file_path, file_size, mime_type, alt_text, title, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [
          filename,
          file.name,
          fileUrl,
          file.size,
          file.type,
          file.name, // Default alt text
          file.name, // Default title
          JSON.stringify({})
        ]
      );

      uploadedFiles.push({
        id: result.rows[0].id,
        filename,
        original_name: file.name,
        file_path: fileUrl,
        file_size: file.size,
        mime_type: file.type
      });
    }

    return NextResponse.json({ 
      message: 'Files uploaded successfully',
      files: uploadedFiles 
    }, { status: 201 });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
