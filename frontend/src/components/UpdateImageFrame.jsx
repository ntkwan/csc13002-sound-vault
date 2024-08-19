import { useRef, useEffect } from 'react';
import { UploadImage } from '@features/profilepage/components';

const UpdateImageFrame = ({ setShowFrame, label, useUploadMutation }) => {
    const frameRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (frameRef.current && !frameRef.current.contains(e.target)) {
                setShowFrame(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50">
            <div
                ref={frameRef}
                className="relative z-20 cursor-default rounded-[35px] border bg-black px-6 py-10 text-center font-kodchasan shadow-lg"
            >
                <UploadImage
                    className="flex-1"
                    id="upload-cover"
                    label={label}
                    sizeLimit={10}
                    useUploadMutation={useUploadMutation}
                />
            </div>
        </div>
    );
};

export default UpdateImageFrame;
