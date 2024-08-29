import PropTypes from 'prop-types';

SearchBar.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
};

function SearchBar({ searchTerm, onSearch }) {
    const handleSearchChange = (e) => {
        onSearch(e.target.value);
    };

    return (
        <div className="admin-page__search relative flex h-11 w-1/2 px-4 duration-200 ease-in-out hover:scale-105">
            <i className="ri-search-line absolute left-6 my-[6px] text-2xl"></i>
            <input
                className="admin-page__input-search w-full select-none rounded-xl border-none bg-black pl-10 outline-none"
                placeholder="Search name, id,..."
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>
    );
}

export default SearchBar;
