import { useState, useEffect, useCallback } from 'react';

export interface Contestant {
  id: string;
  name: string;
  email: string;
}

const STORAGE_KEY = 'pwwf-contestants';
const MAX_CONTESTANTS = 20;

const SAMPLE_DATA: Contestant[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com' },
  { id: '3', name: 'Carol Martinez', email: 'carol@example.com' },
  { id: '4', name: 'David Brown', email: 'david@example.com' },
  { id: '5', name: 'Eva Chen', email: 'eva@example.com' },
];

function loadContestants(): Contestant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
  return SAMPLE_DATA;
}

export function useContestants() {
  const [contestants, setContestants] = useState<Contestant[]>(loadContestants);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contestants));
  }, [contestants]);

  const addContestant = useCallback((name: string, email: string): string | null => {
    if (contestants.length >= MAX_CONTESTANTS) return 'Maximum 20 contestants reached!';
    const id = crypto.randomUUID();
    setContestants(prev => [...prev, { id, name: name.trim(), email: email.trim() }]);
    return null;
  }, [contestants.length]);

  const addBulk = useCallback((entries: { name: string; email: string }[]): { added: number; skipped: number } => {
    const available = MAX_CONTESTANTS - contestants.length;
    const toAdd = entries.slice(0, available).map(e => ({
      id: crypto.randomUUID(),
      name: e.name.trim(),
      email: e.email.trim(),
    }));
    setContestants(prev => [...prev, ...toAdd]);
    return { added: toAdd.length, skipped: entries.length - toAdd.length };
  }, [contestants.length]);

  const updateContestant = useCallback((id: string, name: string, email: string) => {
    setContestants(prev => prev.map(c => c.id === id ? { ...c, name: name.trim(), email: email.trim() } : c));
  }, []);

  const removeContestant = useCallback((id: string) => {
    setContestants(prev => prev.filter(c => c.id !== id));
  }, []);

  const clearAll = useCallback(() => setContestants([]), []);

  const shuffle = useCallback(() => {
    setContestants(prev => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
  }, []);

  return {
    contestants,
    addContestant,
    addBulk,
    updateContestant,
    removeContestant,
    clearAll,
    shuffle,
    isFull: contestants.length >= MAX_CONTESTANTS,
    count: contestants.length,
    max: MAX_CONTESTANTS,
  };
}
