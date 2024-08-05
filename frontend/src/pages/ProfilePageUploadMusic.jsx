import { useState } from 'react';
import { PageTitle } from '@components';
import { TermAndPolicyBox } from '@features/authentication/components';
import uploadIcon from '@assets/img/upload-icon.svg';
import { toast } from 'react-toastify';
import {
    useUploadSongMutation,
    useUploadSongThumbnailMutation,
} from '@services/api';
import {
    UploadImage,
    UploadAudio,
    InputForm,
} from '@features/profilepage/components';
import 'react-toastify/dist/ReactToastify.css';

function ProfilePageUploadMusic() {
    const [showTermsAndPolicy, setShowTermsAndPolicy] = useState(false);
    const handleShowTermsAndPolicy = () =>
        setShowTermsAndPolicy(!showTermsAndPolicy);

    const [checked, setChecked] = useState(false);
    const [uploadAudio, setUploadAudio] = useState(null);
    const [uploadCover, setUploadCover] = useState(null);
    const [uploadThumbnail, setUploadThumbnail] = useState(null);

    const handleCheckboxChange = (e) => setChecked(e.target.checked);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checked) {
            toast.error('You must accept the terms and policies to proceed.');
            return;
        }

        const formData = new FormData(e.target);
        const collaborators = formData.get('collaborators');
        const songTitle = formData.get('songTitle');
        const releaseDate = formData.get('releaseDate');
        const region = formData.get('region');
        const genre = formData.get('genre');

        if (
            uploadAudio &&
            uploadCover &&
            uploadThumbnail &&
            collaborators &&
            songTitle &&
            releaseDate &&
            region &&
            genre
        ) {
            try {
                const formData = new FormData();
                formData.append('audio', uploadAudio);
                formData.append('cover', uploadCover);
                formData.append('thumbnail', uploadThumbnail);
                formData.append('collaborators', collaborators);
                formData.append('songTitle', songTitle);
                formData.append('releaseDate', releaseDate);
                formData.append('region', region);
                formData.append('genre', genre);

                // await useUploadSongMutation({ file: formData }).unwrap();
                toast.success('Uploaded successfully!');
                // setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                toast.error('Error uploading files.');
            }
        } else {
            toast.error('Please provide all required files.');
        }
    };

    return (
        <>
            <div className="upload-music__page pt-8">
                {showTermsAndPolicy && (
                    <TermAndPolicyBox
                        title="Terms and Policy"
                        onClose={handleShowTermsAndPolicy}
                    />
                )}
                <PageTitle title="Upload Music " className="mb-8" />
                <form
                    className="editing__upload grid grid-rows-2"
                    onSubmit={handleSubmit}
                >
                    <div className="flex justify-between">
                        <UploadAudio
                            className=""
                            label="To upload music click on the box or drop file here!"
                            sizeLimit={10}
                            useUploadMutation={setUploadAudio}
                        />
                        <UploadImage2
                            className=""
                            label="To upload a cover click on the box or drop file here!"
                            sizeLimit={10}
                            useUploadMutation={setUploadCover}
                        />
                        <UploadImage2
                            className=""
                            label="To upload a thumbnail click on the box or drop file here!"
                            sizeLimit={10}
                            useUploadMutation={setUploadThumbnail}
                        />
                    </div>

                    <div className="upload-music__infomation relative mt-4 grid w-full grid-cols-2 items-start gap-4">
                        <div className="w-5/6 space-y-4">
                            <InputForm2
                                id="collaborators"
                                name="collaborators"
                                placeholder="Collaborators"
                            />
                            <InputForm2
                                id="songTitle"
                                name="songTitle"
                                placeholder="Song Title"
                            />
                            <InputForm2
                                id="releaseDate"
                                name="releaseDate"
                                placeholder="Release Date (YYYY-MM-DD)"
                                type="date"
                            />
                        </div>
                        <div className="w-5/6 space-y-4">
                            <InputForm2
                                id="genre"
                                name="genre"
                                placeholder="Genre"
                            />
                            <InputForm2
                                id="region"
                                name="region"
                                placeholder="Region"
                            />
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="audio-upload"></label>
                            <input
                                id="audio-upload"
                                type="checkbox"
                                checked={checked}
                                onChange={handleCheckboxChange}
                                className="mr-3 h-[16px] w-[16px] cursor-pointer rounded-[2px] border border-[#ccc] bg-white font-kodchasan checked:bg-[#383838]"
                            />
                            <p>I read and accepted the</p>
                            <p
                                className="px-[4px] font-normal text-[#8774f9] hover:cursor-pointer hover:underline hover:opacity-80"
                                onClick={handleShowTermsAndPolicy}
                            >
                                term and policy
                            </p>
                        </div>
                        <button
                            type="submit"
                            className="m-auto select-none rounded-full border px-10 py-3 text-center"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
export default ProfilePageUploadMusic;

function InputForm2({ placeholder, type = 'text', id, name }) {
    return (
        <input
            id={id}
            name={name}
            className="h-[50px] w-full rounded-xl bg-[#383838] px-4 shadow-md placeholder:text-[#a5a5a5] focus:outline-none focus:ring-0 focus:ring-white"
            placeholder={placeholder}
            type={type}
        />
    );
}

function UploadImage2({ className, label, sizeLimit, useUploadMutation }) {
    const [preview, setPreview] = useState(null);
    const [uploadImage, setUploadImage] = useState(null);

    const handleImageUpload = (e) => {
        const image = e.target.files[0];
        if (image) {
            if (!image.type.includes('image')) {
                toast.error('Invalid file type. Please upload an image.');
            } else if (image.size > sizeLimit * 1000 * 1024) {
                toast.error(`File size exceeds the limit of ${sizeLimit} MB.`);
            } else if (image === uploadImage) {
                toast.error('This image is already uploaded.');
            } else {
                setPreview(URL.createObjectURL(image));
                setUploadImage(image);
                useUploadMutation(image);
            }
        }
    };

    return (
        <div className={`upload__form space-y-2 ${className}`}>
            <label htmlFor="file-upload" className="upload__label">
                {label}
            </label>
            <div className="upload__container relative w-max">
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
                        id="file-upload"
                        className="upload__input absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        aria-label="File upload"
                    />
                </div>
                {!preview && (
                    <span className="upload__desc absolute inline-block text-[13px] text-[#b2b2b2]">
                        {`File size is less than ${sizeLimit} MB`}
                    </span>
                )}
            </div>
        </div>
    );
}
