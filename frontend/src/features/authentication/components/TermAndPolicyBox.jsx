import { useState } from 'react';
import { sections } from '@components';
import PropTypes from 'prop-types';

TermAndPolicyBox.propTypes = {
    onClose: PropTypes.func.isRequired,
};

function TermAndPolicyBox({ onClose }) {
    const [expandedSections, setExpandedSections] = useState([]);

    const toggleSection = (index) => {
        setExpandedSections((prevState) =>
            prevState.includes(index)
                ? prevState.filter((i) => i !== index)
                : [...prevState, index],
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            <div className="relative z-10 m-auto h-[700px] w-[1100px] divide-solid rounded-2xl border-[2px] border-black bg-home-pattern bg-cover px-10 py-7">
                <h1 className="heading-stroke m text-center font-italianno text-[130px] leading-tight tracking-wider">
                    Term & Policy
                </h1>
                <div className="hover:opacity-25" onClick={onClose}>
                    <i className="ri-close-fill absolute right-3 top-3 text-4xl"></i>
                </div>
                <p className="text-center font-kodchasan text-[19px] font-bold">
                    AGREEMENT ON THE EXCHANGE AND PROVISION OF INFORMATION ON
                    THE SOUNDVAULT WEBSITE
                </p>
                <div className="h-[calc(100%-200px)] overflow-y-auto px-3">
                    {sections.map((section, index) => (
                        <div key={index} className="my-4">
                            <h2
                                className="flex cursor-pointer items-center rounded-md border-[2px] p-3 text-lg font-bold hover:opacity-70"
                                onClick={() => toggleSection(index)}
                            >
                                <span className="mr-2">{section.title}</span>
                                <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full border-[2px]">
                                    {expandedSections.includes(index) ? (
                                        <i className="ri-arrow-up-double-line text-xs hover:opacity-20"></i>
                                    ) : (
                                        <i className="ri-arrow-down-double-line text-xs hover:opacity-20"></i>
                                    )}
                                </div>
                            </h2>
                            {expandedSections.includes(index) && (
                                <div className="mt-2">{section.content}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TermAndPolicyBox;
