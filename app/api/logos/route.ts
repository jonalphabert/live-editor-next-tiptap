import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchTerm = req.nextUrl.searchParams.get('q') || '';
  
  if (searchTerm.length < 3) {
    return NextResponse.json([]);
  }

  try {
    const result = await query(
        `SELECT logo_slug, logo_name,
            similarity(lower(logo_name), lower($1)) AS match_score
        FROM shield_io_brand
        WHERE lower(logo_name) LIKE '%' || lower($1) || '%'
        ORDER BY match_score DESC
        LIMIT 8`,
      [searchTerm]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}