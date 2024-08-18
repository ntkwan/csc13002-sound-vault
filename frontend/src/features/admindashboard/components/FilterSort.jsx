import PropTypes from 'prop-types';

FilterSort.propTypes = {
    date: PropTypes.string.isRequired,
    setDate: PropTypes.func.isRequired,
    sortMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
    sortOption: PropTypes.string.isRequired,
    setSortOption: PropTypes.func.isRequired,
    applyFilter: PropTypes.func.isRequired,
};

function FilterSort({
    date,
    setDate,
    sortMethods,
    sortOption,
    setSortOption,
    applyFilter,
}) {
    return (
        <form id="filter-sort-form" className="mb-8 select-none">
            <div className="mb-4">
                <label htmlFor="date" className="mb-2 block">
                    Date:
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-md border border-gray-600 bg-black p-2 text-white hover:cursor-pointer"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="sort" className="mb-2 block">
                    Sort by:
                </label>
                <select
                    id="sort"
                    name="sort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full rounded-md border border-gray-600 bg-black p-2 text-white hover:cursor-pointer"
                >
                    {sortMethods.map((method, index) => (
                        <option key={index} value={method}>
                            {method}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="button"
                onClick={applyFilter}
                className="transform rounded-md bg-slate-50 px-4 py-2 text-black transition duration-300 ease-in-out hover:scale-105"
            >
                Apply Filter
            </button>
        </form>
    );
}

export default FilterSort;
