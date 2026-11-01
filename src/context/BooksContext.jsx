import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from './ToastContext.jsx';
import { listBooks, createBookRequest, updateBookRequest, removeBookRequest } from '../services/booksApi.js';
import { removeBook } from '../services/bookService.js';

const BooksContext = createContext(null);

export const BooksProvider = ({ children }) => {
    const { notify } = useToast();
    const [books, setBooks] = useState([]);
    const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(null);
    const [pendingIds, setPendingIds] = useState([]);

    const reload = useCallback(() => {
        setStatus('loading');
        return listBooks()
            .then((data) => {
                setBooks(data);
                setStatus('ready');
            })
            .catch((err) => {
                setError(err.message);
                setStatus('error');
            });
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    const track = (id, on) =>
        setPendingIds((prev) => (on ? [...prev, id] : prev.filter((pid) => pid !== id)));

    const add = useCallback(
        async (data) => {
            try {
                const created = await createBookRequest(data);
                setBooks((prev) => [created, ...prev]);
                notify(`"${created.title}" foi adicionado à estante.`);
                return true;
            } catch (err) {
                notify(`Não foi possível adicionar: ${err.message}`, 'error');
                return false;
            }
        },
        [notify]
    );

    const edit = useCallback(
        async (id, changes) => {
            track(id, true);
            try {
                const saved = await updateBookRequest(id, changes);
                setBooks((prev) => prev.map((book) => (book.id === id ? saved : book)));
                notify(`"${saved.title}" foi atualizado.`);
                return true;
            } catch (err) {
                notify(`Não foi possível salvar: ${err.message}`, 'error');
                return false;
            } finally {
                track(id, false);
            }
        },
        [notify]
    );

    const remove = useCallback(
        async (id) => {
            track(id, true);
            try {
                await removeBookRequest(id);
                setBooks((prev) => removeBook(prev, id));
                setEditing((current) => (current?.id === id ? null : current));
                notify('Livro excluído.');
            } catch (err) {
                notify(`Não foi possível excluir: ${err.message}`, 'error');
            } finally {
                track(id, false);
            }
        },
        [notify]
    );

    const value = useMemo(
        () => ({ books, status, error, editing, pendingIds, setEditing, reload, add, edit, remove }),
        [books, status, error, editing, pendingIds, reload, add, edit, remove]
    );

    return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
};

export const useBooks = () => {
    const ctx = useContext(BooksContext);
    if (!ctx) throw new Error('useBooks deve ser usado dentro de <BooksProvider>.');
    return ctx;
};
