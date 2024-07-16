import React from 'react';

function ItemsPerPageSelector({ itemsPerPage, handleItemsPerPageChange }) {
    return (
        <div className="flex items-center">
            <span className="mr-2 text-[#718096]">Show result:</span>
            <select
                className="w-14 rounded-lg p-2.5 px-2 py-1 text-sm text-gray-900 hover:cursor-pointer focus:border-blue-500 focus:ring-0 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
            >
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
            </select>
        </div>
    );
}

export default ItemsPerPageSelector;
