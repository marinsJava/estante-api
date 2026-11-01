import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ActionButton from '../components/ActionButton.jsx';
import { useBooksQuery, useCreateBook } from '../hooks/useBooks.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import { searchCatalog } from '../services/openLibraryApi.js';
import { STATUS } from '../services/bookService.js';

const keyOf = ({ title, author }) => `${title}|${author}`.toLowerCase();

const DiscoverPage = () => {
  const [text, setText] = useState('');
  const query = useDebouncedValue(text.trim(), 400);

  const { data: results = [], isFetching, isError, error, refetch } = useQuery({
    queryKey: ['catalog', query],
    queryFn: ({ signal }) => searchCatalog(query, signal),
    enabled: query.length >= 3,
    staleTime: 5 * 60_000,
  });

  const { data: books = [] } = useBooksQuery();
  const owned = useMemo(() => new Set(books.map(keyOf)), [books]);
  const { mutate: addBook, isPending: adding, variables } = useCreateBook();

  const handleAdd = ({ title, author }) =>
    addBook({ title, author, status: STATUS.WANT, rating: 0 });

  let content;
  if (query.length < 3) content = <p className="state">Digite ao menos 3 letras para buscar no catálogo da Open Library.</p>;
  else if (isError) {
    content = (
      <div className="state state--error" role="alert">
        <p>Falha na busca: {error.message}</p>
        <ActionButton variant="primary" onClick={() => refetch()}>Tentar de novo</ActionButton>
      </div>
    );
  } else if (isFetching && results.length === 0) {
    content = <p className="state" aria-busy="true"><span className="spinner" aria-hidden="true" />Buscando no catálogo…</p>;
  } else if (results.length === 0) content = <p className="state">Nenhum resultado para “{query}”.</p>;
  else {
    content = (
      <ul className="catalog" aria-busy={isFetching}>
        {results.map((item) => {
          const isOwned = owned.has(keyOf(item));
          const isAdding = adding && variables?.title === item.title;
          return (
            <li key={item.key} className="card">
              {item.cover ? (
                <img src={item.cover} alt={`Capa de ${item.title}`} loading="lazy" />
              ) : (
                <div className="card__nocover" aria-hidden="true">Sem capa</div>
              )}
              <div className="card__body">
                <strong>{item.title}</strong>
                <span className="muted">{item.author}{item.year && `, ${item.year}`}</span>
                <ActionButton disabled={isOwned || isAdding} onClick={() => handleAdd(item)}>
                  {isOwned ? 'Já está na estante' : isAdding ? 'Adicionando…' : 'Adicionar à estante'}
                </ActionButton>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section className="panel">
      <h2 className="panel__title">Descobrir livros</h2>
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Busque por título, autor ou assunto"
        aria-label="Buscar no catálogo"
      />
      {query.length >= 3 && isFetching && results.length > 0 && <p className="muted" role="status">Atualizando resultados…</p>}
      {content}
    </section>
  );
};

export default DiscoverPage;
