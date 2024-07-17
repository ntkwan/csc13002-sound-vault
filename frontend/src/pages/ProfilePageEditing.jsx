import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { map } from 'lodash';
import { PageTitle } from '@components';
import { UploadImage, InputForm } from '@features/profilepage/components';
import {
    selectUserProfile,
    updateInfo,
    updatePassword,
} from '@features/profilepage/slices';
import {
    useUploadProfilePicMutation,
    useUploadProfileCoverMutation,
} from '@services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProfilePageEditing() {
    const userProfile = useSelector(selectUserProfile);
    const dispatch = useDispatch();
    const [uploadProfilePic] = useUploadProfilePicMutation();

    const { name, email, dob, shortDesc, password } = userProfile;

    const handleUpdateInfo = (e) => {
        e.preventDefault();
        const [name, email, dob, shortDesc] = map(
            e.target,
            (input) => input.value,
        );
        dispatch(updateInfo({ name, email, dob, shortDesc }));
        toast.success('Information updated successfully!');
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        const [oldPassword, newPassword, repeatPassword] = map(
            e.target,
            (input) => input.value,
        );
        if (oldPassword === password && newPassword === repeatPassword) {
            dispatch(updatePassword({ password: newPassword }));
            toast.success('Password updated successfully!');
        } else {
            toast.error('Password update failed!');
        }
    };

    return (
        <div className="profilepage__editing pt-8">
            <ToastContainer />
            <PageTitle
                className="editing__header inline"
                title="Edit Profile"
            />

            {/* Upload profile images */}
            <div className="editing__upload flex items-center">
                <UploadImage
                    className=""
                    label="To upload an avatar click on box or drop file here!"
                    desc="File size is less than 800 KB"
                    useUploadMutation={useUploadProfilePicMutation}
                />
                <UploadImage
                    className="ml-12"
                    label="To upload a cover click on box or drop file here!"
                    desc="File size is less than 800 KB"
                    useUploadMutation={useUploadProfileCoverMutation}
                />
                {/* <PageTitle
                    className="flex-[1.8] text-center"
                    title="Upload Profile"
                /> */}
            </div>

            <div className="editing__container mt-16 flex text-sm">
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
        <button
            className="group relative h-12 w-1/4 rounded-xl bg-[#666] shadow-md transition duration-500 ease-in-out hover:cursor-pointer hover:bg-[#888]"
            type="submit"
        >
            Submit
        </button>
    );
}
