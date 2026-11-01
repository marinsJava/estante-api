import { Link, useParams } from 'react-router-dom';
import ActionButton from '../components/ActionButton.jsx';
import BookForm from '../components/BookForm.jsx';
import { useBookQuery } from '../hooks/useBooks.js';

const EditBook = ({ id }) => {
  const { data: book, isPending, isError, error, refetch } = useBookQuery(id);

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
  return <BookForm key={id} book={book} />;
};

const BookFormPage = () => {
  const { id } = useParams();
  return (
    <section className="panel panel--narrow">
      {id ? <EditBook id={id} /> : <BookForm />}
    </section>
  );
};

export default BookFormPage;
