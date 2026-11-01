import ActionButton from './ActionButton.jsx';

const SearchBar = ({ onSearch }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(new FormData(event.currentTarget).get('q'));
    };

    return (
        <form className="search" role="search" onSubmit={handleSubmit} onReset={() => onSearch('')}>
            <input name="q" type="search" defaultValue="" placeholder="Buscar por título ou autor" aria-label="Buscar livros" />
            <ActionButton type="submit" variant="primary">Buscar</ActionButton>
            <ActionButton type="reset">Limpar</ActionButton>
        </form>
    );
};

export default SearchBar;
