import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { map } from 'lodash';
import { PageTitle } from '@components';
import { UploadImage, InputForm } from '@features/profilepage/components';
import {
    selectUserProfile,
    updateCover,
    updateInfo,
    updatePassword,
} from '@features/profilepage/slices';
import {
    useUploadProfilePicMutation,
    useUploadProfileCoverMutation,
} from '@services/api';

function ProfilePageEditing() {
    const userProfile = useSelector(selectUserProfile);
    const dispatch = useDispatch();
    const [uploadProfilePic] = useUploadProfilePicMutation();

    const { name, email, dob, shortDesc, password } = userProfile;

    // State for update success/failure messages
    const [updateInfoSuccess, setUpdateInfoSuccess] = useState(null);
    const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(null);

    const handleUpdateInfo = (e) => {
        e.preventDefault();
        const [name, email, dob, shortDesc] = map(
            e.target,
            (input) => input.value,
        );
        dispatch(updateInfo({ name, email, dob, shortDesc }));
        setTimeout(() => {
            setUpdateInfoSuccess(null);
        }, 4000);
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        const [oldPassword, newPassword, repeatPassword] = map(
            e.target,
            (input) => input.value,
        );
        if (oldPassword === password && newPassword === repeatPassword) {
            dispatch(updatePassword({ password: newPassword }));
            setUpdatePasswordSuccess(true);
        } else {
            setUpdatePasswordSuccess(false);
        }
        setTimeout(() => {
            setUpdatePasswordSuccess(null);
        }, 4000);
    };

    const handleAvatarChange = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        uploadProfilePic({ file: formData })
            .unwrap()
            .then((response) => {
                console.log('Avatar updated successfully:', response);
            })
            .catch((error) => {
                console.error('Error updating avatar:', error);
            });
    };

    const handleCoverChange = (fileName) => {
        dispatch(
            updateCover({
                cover: fileName,
            }),
        );
    };

    return (
        <div className="profilepage__editing pt-8">
            <PageTitle
                className="editing__header inline"
                title="Edit Profile"
            />

            {/* Upload profile images */}
            <div className="editing__upload flex items-center space-x-8">
                <UploadImage
                    className="flex-[0.85]"
                    label="To upload an avatar click on box or drop file here!"
                    desc="File size is less than 320 KB"
                    useUploadMutation={useUploadProfilePicMutation}
                />
                <UploadImage
                    className="flex-[0.85]"
                    label="To upload a cover click on box or drop file here!"
                    desc="File size is less than 320 KB"
                    useUploadMutation={useUploadProfileCoverMutation}
                />
                <PageTitle
                    className="flex-[1.8] text-center"
                    title="Upload Profile"
                />
            </div>

            <div className="editing__container mt-8 flex text-sm">
                {/* Information editing form */}
                <form
                    className="editing__infomation relative flex-1 space-y-4"
                    onSubmit={handleUpdateInfo}
                >
                    <h2 className="inline text-3xl font-bold">
                        Your Information
                    </h2>
                    <div className="w-5/6 space-y-4">
                        <InputForm placeholder="Full Name" initValue={name} />
                        <InputForm placeholder="Email" initValue={email} />
                        <InputForm
                            placeholder="DOB"
                            initValue={dob}
                            type="date"
                        />
                        <InputForm
                            placeholder="Short Description"
                            initValue={shortDesc}
                        />
                        <div className="flex items-center justify-end">
                            <UpdateSuccess onUpdate={updateInfoSuccess} />
                            <UpdateInput />
                        </div>
                    </div>
                </form>

                {/* Password recovery form */}
                <form
                    className="editing__password flex flex-1 flex-col items-center space-y-4"
                    onSubmit={handleUpdatePassword}
                >
                    <h2 className="inline w-5/6 text-3xl font-bold">
                        Password Recovery
                    </h2>
                    <div className="w-5/6 space-y-4">
                        <InputForm placeholder="Old password" isPassword />
                        <InputForm placeholder="New password" isPassword />
                        <InputForm
                            placeholder="Repeat the password"
                            isPassword
                        />
                        <div className="flex items-center justify-end">
                            <UpdateSuccess onUpdate={updatePasswordSuccess} />
                            <UpdateInput />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfilePageEditing;

function UpdateInput() {
    return (
        <input
            className="group relative h-12 w-1/4 rounded-xl bg-[#666] shadow-md transition duration-500 ease-in-out hover:bg-[#888]"
            placeholder="Update"
            type="submit"
        ></input>
    );
}

function UpdateSuccess({ onUpdate }) {
    if (onUpdate === null) return null;
    const updateStatus = onUpdate ? 'Update successfully!' : 'Update failed!';
    const color = onUpdate ? 'text-[#06dbac]' : 'text-[#ff0000]';
    return (
        <div className="">
            <span
                className={`mr-4 block translate-y-6 font-bold ${color} animate-flyInOut opacity-0`}
            >
                {updateStatus}
            </span>
        </div>
    );
}
