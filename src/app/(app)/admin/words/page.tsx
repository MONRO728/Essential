'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, X, Check, ImageOff, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';

interface AdminWord {
  id: string;
  english: string;
  uzbek: string;
  definition: string;
  example: string;
  imageUrl: string | null;
  orderInUnit: number;
  unitNumber: number;
}

const emptyDraft = { english: '', uzbek: '', definition: '', example: '', imageUrl: '', unitNumber: 1, orderInUnit: 0 };

export default function AdminWordsPage() {
  const [words, setWords] = useState<AdminWord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const pageSize = 25;

  function load() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (query.trim()) params.set('q', query.trim());
    fetch(`/api/admin/words?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setWords(data.words ?? []);
        setTotal(data.total ?? 0);
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load();
  }

  async function saveWord(id: string, draft: Partial<AdminWord>) {
    const res = await fetch(`/api/admin/words/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        english: draft.english,
        uzbek: draft.uzbek,
        definition: draft.definition,
        example: draft.example,
        imageUrl: draft.imageUrl || null,
        unitNumber: draft.unitNumber,
        orderInUnit: draft.orderInUnit,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error ?? 'Could not save this word.');
      return;
    }
    setEditingId(null);
    load();
  }

  async function deleteWord(id: string) {
    if (!confirm('Delete this word? This cannot be undone.')) return;
    await fetch(`/api/admin/words/${id}`, { method: 'DELETE' });
    load();
  }

  async function createWord(draft: typeof emptyDraft) {
    const res = await fetch('/api/admin/words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...draft,
        imageUrl: draft.imageUrl || null,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error ?? 'Could not add this word.');
      return;
    }
    setAdding(false);
    setPage(1);
    load();
  }

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search English or Uzbek…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64"
          />
          <Button type="submit" variant="secondary" size="sm">Search</Button>
        </form>
        <Button size="sm" onClick={() => setAdding((a) => !a)}>
          <Plus size={15} /> Add word
        </Button>
      </div>

      {adding && <WordForm initial={emptyDraft} onCancel={() => setAdding(false)} onSave={createWord} />}

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/[0.06] text-xs uppercase tracking-wide text-ink-soft/70 dark:border-white/[0.06] dark:text-white/40">
            <tr>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">English</th>
              <th className="px-4 py-3">Uzbek</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft dark:text-white/50">Loading…</td>
              </tr>
            )}
            {!loading && words.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft dark:text-white/50">No words found.</td>
              </tr>
            )}
            {!loading &&
              words.map((w) =>
                editingId === w.id ? (
                  <tr key={w.id}>
                    <td colSpan={5} className="px-4 py-3">
                      <WordForm
                        initial={{
                          english: w.english,
                          uzbek: w.uzbek,
                          definition: w.definition,
                          example: w.example,
                          imageUrl: w.imageUrl ?? '',
                          unitNumber: w.unitNumber,
                          orderInUnit: w.orderInUnit,
                        }}
                        onCancel={() => setEditingId(null)}
                        onSave={(draft) => saveWord(w.id, draft)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={w.id} className="border-b border-ink/[0.04] last:border-0 dark:border-white/[0.04]">
                    <td className="px-4 py-3 font-mono text-xs text-ink-soft dark:text-white/50">{w.unitNumber}</td>
                    <td className="px-4 py-3 font-medium text-ink dark:text-white">{w.english}</td>
                    <td className="px-4 py-3 text-ink-soft dark:text-white/70">{w.uzbek}</td>
                    <td className="px-4 py-3">
                      {w.imageUrl ? (
                        <ImageIcon size={15} className="text-moss-500" />
                      ) : (
                        <ImageOff size={15} className="text-ink-soft/40 dark:text-white/30" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditingId(w.id)}
                        className="mr-1 rounded p-1.5 text-ink-soft hover:bg-ink/5 hover:text-indigo-600 dark:text-white/50 dark:hover:bg-white/10"
                        aria-label="Edit word"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => deleteWord(w.id)}
                        className="rounded p-1.5 text-ink-soft hover:bg-ink/5 hover:text-brick-500 dark:text-white/50 dark:hover:bg-white/10"
                        aria-label="Delete word"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between text-sm text-ink-soft dark:text-white/60">
        <span>{total} words total</span>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="px-2 py-1.5">
            Page {page} of {totalPages}
          </span>
          <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function WordForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: typeof emptyDraft;
  onSave: (draft: typeof emptyDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(initial);

  return (
    <Card className="p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Unit number</Label>
          <Input
            type="number"
            min={1}
            value={draft.unitNumber}
            onChange={(e) => setDraft({ ...draft, unitNumber: parseInt(e.target.value, 10) || 1 })}
          />
        </div>
        <div>
          <Label>Order in unit</Label>
          <Input
            type="number"
            min={0}
            value={draft.orderInUnit}
            onChange={(e) => setDraft({ ...draft, orderInUnit: parseInt(e.target.value, 10) || 0 })}
          />
        </div>
        <div>
          <Label>English word</Label>
          <Input value={draft.english} onChange={(e) => setDraft({ ...draft, english: e.target.value })} />
        </div>
        <div>
          <Label>Uzbek translation</Label>
          <Input value={draft.uzbek} onChange={(e) => setDraft({ ...draft, uzbek: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label>Definition</Label>
          <Input value={draft.definition} onChange={(e) => setDraft({ ...draft, definition: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label>Example sentence</Label>
          <Input value={draft.example} onChange={(e) => setDraft({ ...draft, example: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label>Image URL (optional, for Image Association mode)</Label>
          <Input
            value={draft.imageUrl}
            placeholder="https://…"
            onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          <X size={14} /> Cancel
        </Button>
        <Button size="sm" onClick={() => onSave(draft)}>
          <Check size={14} /> Save
        </Button>
      </div>
    </Card>
  );
}
