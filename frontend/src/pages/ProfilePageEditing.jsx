import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { map } from "lodash";

import { PageTitle } from "@components/index";
import { UploadImage, InputForm } from "@features/profilepage/components/index";

import {
  selectUserProfile,
  updateAvatar,
  updateCover,
  updateInfo,
  updatePassword
} from "@features/profilepage/slices";

function ProfilePageEditing() {
  const userProfile = useSelector(selectUserProfile);
  const dispatch = useDispatch();

  const { fullName, email, dob, shortDesc, password } = userProfile;

  // State for update success/failure messages
  const [updateInfoSuccess, setUpdateInfoSuccess] = useState(null);
  const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(null);

  const handleUpdateInfo = e => {
    e.preventDefault();
    const [fullName, email, dob, shortDesc] = map(e.target, input => input.value);
    dispatch(updateInfo({ fullName, email, dob, shortDesc }));
    setTimeout(() => {
      setUpdateInfoSuccess(null);
    }, 4000);
  };

  const handleUpdatePassword = e => {
    e.preventDefault();
    const [oldPassword, newPassword, repeatPassword] = map(e.target, input => input.value);
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

  const handleAvatarChange = fileName => {
    dispatch(updateAvatar({
      avatar: fileName
    }));
  };

  const handleCoverChange = fileName => {
    dispatch(updateCover({
      cover: fileName
    }));
  };

  return (
    <div className="profilepage__editing pb-8">
      <PageTitle className="editing__header inline" title="Edit Profile" />

      {/* Upload profile images */}
      <div className="editing__upload flex items-center space-x-10">
        <UploadImage
          className="flex-[0.85]"
          label="To upload an avatar click on box or drop file here!"
          desc="File size is less than 320 KB"
          onUpdateChange={handleAvatarChange}
        />
        <UploadImage
          className="flex-[0.85]"
          label="To upload a cover click on box or drop file here!"
          desc="File size is less than 320 KB"
          onUpdateChange={handleCoverChange}
        />
        <PageTitle className="flex-[1.8] text-center" title="Upload Profile" />
      </div>

      <div className="editing__container flex mt-2 text-sm">
        {/* Information editing form */}
        <form
          className="editing__infomation flex-1 relative space-y-4"
          onSubmit={handleUpdateInfo}>
          <h2 className="inline font-bold text-3xl">Your Information</h2>
          <div className="w-5/6 space-y-4">
            <InputForm
              placeholder="Full Name"
              initValue={fullName}
            />
            <InputForm
              placeholder="Email"
              initValue={email}
            />
            <InputForm
              placeholder="DOB"
              initValue={dob}
              type="date"
            />
            <InputForm
              placeholder="Short Description"
              initValue={shortDesc}
            />
            <div className="flex justify-end items-center">
              <UpdateSuccess onUpdate={updateInfoSuccess} />
              <UpdateInput />
            </div>
          </div>
        </form>

        {/* Password recovery form */}
        <form
          className="editing__password flex-1 space-y-4 flex flex-col items-center"
          onSubmit={handleUpdatePassword}>
          <h2 className="inline w-5/6 font-bold text-3xl">Password Recovery</h2>
          <div className="w-5/6 space-y-4">
            <InputForm
              placeholder="Old password"
              isPassword
            />
            <InputForm
              placeholder="New password"
              isPassword
            />
            <InputForm
              placeholder="Repeat the password"
              isPassword
            />
            <div className="flex justify-end items-center">
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
      className="group w-1/4 h-12 rounded-xl bg-[#666] relative shadow-md hover:bg-[#888] transition duration-500 ease-in-out"
      placeholder="Update"
      type="submit"
    >
    </input>
  );
}

function UpdateSuccess({ onUpdate }) {
  if (onUpdate === null) return null;
  const updateStatus = onUpdate ? "Update successfully!" : "Update failed!";
  const color = onUpdate ? "text-[#06dbac]" : "text-[#ff0000]";
  return (
    <div className="">
      <span className={`block mr-4 font-bold translate-y-6 ${color} animate-flyInOut opacity-0`}>{updateStatus}</span>
    </div>
  );
}
