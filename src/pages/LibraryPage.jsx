import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BookTable from '../components/BookTable.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { useBooksQuery } from '../hooks/useBooks.js';
import { STATUS_LABEL, countByStatus } from '../services/bookService.js';

const LibraryPage = () => {
  const [params, setParams] = useSearchParams();
  const filter = params.get('status') ?? 'todos';
  const query = params.get('q') ?? '';

  const { data: books = [], isSuccess, isFetching } = useBooksQuery();
  const counts = useMemo(() => countByStatus(books), [books]);

  const update = (key, value) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value && value !== 'todos') next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );

  const filters = [
    ['todos', 'Todos', books.length],
    ...Object.entries(STATUS_LABEL).map(([key, label]) => [key, label, counts[key] ?? 0]),
  ];

  return (
    <section className="panel">
      <div className="panel__head">
        <SearchBar key={query} initialValue={query} onSearch={(value) => update('q', value.trim())} />
        <Link className="btn btn--primary" to="/livros/novo">Novo livro</Link>
      </div>

      <nav className="filters" aria-label="Filtrar por situação">
        {filters.map(([key, label, count]) => (
          <button
            key={key}
            type="button"
            className={`filter ${filter === key ? 'is-active' : ''}`}
            aria-pressed={filter === key}
            onClick={() => update('status', key)}
          >
            {label}
            {isSuccess && <span>{count}</span>}
          </button>
        ))}
      </nav>

      {isSuccess && isFetching && <p className="muted" role="status">Atualizando…</p>}
      <BookTable filter={filter} query={query} />
    </section>
  );
};

export default LibraryPage;
