import React from 'react';
import PropTypes from 'prop-types';

const ConfirmDeletion = ({ type, setConfirmAction, confirmActionHandler }) => {
    return (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-30">
            <div className="rounded-xl border-2 bg-black bg-opacity-50 p-6 shadow-lg backdrop-blur-xl">
                <p className="mb-4">
                    {`Are you sure you want to delete this ${type}?`}
                </p>
                <div className="flex justify-end">
                    <button
                        className="mr-2 rounded-md bg-gray-400 px-4 py-2"
                        onClick={() => setConfirmAction(null)}
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-md bg-red-500 px-4 py-2 text-white"
                        onClick={confirmActionHandler}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmDeletion.propTypes = {
    type: PropTypes.string.isRequired,
    setConfirmAction: PropTypes.func.isRequired,
    confirmActionHandler: PropTypes.func,
};

export default ConfirmDeletion;
