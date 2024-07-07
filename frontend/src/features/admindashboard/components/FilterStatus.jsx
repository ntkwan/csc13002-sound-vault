import PropTypes from 'prop-types';

FilterStatus.propTypes = {
    filterList: PropTypes.arrayOf(
        PropTypes.shape({
            status: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }),
    ).isRequired,
    tabStatus: PropTypes.string.isRequired,
    onFilterClick: PropTypes.func.isRequired,
};

function FilterStatus({ filterList, tabStatus, onFilterClick }) {
    return (
        <div className="admin-page__filter flex space-x-4 px-2">
            {filterList.map((button, index) => (
                <button
                    key={index}
                    className={`border-b-[3px] px-2 py-4 font-bold hover:border-[#6C5DD3] ${button.status === tabStatus ? 'border-[#6C5DD3] text-[white]' : 'border-transparent text-[#718096]'}`}
                    onClick={() => onFilterClick(button.status)}
                >
                    {button.name}
                </button>
            ))}
        </div>
    );
}

export default FilterStatus;
