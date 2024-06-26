import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectUserProfile } from "@features/profilepage/slices";
import { updateInfo, updatePassword } from "@features/profilepage/slices";

import uploadIcon from '@assets/img/upload-icon.svg';
import hide from "@assets/img/hide.svg";
import nohide from "@assets/img/nohide.svg";

function ProfilePageEditing() {
  const userProfile = useSelector(selectUserProfile);
  const dispatch = useDispatch();

  const { fullName, email, dob, shortDesc, avatar, cover, password } = userProfile;
  const [newFullName, setNewFullName] = useState(fullName);
  const [newEmail, setNewEmail] = useState(email);
  const [newDob, setNewDob] = useState(dob);
  const [newShortDesc, setNewShortDesc] = useState(shortDesc);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [newAvatar, setNewAvatar] = useState(avatar);
  const [newCover, setNewCover] = useState(cover);

  const [updateInfoSuccess, setUpdateInfoSuccess] = useState(null);
  const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(null);

  const handleUpdateInfo = () => {
    setUpdateInfoSuccess(true);
    dispatch(updateInfo({
      fullName: newFullName,
      email: newEmail,
      dob: newDob,
      shortDesc: newShortDesc
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

  return (
    <div className="profilepage__editing pb-8">
      <h1 className="editing__header inline text-[120px] heading-stroke font-italianno">Edit Profile</h1>
      {/* personal infomation */}
      <div className="editing__infomation space-y-4">
        <h2 className="editing__infomation-header inline font-bold text-3xl">Your Infomation</h2>
        {/* avatar */}
        <div className="editing__infomation-container grid grid-cols-2">
          <div className="editing__box grid auto-rows-min gap-2">
            <span className="editing__box-label">To upload an avatar click on box or drop file here!</span>
            <div className="editing__box-onclick w-48 aspect-square border-2 border-dashed rounded-xl content-center">
              <img className="w-28 m-auto" src={uploadIcon} alt="" />
            </div>
            <span className="editing__box-desc text-sm text-[#b2b2b2]">File size is less than 320 KB</span>
          </div>
          {/* cover */}
          <div className="editing__box grid auto-rows-min gap-2">
            <span className="editing__box-label">To upload a cover click on box or drop file here!</span>
            <div className="editing__box-onclick w-48 aspect-square border-2 border-dashed rounded-xl content-center">
              <img className="w-28 m-auto" src={uploadIcon} alt="" />
            </div>
            <span className="editing__box-desc text-sm text-[#b2b2b2]">File size is less than 320 KB</span>
          </div>
        </div>
        {/* input */}
        <div className="w-2/3 text-sm text-end space-y-4">
          <Input
            placeholder="Full Name"
            initialValue={newFullName}
            onValueChange={setNewFullName}
          />
          <Input
            placeholder="Email"
            initialValue={newEmail}
            onValueChange={setNewEmail}
          />
          <Input
            placeholder="DOB"
            initialValue={newDob}
            onValueChange={setNewDob}
          />
          <Input
            placeholder="Short Description"
            initialValue={newShortDesc}
            onValueChange={setNewShortDesc}
          />
          <div className="flex justify-end items-center">
            <UpdateSuccess onUpdate={updateInfoSuccess} />
            <UpdateInput onUpdate={handleUpdateInfo} />
          </div>
        </div>
      </div>
      {/* password recovery */}
      <div className="editing__password mt-12 space-y-4">
        <h2 className="editing__password-header inline font-bold text-3xl">Password recovery</h2>
        <div className="w-2/3 text-sm text-end space-y-4">
          <Input
            placeholder="Old password"
            initialValue={oldPassword}
            onValueChange={setOldPassword}
            isPassword={true}
          />
          <Input
            placeholder="New password"
            initialValue={newPassword}
            onValueChange={setNewPassword}
            isPassword={true}
          />
          <Input
            placeholder="Repeat the password"
            initialValue={repeatPassword}
            onValueChange={setRepeatPassword}
            isPassword={true}
          />
          <div className="flex justify-end items-center">
            <UpdateSuccess onUpdate={updatePasswordSuccess} />
            <UpdateInput onUpdate={handleUpdatePassword} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePageEditing;

function Input({ placeholder, initialValue, onValueChange, isPassword = false }) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  const [isHidden, setIsHidden] = useState(true);
  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div className="relative">
      <input
        className="w-full h-12 pl-4 rounded-xl bg-[#383838]
                 focus:outline-none focus:ring-1 focus:ring-white
                 placeholder:text-[#b2b2b2]"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        type={isPassword && isHidden ? "password" : "text"}>
      </input>
      {isPassword && (
        <img
          src={isHidden ? hide : nohide}
          alt={isHidden ? "Hide" : "Show"}
          className="absolute right-4 top-1/2 -translate-y-1/2 scale-75 transform cursor-pointer text-xl"
          onClick={toggleVisibility}
        />
      )}
    </div>
  )
}

function UpdateInput({ onUpdate }) {
  return (
    <button
      className="group w-1/4 h-12 rounded-xl bg-[#666] relative
               hover:bg-[#888] transition duration-500 ease-in-out"
      onClick={onUpdate}>
      Update
    </button>
  )
}

function UpdateSuccess({ onUpdate }) {
  if (onUpdate == null) return null;

  const updateStatus = onUpdate ? "Update successfully!" : "Update failed!";
  const color = onUpdate ? "text-[#06dbac]" : "text-[#ff0000]";
  console.log(color);
  return (
    <div className="">
      <span className={`block mr-4 font-bold translate-y-6  ${color} animate-flyInOut opacity-0`}>{updateStatus}</span>
    </div>
  )
}