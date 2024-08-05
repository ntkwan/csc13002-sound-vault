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
import { MentionsInput, Mention } from 'react-mentions';
import { useSelector } from 'react-redux';
import { selectCurrentProfile } from '@services/selectors';
import { useGetFollowingListByIdQuery } from '@services/api';

function ProfilePageUploadMusic() {
    // handle upload audio, cover, thumbnail
    const [uploadThumbnail, setUploadThumbnail] = useState(null);
    const [uploadAudio, setUploadAudio] = useState(null);

    // handle suggestion for collaborators
    const [suggestion, setSuggestion] = useState('');
    const { id } = useSelector(selectCurrentProfile);
    const { data: followingListData } = useGetFollowingListByIdQuery(id, {
        skip: !id,
    });

    // check box for terms and policy
    const [checked, setChecked] = useState(false);
    // show terms and policy
    const [showTermsAndPolicy, setShowTermsAndPolicy] = useState(false);

    // handle submit
    const [uploadSong, { isLoading: isLoadingUploadSong }] =
        useUploadSongMutation();
    const [uploadSongThumbnail, { isLoading: isLoadingUploadThumnail }] =
        useUploadSongThumbnailMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checked) {
            toast.error('You must accept the terms and policies to proceed.');
            return;
        }

        const formData = new FormData(e.target);
        const collaborators = formData.get('collaborators');
        const songTitle = formData.get('title');
        const releaseDate = formData.get('releaseDate');
        const genre = formData.get('genre');
        const region = formData.get('region');

        if (
            songTitle &&
            releaseDate &&
            genre &&
            region &&
            uploadThumbnail &&
            uploadAudio
        ) {
            try {
                const uploadForm = new FormData();
                // formData.append('collaborators', collaborators);
                uploadForm.append('title', songTitle);
                // formData.append('releaseDate', releaseDate);
                uploadForm.append('genre', genre);
                uploadForm.append('region', region);
                uploadForm.append('audio', uploadAudio);

                const res1 = await uploadSong({
                    file: uploadForm,
                }).unwrap();

                // const res2 = await uploadSongThumbnail({
                //     file: uploadThumbnail,
                // }).unwrap();

                toast.success('Uploaded successfully!', res1);
            } catch (error) {
                console.log('-------------------', error);
                toast.error('Error uploading files.');
            }
        } else {
            toast.error('Please provide all required files.');
        }
    };

    if (followingListData) {
        const { following } = followingListData;
        var users = following?.map((user) => ({
            id: user.name,
            display: user.name,
        }));
    }

    return (
        <>
            <div className="upload-music__page pt-8">
                {showTermsAndPolicy && (
                    <TermAndPolicyBox
                        title="Terms and Policy"
                        onClose={() => setShowTermsAndPolicy(false)}
                    />
                )}
                <PageTitle title="Upload Music " className="mb-8" />
                <form
                    className="editing__upload grid grid-rows-2"
                    onSubmit={handleSubmit}
                >
                    <div className="flex space-x-[10%]">
                        <UploadAudio
                            className=""
                            id="audio-upload"
                            label="To upload music click on the box or drop file here!"
                            sizeLimit={10}
                            useUploadMutation={setUploadAudio}
                        />
                        <UploadImage2
                            className=""
                            id="thumbnail-upload"
                            label="To upload a thumbnail click on the box or drop file here!"
                            sizeLimit={10}
                            useUploadMutation={setUploadThumbnail}
                        />
                    </div>

                    <div className="upload-music__infomation relative mt-4 grid w-full grid-cols-2 items-start gap-4">
                        <fieldset className="w-5/6 space-y-4 overflow-hidden">
                            <MentionsInput
                                id="collaborators"
                                name="collaborators"
                                className="mentions h-[50px] max-w-[550px] content-center text-nowrap rounded-xl bg-[#383838] px-4 shadow-md placeholder:text-[#a5a5a5] focus:outline-none focus:ring-0 focus:ring-white"
                                placeholder="Mention Collaborators using '@' symbol"
                                value={suggestion}
                                onChange={(e) => setSuggestion(e.target.value)}
                                singleLine
                                style={{
                                    '&singleLine': {
                                        width: '100%',
                                        display: 'block',
                                        maxWidth: '550px',
                                    },
                                    input: {
                                        padding: '0 16px',
                                        height: '50px',
                                        outline: 'none',
                                        maxWidth: '100%',
                                    },
                                    control: {
                                        color: '#fff',
                                        maxWidth: '100%',
                                    },
                                    suggestions: {
                                        list: {
                                            backgroundColor: 'black',
                                        },
                                        item: {
                                            padding: '5px 15px',
                                            '&focused': {
                                                backgroundColor:
                                                    'rgba(255,255,255,0.3)',
                                            },
                                        },
                                    },
                                }}
                            >
                                <Mention
                                    data={users}
                                    appendSpaceOnAdd={true}
                                    style={{
                                        backgroundColor: '#0284c7',
                                        borderRadius: '5px',
                                    }}
                                />
                            </MentionsInput>
                            <InputForm2
                                id="title"
                                name="title"
                                placeholder="Song Title"
                                required
                            />
                            <InputForm2
                                id="releaseDate"
                                name="releaseDate"
                                placeholder="Release Date (YYYY-MM-DD)"
                                type="date"
                                required
                            />
                        </fieldset>
                        <fieldset className="w-[550px] space-y-4">
                            <select
                                id="genre"
                                name="genre"
                                className="h-[50px] w-full rounded-xl bg-[#383838] px-4 shadow-md placeholder:text-[#a5a5a5] focus:outline-none focus:ring-0 focus:ring-white"
                                required
                            >
                                <option value="" disabled>
                                    (Select Genre)
                                </option>
                                <option value="Rap">Rap</option>
                                <option value="Love">Love</option>
                                <option value="Pop">Pop</option>
                                <option value="Jazz">Jazz</option>
                                <option value="R&B">R&B</option>
                                <option value="Party">Party</option>
                            </select>
                            <select
                                id="region"
                                name="region"
                                className="h-[50px] w-full rounded-xl bg-[#383838] px-4 shadow-md placeholder:text-[#a5a5a5] focus:outline-none focus:ring-0 focus:ring-white"
                                required
                            >
                                <option value="" disabled>
                                    (Select Region)
                                </option>
                                <option value="USUK">USUK</option>
                                <option value="K-Pop">K-Pop</option>
                                <option value="V-Pop">V-Pop</option>
                            </select>
                        </fieldset>

                        <div className="flex items-center">
                            <label htmlFor="audio-upload"></label>
                            <input
                                id="audio-upload"
                                type="checkbox"
                                required
                                checked={checked}
                                onChange={() => setChecked(!checked)}
                                className="mr-3 h-[16px] w-[16px] cursor-pointer rounded-[2px] border border-[#ccc] bg-white font-kodchasan checked:bg-[#383838]"
                            />
                            <p className="text-nowrap">
                                I read and accepted the
                                <span
                                    className="px-[4px] font-normal text-[#8774f9] hover:cursor-pointer hover:underline hover:opacity-80"
                                    onClick={() => setShowTermsAndPolicy(true)}
                                >
                                    term and policy
                                </span>
                            </p>
                        </div>
                        <button
                            type="submit"
                            className="m-auto select-none rounded-full border px-10 py-3 text-center"
                        >
                            {isLoadingUploadSong || isLoadingUploadThumnail
                                ? 'Uploading...'
                                : 'Upload'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
export default ProfilePageUploadMusic;

function InputForm2({
    placeholder,
    type = 'text',
    id,
    name,
    required = false,
}) {
    return (
        <input
            id={id}
            name={name}
            className="h-[50px] w-[550px] rounded-xl bg-[#383838] px-4 shadow-md placeholder:text-[#a5a5a5] focus:outline-none focus:ring-0 focus:ring-white"
            placeholder={placeholder}
            type={type}
            required={required}
        />
    );
}

function UploadImage2({ className, id, label, sizeLimit, useUploadMutation }) {
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
                        id={id}
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
