import ActionButton from './ActionButton.jsx';
import { useForm } from '../hooks/useForm.js';
import { useBooks } from '../context/BooksContext.jsx';
import { EMPTY_BOOK, STATUS, STATUS_LABEL, validateBook } from '../services/bookService.js';

const BookForm = () => {
    const { editing, setEditing, add, edit } = useBooks();
    const isEditing = Boolean(editing);

    const { values, errors, submitting, handleChange, handleSubmit } = useForm({
        initialValues: editing ?? EMPTY_BOOK,
        validate: validateBook,
        resetOnSuccess: !isEditing,
        onSubmit: async (data) => {
            if (!isEditing) return add(data);
            const ok = await edit(editing.id, data);
            if (ok) setEditing(null);
            return ok;
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
                {isEditing && (
                    <ActionButton onClick={() => setEditing(null)} disabled={submitting}>Cancelar</ActionButton>
                )}
            </div>
        </form>
    );
};

export default BookForm;
