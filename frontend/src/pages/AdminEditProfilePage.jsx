import { useDispatch, useSelector } from 'react-redux';
import { UploadImage, InputForm } from '@features/profilepage/components';
import { updateInfo } from '@features/profilepage/slices';
import { selectCurrentProfile } from '@services/selectors';
import {
    useGetProfileInfomationQuery,
    useUploadProfilePicMutation,
    useChangeProfileMutation,
    useChangePasswordMutation,
} from '@services/api';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

function AdminEditProfilePage() {
    // extract user information
    const dispatch = useDispatch();
    const userProfile = useSelector(selectCurrentProfile);

    // get user profile information
    const { data: ProfileInfo, isLoading: isLoadingProfileInfo } =
        useGetProfileInfomationQuery();

    // handle update information
    const [changeProfile, { isLoading: isLoadingChangeProfile }] =
        useChangeProfileMutation();

    const handleUpdateInfo = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const name = formData.get('pf-fullname');
        const email = formData.get('pf-email');
        const shortDesc = formData.get('pf-shortDesc');

        try {
            await changeProfile({ name, email, shortDesc }).unwrap();
            toast.success('Updated Information Successfully!');
            dispatch(updateInfo({ name, email, shortDesc }));
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Update Information Failed!');
        }
    };

    // handle update password
    const [changePassword, { isLoading: isLoadingChangePassword }] =
        useChangePasswordMutation();

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const oldPassword = formData.get('pf-oldPassword');
        const newPassword = formData.get('pf-newPassword');
        const repeatPassword = formData.get('pf-repeatPassword');

        if (newPassword !== repeatPassword) {
            toast.error('New passwords do not match!');
            return;
        }

        try {
            await changePassword({
                current_password: oldPassword,
                attempt_password: newPassword,
                confirm_password: repeatPassword,
            }).unwrap();
            toast.success('Password updated successfully!');
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Password update failed!');
        }
    };

    // icon updating
    const iconUpdate = (
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
    );

    if (isLoadingProfileInfo) return;
    const { name, email } = ProfileInfo || {};

    return (
        <div className="profilepage__editing pt-8">
            <h1 className="admin-page__title block select-none p-2 text-7xl">
                Edit Profile
            </h1>

            {/* Upload profile images */}
            <div className="flex flex-col items-center justify-between">
                <div className="flex w-full items-center justify-center">
                    <div className="w-5/6">
                        <label
                            htmlFor="pf-fullname"
                            className="mt-12 block text-3xl font-bold"
                        >
                            Your Information
                        </label>
                        <div className="editing__upload flex items-center justify-between">
                            <UploadImage
                                id="upload-avatar"
                                label="To upload an avatar click on box or drop file here!"
                                sizeLimit={10}
                                useUploadMutation={useUploadProfilePicMutation}
                            />
                            {/* Information editing form */}
                            <div>
                                <form
                                    className="editing__infomation space-y-4"
                                    onSubmit={handleUpdateInfo}
                                >
                                    <fieldset className="mt-20 w-[450px] space-y-4">
                                        <InputForm
                                            id="pf-fullname"
                                            placeholder="Full Name"
                                            initValue={name}
                                        />
                                        <InputForm
                                            id="pf-email"
                                            placeholder="Email"
                                            initValue={email}
                                        />
                                        <button
                                            className="min-w-1/2 group relative float-right flex h-12 items-center rounded-xl bg-[#666] px-4 shadow-md transition duration-300 ease-in-out hover:cursor-pointer hover:bg-[#888]"
                                            type="submit"
                                        >
                                            {isLoadingChangeProfile &&
                                                iconUpdate}
                                            {isLoadingChangeProfile
                                                ? 'Updating...'
                                                : 'Update'}
                                        </button>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="editing__container mt-16 flex w-full text-sm">
                    {/* Password recovery form */}
                    <form
                        className="editing__password flex flex-1 flex-col items-center justify-center space-y-4"
                        onSubmit={handleUpdatePassword}
                    >
                        <label
                            htmlFor="pf-oldPassword"
                            className="inline w-5/6 text-3xl font-bold"
                        >
                            Change Password
                        </label>
                        <fieldset className="w-5/6 space-y-4">
                            <InputForm
                                id="pf-oldPassword"
                                placeholder="Old password"
                                isPassword
                                required
                            />
                            <InputForm
                                id="pf-newPassword"
                                placeholder="New password"
                                isPassword
                                required
                            />
                            <InputForm
                                id="pf-repeatPassword"
                                placeholder="Repeat the password"
                                isPassword
                                required
                            />
                            <button
                                className="min-w-1/2 group relative float-right flex h-12 items-center rounded-xl bg-[#666] px-4 shadow-md transition duration-300 ease-in-out hover:cursor-pointer hover:bg-[#888]"
                                type="submit"
                            >
                                {isLoadingChangePassword && iconUpdate}
                                {isLoadingChangePassword
                                    ? 'Updating...'
                                    : 'Update'}
                            </button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminEditProfilePage;
