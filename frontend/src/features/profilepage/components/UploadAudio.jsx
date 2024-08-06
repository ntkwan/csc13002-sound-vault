import { useState, memo } from 'react';
import { toast } from 'react-toastify';
import uploadIcon from '@assets/img/upload-icon.svg';

const UploadAudio = memo(
    ({ className, id, label, sizeLimit, useUploadMutation }) => {
        const [preview, setPreview] = useState(null);
        const [uploadAudio, setUploadAudio] = useState(null);

        const handleAudioUpload = (e) => {
            const audio = e.target.files[0];
            if (!audio.type.includes('audio')) {
                toast.error('Invalid file type. Please upload an audio file.');
            } else if (audio.size > sizeLimit * 1000 * 1024) {
                toast.error(`File size exceeds the limit of ${sizeLimit} MB.`);
            } else {
                setUploadAudio(audio);
                setPreview(URL.createObjectURL(audio));
                useUploadMutation(audio);
            }
        };

        const resetUpload = () => {
            setUploadAudio(null);
            setPreview(null);
            document.getElementById(id).value = null;
        };

        return (
            <>
                <div className={`upload__form relative space-y-2 ${className}`}>
                    <label htmlFor="audio-upload" className="upload__label">
                        {label}
                    </label>
                    <div className="upload__container relative w-max">
                        {preview && (
                            <>
                                <div className="flex flex-col justify-between space-y-2 overflow-hidden">
                                    <p>File name: {uploadAudio.name}</p>
                                    <audio
                                        className="h-9"
                                        src={preview}
                                        controls
                                    />
                                    <p
                                        className="hover:cursor-pointer hover:underline hover:underline-offset-2"
                                        onClick={resetUpload}
                                    >
                                        Click here to upload another file
                                    </p>
                                </div>
                            </>
                        )}
                        <div
                            className={`${preview && 'hidden'} upload__onclick relative h-44 w-44 content-center rounded-xl border-2 border-dashed`}
                        >
                            <img
                                className="upload__onclick-icon m-auto w-24"
                                src={uploadIcon}
                                alt="uploadIcon"
                            />

                            <input
                                id={id}
                                className="upload__input absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                                type="file"
                                onChange={handleAudioUpload}
                                accept="audio/*"
                                aria-label="File upload"
                            />
                        </div>
                    </div>
                    {!preview && (
                        <span className="upload__desc absolute inline-block text-[13px] text-[#b2b2b2]">
                            {`File size is less than ${sizeLimit} MB`}
                        </span>
                    )}
                </div>
            </>
        );
    },
);

UploadAudio.displayName = 'UploadAudio';

export default UploadAudio;
