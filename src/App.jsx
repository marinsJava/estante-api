import { useMemo, useState } from 'react';
import BookForm from './components/BookForm.jsx';
import BookTable from './components/BookTable.jsx';
import SearchBar from './components/SearchBar.jsx';
import { BooksProvider, useBooks } from './context/BooksContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { STATUS_LABEL, countByStatus } from './services/bookService.js';

const Shell = () => {
  const { books, status, editing } = useBooks();
  const [filter, setFilter] = useState('todos');
  const [query, setQuery] = useState('');

  const counts = useMemo(() => countByStatus(books), [books]);
  const filters = [
    ['todos', 'Todos', books.length],
    ...Object.entries(STATUS_LABEL).map(([key, label]) => [key, label, counts[key] ?? 0]),
  ];

  return (
      <main className="app">
        <header className="app__header">
          <h1>Estante</h1>
          <p>Os livros que você quer ler, está lendo e já leu.</p>
        </header>

        <div className="app__layout">
          <aside className="panel">
            <BookForm key={editing?.id ?? 'new'} />
          </aside>

          <section className="panel">
            <SearchBar onSearch={setQuery} />
            <nav className="filters" aria-label="Filtrar por situação">
              {filters.map(([key, label, count]) => (
                  <button
                      key={key}
                      type="button"
                      className={`filter ${filter === key ? 'is-active' : ''}`}
                      aria-pressed={filter === key}
                      onClick={() => setFilter(key)}
                  >
                    {label}
                    {status === 'ready' && <span>{count}</span>}
                  </button>
              ))}
            </nav>
            <BookTable filter={filter} query={query} />
          </section>
        </div>
      </main>
  );
};

const App = () => (
    <ToastProvider>
      <BooksProvider>
        <Shell />
      </BooksProvider>
    </ToastProvider>
);

export default App;
