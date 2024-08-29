import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PageTitle } from '@components';
import { UploadImage, InputForm } from '@features/profilepage/components';
import { updateInfo } from '@features/profilepage/slices';
import { selectCurrentProfile } from '@services/selectors';
import {
    useGetProfileInfomationQuery,
    useUploadProfilePicMutation,
    useUploadProfileCoverMutation,
    useChangeProfileMutation,
    useChangePasswordMutation,
    useUpdateBankInfoMutation,
} from '@services/api';

function ProfilePageEditing() {
    // extract user information
    const dispatch = useDispatch();
    const { isVerified } = useSelector(selectCurrentProfile);

    // get user profile information
    const { data: ProfileInfo, isLoading: isLoadingProfileInfo } =
        useGetProfileInfomationQuery();

    // handle update information
    const [changeProfile] = useChangeProfileMutation();

    const handleUpdateInfo = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const name = formData.get('pf-fullname');
        const email = formData.get('pf-email');
        const shortDesc = formData.get('pf-shortDesc');

        if (
            ProfileInfo.name === name &&
            ProfileInfo.email === email &&
            ProfileInfo.shortDesc === shortDesc
        ) {
            toast.error('No information changed!');
            return;
        }

        try {
            await changeProfile({
                name,
                email,
                shortDesc,
            }).unwrap();
            toast.success('Updated Information Successfully!');
            dispatch(updateInfo({ name, email, shortDesc }));
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Update Information Failed!');
        }
    };

    // handle update bank information
    const [updateBankInfo, { isLoading: isLoadingUpdateBankInfo }] =
        useUpdateBankInfoMutation();

    const handleUpdateBankInfo = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const bankId = formData.get('bank');
        const accountNo = formData.get('pf-accountNumber');
        const accountName = formData.get('pf-accountName');

        try {
            const res = await updateBankInfo({
                bankId,
                accountNo,
                accountName,
            }).unwrap();
            toast.success(res.message);
        } catch (error) {
            toast.error(error.data.message);
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

    if (isLoadingProfileInfo) return;
    const { name, email, shortDesc } = ProfileInfo || {};

    return (
        <div className="profilepage__editing pt-8">
            <PageTitle
                className="editing__header inline"
                title="Edit Profile"
            />

            {/* Upload profile images */}
            <div className="editing__upload flex h-52 items-center">
                <UploadImage
                    className="flex-1"
                    id="upload-avatar"
                    label="To upload an avatar click on box or drop file here!"
                    sizeLimit={10}
                    useUploadMutation={useUploadProfilePicMutation}
                />
                <UploadImage
                    className="flex-1"
                    id="upload-cover"
                    label="To upload a cover click on box or drop file here!"
                    sizeLimit={10}
                    useUploadMutation={useUploadProfileCoverMutation}
                />
            </div>

            <div className="editing__container mt-16 flex text-sm">
                {/* Information editing form */}
                <form
                    className="editing__infomation flex-1 space-y-4"
                    onSubmit={handleUpdateInfo}
                >
                    <label
                        htmlFor="pf-fullname"
                        className="inline text-3xl font-bold"
                    >
                        Your Information
                    </label>
                    <fieldset className="w-5/6 space-y-4">
                        <InputForm
                            id="pf-fullname"
                            placeholder="Full Name"
                            initValue={name}
                            required
                        />
                        <InputForm
                            id="pf-email"
                            placeholder="Email"
                            type="email"
                            initValue={email}
                            required
                        />
                        <InputForm
                            id="pf-shortDesc"
                            placeholder="Short Description"
                            initValue={shortDesc}
                        />
                        <button
                            className="min-w-1/2 group relative float-right flex h-12 min-w-36 max-w-36 items-center justify-center rounded-full border-2 px-5 py-3"
                            type="submit"
                        >
                            {isLoadingChangePassword && iconUpdate}
                            {isLoadingChangePassword ? (
                                <span className="-translate-x-[7px]">
                                    Updating...
                                </span>
                            ) : (
                                'Change it!'
                            )}
                            <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 group-disabled:opacity-0"></div>
                        </button>
                    </fieldset>
                </form>

                {/* Bank Account Information Form */}
                {isVerified && (
                    <form
                        className="editing__bank flex flex-1 flex-col space-y-4"
                        onSubmit={handleUpdateBankInfo}
                    >
                        <label
                            htmlFor="pf-bankInfo"
                            className="inline w-5/6 text-3xl font-bold"
                        >
                            Bank Information
                        </label>
                        <fieldset className="w-5/6 space-y-4">
                            <select
                                className="relative h-[50px] w-full appearance-none rounded-xl bg-[#383838] px-4 shadow-md placeholder:text-[#a5a5a5] focus:outline-none focus:ring-0 focus:ring-white"
                                id="bank"
                                name="bank"
                                required
                            >
                                <option value="ICB">VietinBank</option>
                                <option value="VCB">Vietcombank</option>
                                <option value="BIDV">BIDV</option>
                                <option value="VBA">Agribank</option>
                                <option value="OCB">OCB</option>
                                <option value="MB">MBBank</option>
                                <option value="TCB">Techcombank</option>
                                <option value="ACB">ACB</option>
                                <option value="VPB">VPBank</option>
                                <option value="TPB">TPBank</option>
                                <option value="STB">Sacombank</option>
                                <option value="HDB">HDBank</option>
                                <option value="VCCB">VietCapitalBank</option>
                                <option value="SCB">SCB</option>
                                <option value="VIB">VIB</option>
                                <option value="SHB">SHB</option>
                                <option value="EIB">Eximbank</option>
                                <option value="MSB">MSB</option>
                                <option value="CAKE">CAKE</option>
                                <option value="Ubank">Ubank</option>
                                <option value="TIMO">Timo</option>
                                <option value="VTLMONEY">ViettelMoney</option>
                                <option value="VNPTMONEY">VNPTMoney</option>
                                <option value="SGICB">SaigonBank</option>
                                <option value="BAB">BacABank</option>
                                <option value="PVCB">PVcomBank</option>
                                <option value="Oceanbank">Oceanbank</option>
                                <option value="NCB">NCB</option>
                                <option value="SHBVN">ShinhanBank</option>
                                <option value="ABB">ABBANK</option>
                                <option value="VAB">VietABank</option>
                                <option value="NAB">NamABank</option>
                                <option value="PGB">PGBank</option>
                                <option value="VIETBANK">VietBank</option>
                                <option value="BVB">BaoVietBank</option>
                                <option value="SEAB">SeABank</option>
                                <option value="COOPBANK">COOPBANK</option>
                                <option value="LPB">LienVietPostBank</option>
                                <option value="KLB">KienLongBank</option>
                                <option value="KBank">KBank</option>
                                <option value="KBHN">KookminHN</option>
                                <option value="KEBHANAHCM">KEBHanaHCM</option>
                                <option value="KEBHANAHN">KEBHANAHN</option>
                                <option value="MAFC">MAFC</option>
                                <option value="CITIBANK">Citibank</option>
                                <option value="KBHCM">KookminHCM</option>
                                <option value="VBSP">VBSP</option>
                                <option value="WVN">Woori</option>
                                <option value="VRB">VRB</option>
                                <option value="UOB">UnitedOverseas</option>
                                <option value="SCVN">StandardChartered</option>
                                <option value="PBVN">PublicBank</option>
                                <option value="NHB HN">Nonghyup</option>
                                <option value="IVB">IndovinaBank</option>
                                <option value="IBK - HCM">IBKHCM</option>
                                <option value="IBK - HN">IBKHN</option>
                                <option value="HSBC">HSBC</option>
                                <option value="HLBVN">HongLeong</option>
                                <option value="GPB">GPBank</option>
                                <option value="DOB">DongABank</option>
                                <option value="DBS">DBSBank</option>
                                <option value="CIMB">CIMB</option>
                                <option value="CBB">CBBank</option>
                            </select>
                            <InputForm
                                id="pf-accountNumber"
                                placeholder="Account Number"
                            />
                            <InputForm
                                id="pf-accountName"
                                placeholder="Account Name"
                                initValue={name}
                            />
                            <button
                                className="min-w-1/2 group relative float-right flex h-12 min-w-36 max-w-36 items-center justify-center rounded-full border-2 px-5 py-3"
                                type="submit"
                            >
                                {isLoadingUpdateBankInfo && iconUpdate}
                                {isLoadingUpdateBankInfo ? (
                                    <span className="-translate-x-[7px]">
                                        Updating...
                                    </span>
                                ) : (
                                    'Update bank information'
                                )}
                                <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 group-disabled:opacity-0"></div>
                            </button>
                        </fieldset>
                    </form>
                )}

                {/* Password recovery form */}
                <form
                    className="editing__password flex flex-1 flex-col space-y-4"
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
                            isCheck
                            required
                        />
                        <InputForm
                            id="pf-repeatPassword"
                            placeholder="Repeat the password"
                            isPassword
                            required
                        />
                        <button
                            className="min-w-1/2 group relative float-right flex h-12 min-w-36 max-w-36 items-center justify-center rounded-full border-2 px-5 py-3"
                            type="submit"
                        >
                            {isLoadingChangePassword && iconUpdate}
                            {isLoadingChangePassword ? (
                                <span className="-translate-x-[7px]">
                                    Updating...
                                </span>
                            ) : (
                                'Update your information'
                            )}
                            <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 group-disabled:opacity-0"></div>
                        </button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default ProfilePageEditing;
