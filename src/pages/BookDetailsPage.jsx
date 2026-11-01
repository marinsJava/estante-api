import { Link, useNavigate, useParams } from 'react-router-dom';
import ActionButton from '../components/ActionButton.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useBookQuery, useDeleteBook } from '../hooks/useBooks.js';
import { deleteMessage } from '../services/bookService.js';

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: book, isPending, isError, error, refetch } = useBookQuery(id);
  const { mutate: deleteBook, isPending: deleting } = useDeleteBook();

  if (isPending) return <p className="state" aria-busy="true"><span className="spinner" aria-hidden="true" />Carregando livro…</p>;
  if (isError) {
    return error.status === 404 ? (
      <p className="state">Livro não encontrado. <Link to="/">Voltar à biblioteca</Link></p>
    ) : (
      <div className="state state--error" role="alert">
        <p>{error.message}</p>
        <ActionButton variant="primary" onClick={() => refetch()}>Tentar de novo</ActionButton>
      </div>
    );
  }

  const { title, author, status, rating } = book;
  const handleDelete = () => {
    if (window.confirm(deleteMessage(book))) deleteBook(book.id, { onSuccess: () => navigate('/') });
  };

  return (
    <section className="panel panel--narrow detail">
      <Link to="/" className="muted">‹ Voltar à biblioteca</Link>
      <h2>{title}</h2>
      <p className="muted">{author}</p>
      <dl>
        <div><dt>Situação</dt><dd><StatusBadge status={status} /></dd></div>
        <div><dt>Nota</dt><dd>{rating ? `${rating} de 5` : 'Sem nota'}</dd></div>
      </dl>
      <div className="form__actions">
        <Link className="btn btn--primary" to={`/livros/${id}/editar`}>Editar</Link>
        <ActionButton variant="danger" disabled={deleting} onClick={handleDelete}>
          {deleting ? 'Excluindo…' : 'Excluir'}
        </ActionButton>
      </div>
    </section>
  );
};

export default BookDetailsPage;
