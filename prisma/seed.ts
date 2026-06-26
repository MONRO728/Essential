import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

type Row = {
  Unit: string;
  '#': string;
  English: string;
  "O'zbekcha": string;
  Definition: string;
  'Example Sentence': string;
};

function loadRows(): Row[] {
  const csvPath = path.join(__dirname, 'data', 'vocabulary.csv');
  const raw = fs.readFileSync(csvPath, 'utf-8');
  const records: Row[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    trim: true,
  });
  // Drop the section-header rows that only repeat "Unit N" with no word data.
  return records.filter((r) => r.English && r.English.trim().length > 0);
}

async function main() {
  const rows = loadRows();
  console.log(`Parsed ${rows.length} word rows from CSV.`);

  const unitNumbers = Array.from(
    new Set(
      rows.map((r) => parseInt(r.Unit.replace(/[^0-9]/g, ''), 10)).filter((n) => !Number.isNaN(n))
    )
  ).sort((a, b) => a - b);

  const unitIdByNumber = new Map<number, string>();

  for (const number of unitNumbers) {
    const unit = await prisma.unit.upsert({
      where: { number },
      update: {},
      create: { number, title: `Unit ${number}` },
    });
    unitIdByNumber.set(number, unit.id);
  }
  console.log(`Upserted ${unitNumbers.length} units.`);

  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const unitNumber = parseInt(row.Unit.replace(/[^0-9]/g, ''), 10);
    const unitId = unitIdByNumber.get(unitNumber);
    if (!unitId) continue;

    const orderInUnit = parseInt(row['#'], 10) || 0;
    const english = row.English.trim();
    const uzbek = row["O'zbekcha"]?.trim() ?? '';
    const definition = row.Definition?.trim() ?? '';
    const example = row['Example Sentence']?.trim() ?? '';

    const existing = await prisma.word.findUnique({
      where: { unitId_english: { unitId, english } },
    });

    if (existing) {
      await prisma.word.update({
        where: { id: existing.id },
        data: { orderInUnit, uzbek, definition, example },
      });
      updated++;
    } else {
      await prisma.word.create({
        data: { unitId, orderInUnit, english, uzbek, definition, example },
      });
      created++;
    }
  }

  console.log(`Words: ${created} created, ${updated} updated.`);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@lexika.app';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log(`Created admin account: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`Admin account already exists: ${adminEmail}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
