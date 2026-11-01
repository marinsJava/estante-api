import { createBook, updateBook, removeBook } from './bookService.js';

const STORAGE_KEY = 'estante:books';
const LATENCY_MS = 700;
const FAIL_LOAD = false;

const SEED = [
    { id: 'seed-1', title: 'Grande Sertão: Veredas', author: 'João Guimarães Rosa', status: 'lendo', rating: 0 },
    { id: 'seed-2', title: 'Dom Casmurro', author: 'Machado de Assis', status: 'lido', rating: 5 },
    { id: 'seed-3', title: 'A Hora da Estrela', author: 'Clarice Lispector', status: 'quero-ler', rating: 0 },
];

const read = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? SEED;
    } catch {
        return SEED;
    }
};
const write = (books) => localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

const request = (work, { title = '' } = {}) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (title.toLowerCase().includes('[erro]')) {
                reject(new Error('o servidor recusou a operação.'));
                return;
            }
            resolve(work());
        }, LATENCY_MS);
    });

export const listBooks = () =>
    new Promise((resolve, reject) =>
        setTimeout(() => (FAIL_LOAD ? reject(new Error('sem conexão com o servidor.')) : resolve(read())), LATENCY_MS)
    );

export const createBookRequest = (data) =>
    request(() => {
        const [created, ...rest] = createBook(read(), data);
        write([created, ...rest]);
        return created;
    }, data);

export const updateBookRequest = (id, changes) =>
    request(() => {
        const next = updateBook(read(), id, changes);
        write(next);
        return next.find((book) => book.id === id);
    }, changes);

export const removeBookRequest = (id) =>
    request(() => {
        write(removeBook(read(), id));
        return id;
    });
