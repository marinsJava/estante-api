import { request } from './http.js';

export const searchCatalog = async (query, signal) => {
  const params = new URLSearchParams({
    q: query,
    limit: '12',
    fields: 'key,title,author_name,cover_i,first_publish_year',
  });
  const { docs } = await request(`https://openlibrary.org/search.json?${params}`, { signal, timeoutMs: 10000 });

  return docs.map(({ key, title, author_name = [], cover_i, first_publish_year }) => ({
    key,
    title,
    author: author_name[0] ?? 'Autor desconhecido',
    year: first_publish_year,
    cover: cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : null,
  }));
};
