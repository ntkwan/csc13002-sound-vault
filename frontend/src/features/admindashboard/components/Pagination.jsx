import React, { useState } from 'react';

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
    const [visibleInputBox, setVisibleInputBox] = useState(null);
    const [inputPage, setInputPage] = useState('');

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setVisibleInputBox(null);
        setInputPage('');
    };

    const handleInputChange = (e) => {
        setInputPage(e.target.value);
    };

    const handleInputSubmit = (e) => {
        e.preventDefault();
        const pageNumber = parseInt(inputPage, 10);
        if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
            handlePageChange(pageNumber);
        }
    };

    const renderPages = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index}
                    className={`my-1 border border-transparent px-3 py-[1px] text-sm text-indigo-50 hover:text-indigo-300 ${
                        currentPage === index + 1
                            ? 'bg-[#5882C1]/[0.1] text-indigo-700'
                            : ''
                    } rounded-xl`}
                    onClick={() => handlePageChange(index + 1)}
                >
                    {index + 1}
                </button>
            ));
        } else {
            return (
                <>
                    <button
                        className={`my-1 border border-transparent px-3 py-[1px] text-sm text-indigo-50 hover:text-indigo-300 ${
                            currentPage === 1
                                ? 'bg-[#5882C1]/[0.1] text-indigo-700'
                                : ''
                        } rounded-xl`}
                        onClick={() => handlePageChange(1)}
                    >
                        1
                    </button>
                    {currentPage > 3 && (
                        <div className="relative my-1">
                            <button
                                className="rounded-xl border border-transparent px-3 py-[1px] text-sm text-indigo-50 hover:text-indigo-300"
                                onClick={() =>
                                    setVisibleInputBox(
                                        visibleInputBox === 'first'
                                            ? null
                                            : 'first',
                                    )
                                }
                            >
                                ...
                            </button>
                            {visibleInputBox === 'first' && (
                                <form
                                    onSubmit={handleInputSubmit}
                                    className="absolute mt-2"
                                >
                                    <input
                                        type="text"
                                        value={inputPage}
                                        onChange={handleInputChange}
                                        className="w-12 rounded-md bg-gray-200 px-3 py-1 text-sm text-indigo-700"
                                        placeholder="Go to"
                                    />
                                </form>
                            )}
                        </div>
                    )}
                    {currentPage > 2 && (
                        <button
                            className={`my-1 border border-transparent px-3 py-[1px] text-sm text-indigo-50 hover:text-indigo-300 ${
                                currentPage === currentPage - 1
                                    ? 'bg-[#5882C1]/[0.1] text-indigo-700'
                                    : ''
                            } rounded-xl`}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            {currentPage - 1}
                        </button>
                    )}
                    {currentPage !== 1 && currentPage !== totalPages && (
                        <button
                            className={`my-1 rounded-xl border border-transparent bg-[#5882C1]/[0.1] px-3 py-[1px] text-sm text-indigo-700 hover:text-indigo-300`}
                            onClick={() => handlePageChange(currentPage)}
                        >
                            {currentPage}
                        </button>
                    )}
                    {currentPage < totalPages - 1 && (
                        <button
                            className={`my-1 border border-transparent px-3 py-[1px] text-sm text-indigo-50 hover:text-indigo-300 ${
                                currentPage === currentPage + 1
                                    ? 'bg-[#5882C1]/[0.1] text-indigo-700'
                                    : ''
                            } rounded-xl`}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            {currentPage + 1}
                        </button>
                    )}
                    {currentPage < totalPages - 2 && (
                        <div className="relative my-1">
                            <button
                                className="rounded-xl border border-transparent px-3 py-[1px] text-sm text-indigo-50 hover:text-indigo-300"
                                onClick={() =>
                                    setVisibleInputBox(
                                        visibleInputBox === 'second'
                                            ? null
                                            : 'second',
                                    )
                                }
                            >
                                ...
                            </button>
                            {visibleInputBox === 'second' && (
                                <form
                                    onSubmit={handleInputSubmit}
                                    className="absolute mt-2"
                                >
                                    <input
                                        type="text"
                                        value={inputPage}
                                        onChange={handleInputChange}
                                        className="w-12 rounded-md bg-gray-200 px-3 py-1 text-sm text-indigo-700"
                                        placeholder="Go to"
                                    />
                                </form>
                            )}
                        </div>
                    )}
                    <button
                        className={`my-1 border border-transparent px-3 py-[1px] text-sm text-indigo-50 hover:text-indigo-300 ${
                            currentPage === totalPages
                                ? 'bg-[#5882C1]/[0.1] text-indigo-700'
                                : ''
                        } rounded-xl`}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                </>
            );
        }
    };

    return (
        <div className="flex items-center justify-between">
            <button
                className="p-2 pb-3 font-bold hover:text-indigo-300"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
                {'<'}
            </button>
            <div className="relative flex space-x-2">{renderPages()}</div>
            <button
                className="p-2 pb-3 font-bold hover:text-indigo-300"
                onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
            >
                {'>'}
            </button>
        </div>
    );
};

export default Pagination;
