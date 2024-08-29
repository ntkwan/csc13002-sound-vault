import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { PageTitle } from '@components';
import uploadIcon from '@assets/img/upload-icon.svg';
import { useRequestAccountVerificationMutation } from '@services/api';

function ProfileRequestVerifyPage() {
    // handle upload document
    const [UploadDocument, setUploadDocument] = useState(null);

    // handle submit
    const [requestAccountVerification, { isLoading }] =
        useRequestAccountVerificationMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const fullname = formData.get('vrf-name');
        const dob = formData.get('vrf-dob');
        const phoneNumber = formData.get('vrf-phone');

        console.log(fullname, dob, phoneNumber, UploadDocument);

        if (fullname && dob && phoneNumber && UploadDocument) {
            try {
                const uploadForm = new FormData();
                uploadForm.append('name', fullname);
                uploadForm.append('dob', dob);
                uploadForm.append('phone', phoneNumber);
                uploadForm.append('document', UploadDocument);

                const response = await requestAccountVerification({
                    file: uploadForm,
                }).unwrap();
                toast.success('Send request successfully.');
            } catch (error) {
                toast.error('Error sending request.');
            }
        } else {
            toast.error('Please provide all required files.');
        }
    };

    return (
        <div className="pf-vrf__page space-y-8">
            {/* page title */}
            <PageTitle
                className="pf-vrf__page-title"
                title="Request Verify Account"
            />

            {/* page tutorial */}
            <p className="">
                To verify your account, please fill your basic information and
                attach your personal documents (your picture of ID card,
                passport) or any documents that prove your identity.
            </p>

            {/* form */}
            <form
                className="pf-vrf__form mt-8 grid grid-cols-2 gap-y-12"
                onSubmit={handleSubmit}
            >
                {/* form input left */}
                <fieldset className="form__field h-80 w-5/6 space-y-4">
                    <label
                        className="form__label text-3xl font-bold"
                        htmlFor="vrf-fullname"
                    >
                        Your Infomation
                    </label>
                    <InputForm
                        id="vrf-name"
                        name="vrf-name"
                        placeholder="Full Name"
                        required
                    />
                    <InputForm
                        id="vrf-dob"
                        name="vrf-dob"
                        placeholder="DOB"
                        type="date"
                        required
                    />
                    <InputForm
                        id="vrf-phone"
                        name="vrf-phone"
                        placeholder="Phone Number"
                        type="number"
                        required
                    />
                </fieldset>

                {/* form input right */}
                <fieldset className="form__field h-80 space-y-4">
                    <label
                        className="form__label text-3xl font-bold"
                        htmlFor=""
                    >
                        Attach document
                    </label>

                    <div className="grid grid-cols-2 gap-12">
                        <InputUploadDocument
                            id="vrf-document"
                            label="To attach documents click on box or drop file here!"
                            className=""
                            sizeLimit={10}
                            useUploadMutation={setUploadDocument}
                        />
                        <ul className="form__document-desc list-disc">
                            <li className="desc-list">
                                <p className="">
                                    <span className="font-bold">
                                        Identification card:
                                    </span>{' '}
                                    you just need to take a photo of the front
                                    with all the information on it.
                                </p>
                            </li>
                            <li className="desc-list">
                                <p className="">
                                    <span className="font-bold">Passport:</span>{' '}
                                    you just need to take a photo of the first
                                    page of your passport.
                                </p>
                            </li>
                            <li className="desc-list">
                                <p className="">
                                    <span className="font-bold">
                                        Other documents:
                                    </span>{' '}
                                    you must ensure that the informatiion
                                    contained there in matches the information
                                    you have filled in SoundVault and you only
                                    need to attach one side of your documents
                                </p>
                            </li>
                        </ul>
                    </div>
                </fieldset>

                <button
                    className="form__button-submit relative col-start-2 m-auto flex min-w-44 max-w-44 select-none items-center justify-center justify-self-end rounded-full border-2 px-5 py-3"
                    type="submit"
                >
                    {isLoading && (
                        <svg
                            className="mr-4 h-6 w-6 animate-spin text-blue-500"
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
                    )}
                    {isLoading ? 'Sending...' : 'Send a request'}
                </button>
            </form>
        </div>
    );
}

