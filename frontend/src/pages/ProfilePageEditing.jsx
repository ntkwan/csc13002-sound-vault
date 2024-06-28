import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

  // State for form inputs
  const [newFullName, setNewFullName] = useState(fullName);
  const [newEmail, setNewEmail] = useState(email);
  const [newDob, setNewDob] = useState(dob);
  const [newShortDesc, setNewShortDesc] = useState(shortDesc);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  // State for update success/failure messages
  const [updateInfoSuccess, setUpdateInfoSuccess] = useState(null);
  const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(null);

  const handleUpdateInfo = () => {
    setUpdateInfoSuccess(true);
    dispatch(updateInfo({
      fullName: newFullName,
      email: newEmail,
      dob: newDob,
      shortDesc: newShortDesc,
    }));

    setTimeout(() => {
      setUpdateInfoSuccess(null);
    }, 4000);
  };

  const handleUpdatePassword = () => {
    if (oldPassword === password && newPassword === repeatPassword) {
      dispatch(updatePassword({
        password: newPassword
      }));
      setUpdatePasswordSuccess(true);
    } else {
      setUpdatePasswordSuccess(false);
    }
    setTimeout(() => {
      setUpdatePasswordSuccess(null);
    }, 4000);
  };

  const handleAvatarChange = (fileName) => {
    dispatch(updateAvatar({
      avatar: fileName
    }));
  };

  const handleCoverChange = (fileName) => {
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
          label="To upload an avatar click on box or drop file here!"
          desc="File size is less than 320 KB"
          className="flex-[0.85]"
          onUpdateChange={handleAvatarChange}
        />
        <UploadImage
          label="To upload a cover click on box or drop file here!"
          desc="File size is less than 320 KB"
          className="flex-[0.85]"
          onUpdateChange={handleCoverChange}
        />
        <PageTitle className="flex-[1.8] text-center" title="Upload Profile" />
      </div>

      <div className="editing__container flex mt-2 text-sm">
        {/* Information editing form */}
        <form className="editing__infomation flex-1 relative space-y-4">
          <h2 className="inline font-bold text-3xl">Your Information</h2>
          <div className="w-5/6 space-y-4">
            <InputForm
              placeholder="Full Name"
              value={newFullName}
              onChange={(value) => setNewFullName(value)}
            />
            <InputForm
              placeholder="Email"
              value={newEmail}
              onChange={(value) => setNewEmail(value)}
            />
            <InputForm
              placeholder="DOB"
              value={newDob}
              onChange={(value) => setNewDob(value)}
              type="date"
            />
            <InputForm
              placeholder="Short Description"
              value={newShortDesc}
              onChange={(value) => setNewShortDesc(value)}
            />
            <div className="flex justify-end items-center">
              <UpdateSuccess onUpdate={updateInfoSuccess} />
              <UpdateInput onUpdate={handleUpdateInfo} />
            </div>
          </div>
        </form>

        {/* Password recovery form */}
        <form className="editing__password flex-1 space-y-4 flex flex-col items-center">
          <h2 className="inline w-5/6 font-bold text-3xl">Password Recovery</h2>
          <div className="w-5/6 space-y-4">
            <InputForm
              placeholder="Old password"
              value={oldPassword}
              onChange={(value) => setOldPassword(value)}
              isPassword
            />
            <InputForm
              placeholder="New password"
              value={newPassword}
              onChange={(value) => setNewPassword(value)}
              isPassword
            />
            <InputForm
              placeholder="Repeat the password"
              value={repeatPassword}
              onChange={(value) => setRepeatPassword(value)}
              isPassword
            />
            <div className="flex justify-end items-center">
              <UpdateSuccess onUpdate={updatePasswordSuccess} />
              <UpdateInput onUpdate={handleUpdatePassword} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePageEditing;

function UpdateInput({ onUpdate }) {
  return (
    <button
      className="group w-1/4 h-12 rounded-xl bg-[#666] relative shadow-md
               hover:bg-[#888] transition duration-500 ease-in-out"
      onClick={onUpdate}
      type="button"
    >Update
    </button>
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
