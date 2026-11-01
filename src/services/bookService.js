export const STATUS = {
  WANT: 'quero-ler',
  READING: 'lendo',
  DONE: 'lido',
};

export const STATUS_LABEL = {
  [STATUS.WANT]: 'Quero ler',
  [STATUS.READING]: 'Lendo',
  [STATUS.DONE]: 'Lido',
};

export const EMPTY_BOOK = { title: '', author: '', status: STATUS.WANT, rating: 0 };

const newId = () => crypto.randomUUID();

export const createBook = (books, data) => {
  const { title, author, status, rating } = data;
  const book = {
    id: newId(),
    title: title.trim(),
    author: author.trim(),
    status,
    rating: Number(rating) || 0,
  };
  return [book, ...books];
};

export const updateBook = (books, id, changes) => {
  const { id: _ignored, ...safeChanges } = changes;
  const { title, author } = safeChanges;
  return books.map((book) =>
    book.id === id
      ? {
          ...book,
          ...safeChanges,
          ...(title !== undefined && { title: title.trim() }),
          ...(author !== undefined && { author: author.trim() }),
          rating: Number(safeChanges.rating ?? book.rating) || 0,
        }
      : book
  );
};

export const removeBook = (books, id) => books.filter((book) => book.id !== id);

export const validateBook = ({ title, author }) => ({
  ...(!title.trim() && { title: 'Informe o título do livro.' }),
  ...(!author.trim() && { author: 'Informe o nome do autor.' }),
});

export const deleteMessage = ({ title, author }) =>
  `Excluir "${title}" de ${author}?\nEssa ação não pode ser desfeita.`;

export const countByStatus = (books) =>
  books.reduce(
    (acc, { status }) => ({ ...acc, [status]: (acc[status] ?? 0) + 1 }),
    {}
  );

export const filterBooks = (books, { status = 'todos', query = '' }) => {
  const q = query.trim().toLowerCase();
  return books.filter(
    (book) =>
      (status === 'todos' || book.status === status) &&
      (!q || `${book.title} ${book.author}`.toLowerCase().includes(q))
  );
};
