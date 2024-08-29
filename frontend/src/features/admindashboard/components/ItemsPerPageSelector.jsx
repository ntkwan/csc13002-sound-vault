import React from 'react';

function ItemsPerPageSelector({ itemsPerPage, handleItemsPerPageChange }) {
    return (
        <div className="flex select-none items-center">
            <span className="mr-2 text-[#718096]">Show result:</span>
            <select
                className="w-14 rounded-lg border-gray-600 bg-black p-2.5 px-2 py-1 text-sm text-white hover:cursor-pointer"
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
