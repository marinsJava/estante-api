import { memo, useCallback, useMemo } from 'react';
import ActionButton from './ActionButton.jsx';
import StatusBadge from './StatusBadge.jsx';
import { useBooks } from '../context/BooksContext.jsx';
import { deleteMessage, filterBooks } from '../services/bookService.js';

const Stars = ({ value }) =>
    value ? (
        <span className="stars" aria-label={`Nota ${value} de 5`}>
      {'★'.repeat(value)}<span className="stars__off">{'★'.repeat(5 - value)}</span>
    </span>
    ) : (
        <span className="muted">—</span>
    );

const BookRow = memo(({ book, isEditing, isPending, onEdit, onDelete }) => {
  const { title, author, status, rating } = book;
  return (
      <tr className={`${isEditing ? 'is-editing' : ''} ${isPending ? 'is-pending' : ''}`} aria-busy={isPending}>
        <td>
          <strong>{title}</strong>
          <span className="muted">{author}</span>
        </td>
        <td><StatusBadge status={status} /></td>
        <td><Stars value={rating} /></td>
        <td className="actions">
          <ActionButton disabled={isPending} onClick={() => onEdit(book)}>Editar</ActionButton>
          <ActionButton variant="danger" disabled={isPending} onClick={() => onDelete(book)}>
            {isPending ? 'Aguarde…' : 'Excluir'}
          </ActionButton>
        </td>
      </tr>
  );
});

const BookTable = ({ filter, query }) => {
  const { books, status, error, reload, pendingIds, editing, setEditing, remove } = useBooks();

  const visible = useMemo(() => filterBooks(books, { status: filter, query }), [books, filter, query]);
  const handleDelete = useCallback(
      (book) => {
        if (window.confirm(deleteMessage(book))) remove(book.id);
      },
      [remove]
  );

  if (status === 'loading') {
    return (
        <p className="state" aria-busy="true">
          <span className="spinner" aria-hidden="true" />
          Carregando sua estante…
        </p>
    );
  }
  if (status === 'error') {
    return (
        <div className="state state--error" role="alert">
          <p>Não foi possível carregar os livros: {error}</p>
          <ActionButton variant="primary" onClick={reload}>Tentar de novo</ActionButton>
        </div>
    );
  }
  if (books.length === 0) return <p className="state">Sua estante está vazia. Adicione o primeiro livro pelo formulário.</p>;
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
              <BookRow
                  key={book.id}
                  book={book}
                  isEditing={book.id === editing?.id}
                  isPending={pendingIds.includes(book.id)}
                  onEdit={setEditing}
                  onDelete={handleDelete}
              />
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default BookTable;
