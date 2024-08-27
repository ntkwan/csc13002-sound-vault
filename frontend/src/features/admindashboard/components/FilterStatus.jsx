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
    isReviewPage: PropTypes.bool,
};

function FilterStatus({ filterList, tabStatus, onFilterClick, isReviewPage }) {
    return (
        <div className="admin-page__filter flex select-none space-x-4 px-2">
            {filterList.map((button, index) => (
                <button
                    key={index}
                    className={`flex border-b-[3px] px-2 py-4 font-bold duration-200 ease-in-out hover:scale-105 hover:border-[#6C5DD3] ${button.status === tabStatus ? 'border-[#6C5DD3] text-[white]' : 'border-transparent text-[#718096]'}`}
                    onClick={() => onFilterClick(button.status)}
                >
                    {button.name}
                    {isReviewPage && button.name != 'All reports' && (
                        <div
                            className={`mx-2 my-[6px] h-3 w-[40px] rounded-lg ${
                                button.name === 'Finished'
                                    ? 'bg-[#188038]'
                                    : button.name === 'Pending'
                                      ? 'bg-[#F6FE00]'
                                      : 'bg-[#FD0053]'
                            }`}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}

export default FilterStatus;
