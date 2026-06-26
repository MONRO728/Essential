'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ImportResult {
  summary: { created: number; updated: number; skipped: number; totalRows: number };
  errors: string[];
}

export default function AdminImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/import', { method: 'POST', body: formData });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? 'Import failed.');
      return;
    }
    setResult(data);
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Card>
        <CardContent>
          <h2 className="mb-1 font-display text-lg font-semibold text-ink dark:text-white">Import vocabulary CSV</h2>
          <p className="mb-5 text-sm text-ink-soft dark:text-white/60">
            Upload a CSV with Unit, English, Uzbek translation, Definition, and Example sentence columns.
            Existing words (matched by unit + English spelling) are updated; everything else is added.
          </p>

          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-ink/15 p-8 text-center transition-colors hover:border-indigo-400 dark:border-white/15">
            <UploadCloud size={26} className="text-ink-soft/60 dark:text-white/40" />
            <span className="text-sm text-ink-soft dark:text-white/60">
              {file ? file.name : 'Click to choose a .csv file'}
            </span>
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <Button className="mt-4 w-full" disabled={!file || loading} onClick={handleUpload}>
            {loading ? 'Importing…' : 'Import CSV'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="flex items-start gap-3 p-4">
          <AlertTriangle size={18} className="mt-0.5 text-brick-500" />
          <p className="text-sm text-ink dark:text-white">{error}</p>
        </Card>
      )}

      {result && (
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2 text-moss-500">
            <CheckCircle2 size={18} />
            <p className="font-medium">Import finished</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div>
              <p className="font-display text-xl font-semibold text-ink dark:text-white">{result.summary.created}</p>
              <p className="text-ink-soft dark:text-white/50">Created</p>
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink dark:text-white">{result.summary.updated}</p>
              <p className="text-ink-soft dark:text-white/50">Updated</p>
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-ink dark:text-white">{result.summary.skipped}</p>
              <p className="text-ink-soft dark:text-white/50">Skipped</p>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div className="mt-4 rounded-lg bg-brick-500/10 p-3 text-sm text-brick-600">
              <p className="mb-1 font-medium">Some rows had issues:</p>
              <ul className="list-inside list-disc space-y-0.5">
                {result.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
