import ActionButton from './ActionButton.jsx';
import StatusBadge from './StatusBadge.jsx';

const Stars = ({ value }) =>
  value ? (
    <span className="stars" aria-label={`Nota ${value} de 5`}>
      {'★'.repeat(value)}<span className="stars__off">{'★'.repeat(5 - value)}</span>
    </span>
  ) : (
    <span className="muted">—</span>
  );

const BookTable = ({ books, editingId, onEdit, onDelete }) => {
  if (books.length === 0) {
    return (
      <p className="empty">
        Nenhum livro por aqui. Use o formulário para adicionar o primeiro.
      </p>
    );
  }

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
          {books.map((book) => {
            const { id, title, author, status, rating } = book;
            return (
              <tr key={id} className={id === editingId ? 'is-editing' : ''}>
                <td>
                  <strong>{title}</strong>
                  <span className="muted">{author}</span>
                </td>
                <td><StatusBadge status={status} /></td>
                <td><Stars value={rating} /></td>
                <td className="actions">
                  <ActionButton onClick={() => onEdit(book)}>Editar</ActionButton>
                  <ActionButton variant="danger" onClick={() => onDelete(book)}>Excluir</ActionButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
