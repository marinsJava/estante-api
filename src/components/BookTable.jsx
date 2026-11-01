import { memo, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ActionButton from './ActionButton.jsx';
import StatusBadge from './StatusBadge.jsx';
import { useBooksQuery, useDeleteBook } from '../hooks/useBooks.js';
import { deleteMessage, filterBooks } from '../services/bookService.js';

const Stars = ({ value }) =>
  value ? (
    <span className="stars" aria-label={`Nota ${value} de 5`}>
      {'★'.repeat(value)}<span className="stars__off">{'★'.repeat(5 - value)}</span>
    </span>
  ) : (
    <span className="muted">—</span>
  );

const BookRow = memo(({ book, onDelete }) => {
  const { id, title, author, status, rating } = book;
  return (
    <tr>
      <td>
        <Link className="title-link" to={`/livros/${id}`}>{title}</Link>
        <span className="muted">{author}</span>
      </td>
      <td><StatusBadge status={status} /></td>
      <td><Stars value={rating} /></td>
      <td className="actions">
        <Link className="btn btn--ghost" to={`/livros/${id}/editar`}>Editar</Link>
        <ActionButton variant="danger" onClick={() => onDelete(book)}>Excluir</ActionButton>
      </td>
    </tr>
  );
});

const BookTable = ({ filter, query }) => {
  const { data: books = [], isPending, isError, error, refetch } = useBooksQuery();
  const { mutate: deleteBook } = useDeleteBook();

  const visible = useMemo(() => filterBooks(books, { status: filter, query }), [books, filter, query]);
  const handleDelete = useCallback(
    (book) => {
      if (window.confirm(deleteMessage(book))) deleteBook(book.id);
    },
    [deleteBook]
  );

  if (isPending) {
    return (
      <p className="state" aria-busy="true">
        <span className="spinner" aria-hidden="true" />
        Carregando sua estante…
      </p>
    );
  }
  if (isError) {
    return (
      <div className="state state--error" role="alert">
        <p>Não foi possível carregar os livros: {error.message}</p>
        <ActionButton variant="primary" onClick={() => refetch()}>Tentar de novo</ActionButton>
      </div>
    );
  }
  if (books.length === 0) return <p className="state">Sua estante está vazia. Adicione um livro ou descubra novos títulos.</p>;
  if (visible.length === 0) return <p className="state">Nenhum livro corresponde a esse filtro ou busca.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Livro</th>
            <th>Situação</th>
            <th>Nota</th>
            <th><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody>
          {visible.map((book) => (
            <BookRow key={book.id} book={book} onDelete={handleDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
