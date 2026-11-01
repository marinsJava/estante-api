import ActionButton from './ActionButton.jsx';

const SearchBar = ({ initialValue = '', onSearch }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(String(new FormData(event.currentTarget).get('q') ?? ''));
  };

  return (
    <form className="search" role="search" onSubmit={handleSubmit} onReset={() => onSearch('')}>
      <input name="q" type="search" defaultValue={initialValue} placeholder="Buscar por título ou autor" aria-label="Buscar livros" />
      <ActionButton type="submit" variant="primary">Buscar</ActionButton>
      <ActionButton type="reset">Limpar</ActionButton>
    </form>
  );
};

export default SearchBar;
