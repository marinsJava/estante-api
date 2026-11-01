import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext.jsx';
import {
  fetchBook, fetchBooks, createBookRequest, updateBookRequest, removeBookRequest,
} from '../services/booksApi.js';
import { removeBook } from '../services/bookService.js';

export const booksKey = ['books'];

export const useBooksQuery = () =>
  useQuery({ queryKey: booksKey, queryFn: ({ signal }) => fetchBooks(signal) });

export const useBookQuery = (id) =>
  useQuery({ queryKey: [...booksKey, String(id)], queryFn: ({ signal }) => fetchBook(id, signal) });

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  return useMutation({
    mutationFn: createBookRequest,
    onSuccess: (book) => {
      queryClient.invalidateQueries({ queryKey: booksKey });
      notify(`"${book.title}" foi adicionado à estante.`);
    },
    onError: (err) => notify(`Não foi possível adicionar: ${err.message}`, 'error'),
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  return useMutation({
    mutationFn: ({ id, data }) => updateBookRequest(id, data),
    onSuccess: (book) => {
      queryClient.invalidateQueries({ queryKey: booksKey });
      notify(`"${book.title}" foi atualizado.`);
    },
    onError: (err) => notify(`Não foi possível salvar: ${err.message}`, 'error'),
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  return useMutation({
    mutationFn: removeBookRequest,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: booksKey });
      const previous = queryClient.getQueryData(booksKey);
      queryClient.setQueryData(booksKey, (old = []) => removeBook(old, id));
      return { previous };
    },
    onError: (err, _id, context) => {
      queryClient.setQueryData(booksKey, context?.previous);
      notify(`Não foi possível excluir: ${err.message}`, 'error');
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: [...booksKey, String(id)] });
      notify('Livro excluído.');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: booksKey }),
  });
};
