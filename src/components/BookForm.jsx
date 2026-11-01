import { useNavigate } from 'react-router-dom';
import ActionButton from './ActionButton.jsx';
import { useForm } from '../hooks/useForm.js';
import { useCreateBook, useUpdateBook } from '../hooks/useBooks.js';
import { EMPTY_BOOK, STATUS, STATUS_LABEL, validateBook } from '../services/bookService.js';

const BookForm = ({ book }) => {
  const navigate = useNavigate();
  const create = useCreateBook();
  const update = useUpdateBook();
  const isEditing = Boolean(book);

  const { values, errors, submitting, handleChange, handleSubmit } = useForm({
    initialValues: book ?? EMPTY_BOOK,
    validate: validateBook,
    onSubmit: async (data) => {
      try {
        const saved = isEditing
          ? await update.mutateAsync({ id: book.id, data })
          : await create.mutateAsync(data);
        navigate(`/livros/${saved.id}`);
        return true;
      } catch {
        return false;
      }
    },
  });

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2>{isEditing ? 'Editar livro' : 'Novo livro'}</h2>

      <label>
        Título
        <input name="title" value={values.title} onChange={handleChange} aria-invalid={Boolean(errors.title)} />
        {errors.title && <small className="error">{errors.title}</small>}
      </label>

      <label>
        Autor
        <input name="author" value={values.author} onChange={handleChange} aria-invalid={Boolean(errors.author)} />
        {errors.author && <small className="error">{errors.author}</small>}
      </label>

      <div className="form__row">
        <label>
          Situação
          <select name="status" value={values.status} onChange={handleChange}>
            {Object.values(STATUS).map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
        </label>
        <label>
          Nota
          <select name="rating" value={values.rating} onChange={handleChange}>
            <option value={0}>Sem nota</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} de 5</option>
            ))}
          </select>
        </label>
      </div>

      <div className="form__actions">
        <ActionButton variant="primary" type="submit" disabled={submitting}>
          {submitting ? 'Salvando…' : isEditing ? 'Salvar alterações' : 'Adicionar livro'}
        </ActionButton>
        <ActionButton disabled={submitting} onClick={() => navigate(isEditing ? `/livros/${book.id}` : '/')}>
          Cancelar
        </ActionButton>
      </div>
    </form>
  );
};

export default BookForm;
