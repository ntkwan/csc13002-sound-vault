import { useState, useRef, memo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import uploadIcon from '@assets/img/upload-icon.svg';

const UploadImage = memo(
    ({ className, id, label, sizeLimit, useUploadMutation }) => {
        const [preview, setPreview] = useState(null);
        const [uploadImage, setUploadImage] = useState(null);
        const formRef = useRef(null);
        const [uploadProfilePic, { isLoading }] = useUploadMutation();

        const handleImageUpload = (e) => {
            const image = e.target.files[0];
            if (image) {
                if (!image.type.includes('image')) {
                    toast.error('Invalid file type. Please upload an image.');
                } else if (image.size > 10000 * 1024) {
                    toast.error('File size exceeds the limit of 10MB.');
                } else if (image === uploadImage) {
                    toast.error('This image is already uploaded.');
                } else {
                    setPreview(URL.createObjectURL(image));
                    setUploadImage(image);
                }
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (uploadImage) {
                const formData = new FormData();
                formData.append('image', uploadImage);
                try {
                    await uploadProfilePic({
                        file: formData,
                    }).unwrap();
                    toast.success('Uploaded successfully!');
                } catch (error) {
                    toast.error('Error uploading image.');
                }
            }
            formRef.current.reset();
            setPreview(null);
            setUploadImage(null);
        };

        return (
            <form
                ref={formRef}
                className={`upload__form ${className}`}
                onSubmit={handleSubmit}
            >
                <label htmlFor={id} className="upload__label inline-block">
                    {label}
                    <div className="upload__container relative m-auto w-max">
                        <div className="upload__onclick relative h-44 w-44 content-center rounded-xl border-2 border-dashed">
                            {preview ? (
                                <img
                                    className="upload__preview h-full w-full rounded-xl object-cover"
                                    src={preview}
                                    alt="previewImage"
                                />
                            ) : (
                                <img
                                    className="upload__onclick-icon m-auto w-24"
                                    src={uploadIcon}
                                    alt="uploadIcon"
                                />
                            )}
                            <input
                                className="upload__input absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                                id={id}
                                type="file"
                                accept="image/*"
                                aria-label="File upload"
                                onChange={handleImageUpload}
                            />
                        </div>
                        {preview ? (
                            <button
                                className="upload__submit-button absolute left-[20%] right-[20%] mt-2 block rounded-xl bg-[#666] px-3 py-1 text-sm shadow-md transition duration-500 ease-in-out hover:bg-[#888]"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Uploading...' : 'Submit'}
                            </button>
                        ) : (
                            <span className="upload__desc absolute text-[13px] text-[#b2b2b2]">
                                {`File size is less than ${sizeLimit} MB`}
                            </span>
                        )}
                    </div>
                </label>
            </form>
        );
    },
);

export default UploadImage;
