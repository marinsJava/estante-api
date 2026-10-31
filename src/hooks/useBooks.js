import { useEffect, useState } from 'react';
import { createBook, updateBook, removeBook } from '../services/bookService.js';

const STORAGE_KEY = 'estante:books';

const SEED = [
  { id: 'seed-1', title: 'Grande Sertão: Veredas', author: 'João Guimarães Rosa', status: 'lendo', rating: 0 },
  { id: 'seed-2', title: 'Dom Casmurro', author: 'Machado de Assis', status: 'lido', rating: 5 },
  { id: 'seed-3', title: 'A Hora da Estrela', author: 'Clarice Lispector', status: 'quero-ler', rating: 0 },
];

const load = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : SEED;
  } catch {
    return SEED;
  }
};

export const useBooks = () => {
  const [books, setBooks] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch {
      /* armazenamento indisponível: segue só em memória */
    }
  }, [books]);

  const add = (data) => setBooks((prev) => createBook(prev, data));
  const edit = (id, changes) => setBooks((prev) => updateBook(prev, id, changes));
  const remove = (id) => setBooks((prev) => removeBook(prev, id));

  return { books, add, edit, remove };
};
