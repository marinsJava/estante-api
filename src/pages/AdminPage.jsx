import { useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import ActionButton from '../components/ActionButton.jsx';
import { useBooksQuery, useDeleteBook, useUpdateBook } from '../hooks/useBooks.js';
import { STATUS, STATUS_LABEL, deleteMessage } from '../services/bookService.js';

const requiredText = (field) => ({ data, newValue }) => {
  if (!String(newValue ?? '').trim()) return false;
  data[field] = String(newValue).trim();
  return true;
};

const AdminPage = () => {
  const { data, isPending, isError, error, refetch } = useBooksQuery();
  const { mutate: updateBook } = useUpdateBook();
  const { mutate: deleteBook } = useDeleteBook();

  const rowData = useMemo(() => data?.map((book) => ({ ...book })), [data]);

  const stats = useMemo(() => {
    const list = data ?? [];
    const rated = list.filter(({ rating }) => rating > 0);
    const average = rated.length ? (rated.reduce((sum, { rating }) => sum + rating, 0) / rated.length).toFixed(1) : '—';
    return [
      ['Total', list.length],
      ['Lendo agora', list.filter(({ status }) => status === STATUS.READING).length],
      ['Lidos', list.filter(({ status }) => status === STATUS.DONE).length],
      ['Nota média', average],
    ];
  }, [data]);

  const handleDelete = useCallback(
    (book) => {
      if (window.confirm(deleteMessage(book))) deleteBook(book.id);
    },
    [deleteBook]
  );

  const columnDefs = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'title', headerName: 'Título', flex: 2, minWidth: 180, editable: true, valueSetter: requiredText('title') },
      { field: 'author', headerName: 'Autor', flex: 1.5, minWidth: 160, editable: true, valueSetter: requiredText('author') },
      {
        field: 'status', headerName: 'Situação', width: 150, editable: true,
        cellEditor: 'agSelectCellEditor', cellEditorParams: { values: Object.values(STATUS) },
        valueFormatter: ({ value }) => STATUS_LABEL[value] ?? value,
      },
      { field: 'rating', headerName: 'Nota', width: 100, editable: true, cellEditor: 'agNumberCellEditor', cellEditorParams: { min: 0, max: 5, precision: 0 } },
      {
        headerName: '', width: 120, sortable: false, filter: false,
        cellRenderer: ({ data: book }) => <ActionButton variant="danger" onClick={() => handleDelete(book)}>Excluir</ActionButton>,
      },
    ],
    [handleDelete]
  );

  const onCellValueChanged = ({ data: book, colDef: { field }, newValue }) => {
    updateBook({ id: book.id, data: { [field]: newValue } });
  };

  if (isPending) return <p className="state" aria-busy="true"><span className="spinner" aria-hidden="true" />Carregando painel…</p>;
  if (isError) {
    return (
      <div className="state state--error" role="alert">
        <p>{error.message}</p>
        <ActionButton variant="primary" onClick={() => refetch()}>Tentar de novo</ActionButton>
      </div>
    );
  }

  return (
    <section className="panel">
      <h2 className="panel__title">Painel administrativo</h2>
      <dl className="stats">
        {stats.map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
      <p className="muted">Dê dois cliques em uma célula para editar. Clique no cabeçalho para ordenar.</p>
      <div className="ag-theme-quartz grid-wrap">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
          getRowId={({ data: book }) => String(book.id)}
          onCellValueChanged={onCellValueChanged}
          overlayNoRowsTemplate="Nenhum livro cadastrado."
        />
      </div>
    </section>
  );
};

export default AdminPage;