export default ProfileRequestVerifyPage;

function InputForm({ id, name, placeholder, type = 'text', required = false }) {
    return (
        <input
            id={id}
            name={name}
            placeholder={placeholder}
            type={type}
            required={required}
            className="h-[50px] w-full rounded-xl bg-[#383838] px-4 shadow-md placeholder:text-[#a5a5a5] focus:outline-none focus:ring-0 focus:ring-white"
        />
    );
}

function InputUploadDocument({
    id,
    label,
    className,
    sizeLimit,
    useUploadMutation,
}) {
    const [preview, setPreview] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [uploadImage, setUploadImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > sizeLimit * 1000 * 1024) {
                toast.error(`File size exceeds the limit of ${sizeLimit} MB.`);
            } else if (file === uploadImage) {
                toast.error('This file is already uploaded.');
            } else {
                setFileType(file.type);
                setPreview(URL.createObjectURL(file));
                setUploadImage(file);
                useUploadMutation(file);
            }
        }
    };

    const renderPreview = () => {
        if (!preview) return null;

        // Image
        if (fileType && fileType.startsWith('image/')) {
            return (
                <img
                    src={preview}
                    alt="previewImage"
                    className="upload__preview max-h-full w-full rounded-xl object-cover"
                />
            );
        }

        // pdf
        if (fileType === 'application/pdf') {
            return (
                <embed
                    src={preview}
                    type="application/pdf"
                    className="upload__preview h-full w-full rounded-xl"
                />
            );
        }

        // another file
        return <p className="text-center text-[#b2b2b2]">{uploadImage.name}</p>;
    };

    const resetUpload = () => {
        setUploadImage(null);
        setFileType(null);
        setPreview(null);
        document.getElementById(id).value = null;
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (isModalOpen) {
            document.body.addEventListener('mousedown', closeModal);
        } else {
            document.body.removeEventListener('mousedown', closeModal);
        }
        return () => {
            document.body.removeEventListener('mousedown', closeModal);
        };
    }, [isModalOpen]);

    return (
        <>
            <div
                className={`upload__container max-h-full w-full space-y-2 ${className}`}
            >
                {/* label */}
                <label htmlFor={id} className="upload__label">
                    {preview ? (
                        <span
                            className="inline-block font-bold hover:cursor-pointer hover:underline hover:underline-offset-2"
                            onClick={() => setIsModalOpen(true)}
                        >
                            View Full
                        </span>
                    ) : (
                        label
                    )}
                </label>

                {/* upload */}
                <div className="upload__area-upload relative w-full">
                    {preview ? (
                        <div className="box-border h-[200px] w-full content-center rounded-xl border-2">
                            {renderPreview()}
                        </div>
                    ) : (
                        <div className="upload__onclick relative h-44 content-center rounded-xl border-2 border-dashed">
                            <img
                                className="upload__onclick-icon m-auto w-24"
                                src={uploadIcon}
                                alt="uploadIcon"
                            />
                            <input
                                id={id}
                                name={id}
                                className="upload__input absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                                type="file"
                                onChange={handleImageUpload}
                                aria-label="File upload"
                                required
                            />
                        </div>
                    )}
                </div>

                {!preview ? (
                    <span className="upload__desc inline-block text-[#b2b2b2]">
                        {`File size is less than ${sizeLimit} MB`}
                    </span>
                ) : (
                    <p
                        className="upload__reset hover:cursor-pointer hover:underline hover:underline-offset-2"
                        onClick={resetUpload}
                    >
                        Click here to upload another file
                    </p>
                )}
            </div>

            {/* Modal preview */}
            {isModalOpen && (
                <div className="modal__overlay fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-md">
                    <div className="modal__content relative h-[85vh] w-[50vw] overflow-y-scroll rounded-xl border-2">
                        {fileType && fileType.startsWith('image/') ? (
                            <img
                                src={preview}
                                alt="Full Image Preview"
                                className="h-max w-full rounded-xl object-cover"
                            />
                        ) : fileType === 'application/pdf' ? (
                            <embed
                                src={preview}
                                type="application/pdf"
                                className="h-full w-full rounded-xl"
                            />
                        ) : (
                            <embed
                                src={preview}
                                className="h-full w-full rounded-xl bg-white"
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
