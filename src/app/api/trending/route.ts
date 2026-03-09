import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET /api/trending
 * Returns the latest trending intel feed from the scouting agent.
 */
export async function GET() {
  try {
    const intelPath = path.join(process.cwd(), 'core', 'data', 'trending_intel.json');
    
    if (!fs.existsSync(intelPath)) {
      return NextResponse.json({
        generated_at: new Date().toISOString(),
        total_items: 0,
        sources: { hacker_news: 0, reddit: 0, x_twitter: 0 },
        categories: {},
        items: [],
        message: 'Scouting agent has not run yet. First scan will populate this feed.',
      });
    }

    const raw = fs.readFileSync(intelPath, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read trending intel', details: String(error) },
      { status: 500 }
    );
  }
}
