import { useState } from 'react';
import BookForm from './components/BookForm.jsx';
import BookTable from './components/BookTable.jsx';
import { useBooks } from './hooks/useBooks.js';
import { STATUS_LABEL, countByStatus, deleteMessage } from './services/bookService.js';

const App = () => {
  const { books, add, edit, remove } = useBooks();
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('todos');

  const counts = countByStatus(books);
  const visible = filter === 'todos' ? books : books.filter(({ status }) => status === filter);

  const handleSubmit = (data) => {
    if (editing) {
      edit(editing.id, data);
      setEditing(null);
    } else {
      add(data);
    }
  };

  const handleDelete = (book) => {
    if (!window.confirm(deleteMessage(book))) return;
    remove(book.id);
    if (editing?.id === book.id) setEditing(null);
  };

  const filters = [['todos', 'Todos', books.length], ...Object.entries(STATUS_LABEL).map(([key, label]) => [key, label, counts[key] ?? 0])];

  return (
    <main className="app">
      <header className="app__header">
        <h1>Estante</h1>
        <p>Os livros que você quer ler, está lendo e já leu.</p>
      </header>

      <div className="app__layout">
        <aside className="panel">
          <BookForm
            key={editing?.id ?? 'new'}
            initialValues={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        </aside>

        <section className="panel">
          <nav className="filters" aria-label="Filtrar por situação">
            {filters.map(([key, label, count]) => (
              <button
                key={key}
                type="button"
                className={`filter ${filter === key ? 'is-active' : ''}`}
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
              >
                {label} <span>{count}</span>
              </button>
            ))}
          </nav>
          <BookTable books={visible} editingId={editing?.id} onEdit={setEditing} onDelete={handleDelete} />
        </section>
      </div>
    </main>
  );
};

export default App;
