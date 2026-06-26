import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { getCurrentSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

async function requireAdminSession() {
  const session = await getCurrentSession();
  if (!session?.user || session.user.role !== 'ADMIN') return null;
  return session;
}

function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Finds the header in `headers` whose normalized form contains any of `candidates`. */
function findColumn(headers: string[], candidates: string[]): string | null {
  const normalized = headers.map((h) => ({ raw: h, norm: normalizeHeader(h) }));
  for (const candidate of candidates) {
    const match = normalized.find((h) => h.norm.includes(candidate));
    if (match) return match.raw;
  }
  return null;
}

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const formData = await req.formData().catch(() => null);
  const file = formData?.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Upload a CSV file under the "file" field' }, { status: 400 });
  }

  const text = await file.text();
  let rows: Record<string, string>[];
  try {
    rows = parse(text, { columns: true, skip_empty_lines: true, bom: true, trim: true });
  } catch (e) {
    return NextResponse.json({ error: 'Could not parse CSV. Check the file formatting.' }, { status: 400 });
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: 'The CSV file has no data rows.' }, { status: 400 });
  }

  const headers = Object.keys(rows[0]);
  const unitCol = findColumn(headers, ['unit']);
  const orderCol = findColumn(headers, ['#', 'order', 'no']);
  const englishCol = findColumn(headers, ['english', 'word']);
  const uzbekCol = findColumn(headers, ['uzbek', "ozbekcha", 'translation']);
  const definitionCol = findColumn(headers, ['definition', 'meaning']);
  const exampleCol = findColumn(headers, ['example', 'sentence']);

  if (!unitCol || !englishCol || !uzbekCol) {
    return NextResponse.json(
      {
        error:
          'Could not find Unit, English, and Uzbek columns in the CSV header. Found columns: ' +
          headers.join(', '),
      },
      { status: 400 }
    );
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];
  const unitCache = new Map<number, string>();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const english = row[englishCol]?.trim();
    if (!english) {
      skipped++;
      continue;
    }

    const unitMatch = row[unitCol]?.match(/\d+/);
    const unitNumber = unitMatch ? parseInt(unitMatch[0], 10) : NaN;
    if (Number.isNaN(unitNumber)) {
      errors.push(`Row ${i + 2}: could not read a unit number from "${row[unitCol]}"`);
      skipped++;
      continue;
    }

    let unitId = unitCache.get(unitNumber);
    if (!unitId) {
      const unit = await prisma.unit.upsert({
        where: { number: unitNumber },
        update: {},
        create: { number: unitNumber, title: `Unit ${unitNumber}` },
      });
      unitId = unit.id;
      unitCache.set(unitNumber, unitId);
    }

    const orderInUnit = orderCol ? parseInt(row[orderCol], 10) || 0 : 0;
    const uzbek = row[uzbekCol]?.trim() ?? '';
    const definition = definitionCol ? row[definitionCol]?.trim() ?? '' : '';
    const example = exampleCol ? row[exampleCol]?.trim() ?? '' : '';

    const existing = await prisma.word.findUnique({ where: { unitId_english: { unitId, english } } });
    if (existing) {
      await prisma.word.update({ where: { id: existing.id }, data: { orderInUnit, uzbek, definition, example } });
      updated++;
    } else {
      await prisma.word.create({ data: { unitId, orderInUnit, english, uzbek, definition, example } });
      created++;
    }
  }

  return NextResponse.json({
    summary: { created, updated, skipped, totalRows: rows.length },
    errors: errors.slice(0, 20),
  });
}
