import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
    useSubmitMusicMutation,
    useGetFollowingListByIdQuery,
} from '@services/api';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { MentionsInput, Mention } from 'react-mentions';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentProfile } from '@services/selectors';
import { PageTitle } from '@components';
import { UploadAudio } from '@features/profilepage/components';
import { TermAndPolicyBox } from '@features/authentication/components';
import uploadIcon from '@assets/img/upload-icon.svg';

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
    // handle genres
    const genres = [
        { id: 'Rap', display: 'Rap' },
        { id: 'Love', display: 'Love' },
        { id: 'Pop', display: 'Pop' },
        { id: 'Jazz', display: 'Jazz' },
        { id: 'R&B', display: 'R&B' },
        { id: 'Party', display: 'Party' },
        { id: 'Indie', display: 'Indie' },
        { id: 'Chill', display: 'Chill' },
    ];
    const [genre, setGenre] = useState('');
    // handle size mention-react input
    const [maxWidthPx, setMaxWidthPx] = useState(0);
    const updateMaxWidthPx = () => {
        const viewportWidth = window.innerWidth;
        const newMaxWidthPx = ((viewportWidth - 160 - 180) / 2) * (5 / 6);
        setMaxWidthPx(newMaxWidthPx);
    };
    useEffect(() => {
        updateMaxWidthPx();
        window.addEventListener('resize', updateMaxWidthPx);
        return () => window.removeEventListener('resize', updateMaxWidthPx);
    }, []);

    // check box for terms and policy
    const [checked, setChecked] = useState(false);
    // show terms and policy
    const [showTermsAndPolicy, setShowTermsAndPolicy] = useState(false);
    // handle navigate
    const navigate = useNavigate();

    // handle submit
    const [submitMusic, { isLoading: isLoadingSubmitMusic }] =
        useSubmitMusicMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checked) {
            toast.error('You must accept the terms and policies to proceed.');
            return;
        }

        const formData = new FormData(e.target);
        // const collaborators = formData.get('collaborators');
        const songTitle = formData.get('title');
        // const genre = formData.get('genre');
        const region = formData.get('region');
        // @[Love](Love) @[Love](Love)
        const genrePrePs = genre.replace(/@\[([^\]]+)\]\(([^\)]+)\)/g, '$1');
        const words = genrePrePs.split(/\s+/);
        const uniqueWords = Array.from(new Set(words));
        const genreArray = uniqueWords.join(' ');

        if (
            songTitle &&
            genreArray &&
            region &&
            uploadThumbnail &&
            uploadAudio
        ) {
            try {
                const uploadForm = new FormData();
                // formData.append('collaborators', collaborators);
                uploadForm.append('title', songTitle);
                uploadForm.append('genre', genreArray);
                uploadForm.append('region', region);
                uploadForm.append('thumbnail', uploadThumbnail);
                uploadForm.append('audio', uploadAudio);
                const response = await submitMusic({
                    file: uploadForm,
                }).unwrap();
                navigate(`/song/${response.songId}`);
                toast.success('Uploaded successfully!');
            } catch (error) {
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

    const iconUpdate = (
        <svg
            className="mr-4 min-h-5 min-w-5 animate-spin text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );

    return (
        <>
            <div className="upload-music__page pt-8">
                {showTermsAndPolicy && (
                    <TermAndPolicyBox
                        title="Terms and Policy"
                        onClose={() => setShowTermsAndPolicy(false)}
                    />
                )}
                {/* title */}
                <PageTitle title="Upload Music" className="mb-8" />

                {/* upload form */}
                <form
                    className="upload-music__form grid grid-rows-2 gap-8"
                    onSubmit={handleSubmit}
                >
                    {/* field upload audio and thumbnail */}
                    <fieldset className="upload-music__field-1 flex h-60">
                        {/* upload audio */}
                        <UploadAudio
                            id="audio-upload"
                            className="upload-music__audio flex-1"
                            label="To upload music click on the box or drop file here!"
                            sizeLimit={10}
                            useUploadMutation={setUploadAudio}
                        />

                        {/* upload thumbnail */}
                        <UploadImage
                            id="thumbnail-upload"
                            className="upload-music__thumbnail flex-1"
                            label="To upload a thumbnail click on the box or drop file here!"
                            sizeLimit={10}
                            useUploadMutation={setUploadThumbnail}
                        />
                    </fieldset>

                    {/* field upload information */}
                    <div className="upload-music__infomation relative grid w-full grid-cols-2 items-start gap-4">
                        <fieldset className="upload-music__field-2 w-5/6 space-y-4 overflow-hidden">
                            {/* colaboration */}
                            <MentionsInput
                                id="collaborators"
                                name="collaborators"
                                className="upload-music__collaborators h-[50px] w-full content-center hyphens-manual text-nowrap rounded-xl bg-[#383838] px-4 shadow-md placeholder:text-[#a5a5a5] focus:outline-none focus:ring-0 focus:ring-white"
                                placeholder="Mention Collaborators using '@' symbol"
                                value={suggestion}
                                onChange={(e) => setSuggestion(e.target.value)}
                                singleLine
                                style={{
                                    '&singleLine': {
                                        display: 'block',
                                        width: `${maxWidthPx}px`,
                                    },
                                    input: {
                                        padding: '0 16px',
                                        height: '50px',
                                        outline: 'none',
                                    },
                                    control: {
                                        color: '#fff',
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
                                    data={users ?? []}
                                    appendSpaceOnAdd={true}
                                    style={{
                                        backgroundColor: '#0284c7',
                                        borderRadius: '5px',
                                    }}
                                />
                            </MentionsInput>

                            {/* song title */}
                            <InputForm
                                id="title"
                                name="title"
                                placeholder="Song Title"
                                required
                            />
                        </fieldset>

                        <fieldset className="upload-music__field-3 w-5/6 space-y-4">
                            {/* genres  */}
                            <MentionsInput
                                id="genres"
                                name="genres"
                                className="upload-music__genres h-[50px] w-full content-center hyphens-manual text-nowrap rounded-xl bg-[#383838] px-4 shadow-md placeholder:text-[#a5a5a5] focus:outline-none focus:ring-0 focus:ring-white"
                                placeholder="Mention genres using '@' symbol"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                singleLine
                                style={{
                                    '&singleLine': {
                                        display: 'block',
                                        width: `${maxWidthPx}px`,
                                    },
                                    input: {
                                        padding: '0 16px',
                                        height: '50px',
                                        outline: 'none',
                                    },
                                    control: {
                                        color: '#fff',
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
                                    data={genres}
                                    appendSpaceOnAdd={true}
                                    style={{
                                        backgroundColor: '#0284c7',
                                        borderRadius: '5px',
                                    }}
                                />
                            </MentionsInput>

                            {/* region */}
                            <select
                                id="region"
                                name="region"
                                className="h-[50px] w-full rounded-xl bg-[#383838] px-4 shadow-md placeholder:text-[#a5a5a5] focus:outline-none focus:ring-0 focus:ring-white"
                                required
                            >
                                <option value="" defaultValue>
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
                            className="relative m-auto flex min-w-36 max-w-36 select-none items-center justify-center rounded-full border-2 px-5 py-3"
                            type="submit"
                        >
                            {isLoadingSubmitMusic && iconUpdate}
                            {isLoadingSubmitMusic ? (
                                <span className="-translate-x-[7px]">
                                    Updating...
                                </span>
                            ) : (
                                'Update'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
export default ProfilePageUploadMusic;

function InputForm({ placeholder, type = 'text', id, name, required = false }) {
    return (
        <input
            id={id}
            name={name}
            className="h-[50px] w-full rounded-xl bg-[#383838] px-4 shadow-md placeholder:text-[#a5a5a5] focus:outline-none focus:ring-0 focus:ring-white"
            placeholder={placeholder}
            type={type}
            required={required}
        />
    );
}

function UploadImage({ className, id, label, sizeLimit, useUploadMutation }) {
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
            <label htmlFor="file-upload" className="upload__label inline-block">
                {label}
                <div className="upload__container relative m-auto mt-2 w-max">
                    <div className="upload__onclick relative h-44 w-44 content-center rounded-xl border-2 border-dashed">
                        {preview ? (
                            <img
                                className="upload__preview m-auto h-full w-full rounded-xl object-cover"
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
                        <span className="upload__desc text-[13px] text-[#b2b2b2]">
                            {`File size is less than ${sizeLimit} MB`}
                        </span>
                    )}
                </div>
            </label>
        </div>
    );
}

UploadImage.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    sizeLimit: PropTypes.number,
    useUploadMutation: PropTypes.func,
};

InputForm.propTypes = {
    placeholder: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    required: PropTypes.bool,
};
