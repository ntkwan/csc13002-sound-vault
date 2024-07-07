import { Navigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useResetPasswordMutation } from '@services/api';
import { selectCurrentResetPwdToken } from '@services/selectors';
import {
    AuthenTitle,
    FormInput,
    ConfirmButton,
} from '@features/authentication/components';
import { INPUTS } from '@components';

function ResetPassPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const [new_password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [resetPassword] = useResetPasswordMutation();
    const resetPwdToken = useSelector(selectCurrentResetPwdToken);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!new_password || !confirm_password) {
            return;
        }
        try {
            const body = {
                attempt_password: new_password,
                confirm_password,
            };
            await resetPassword({ email, token, body });
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setError(error.data.message);
        }
    };

    return email && token && resetPwdToken === token ? (
        <div className="flex h-screen w-screen items-center justify-center bg-auth-pattern bg-cover">
            <div className="w-[470px] divide-solid rounded-2xl border-[2px] border-[#5882C1] bg-[#5882C1]/[0.3] px-10 py-7">
                <AuthenTitle title="Reset your password" />
                <p className="cursor-default select-none font-kodchasan text-[17px] leading-[20px] text-[#a6a6a6]">
                    Enter your new password carefully. The new password must be
                    8 characters long.
                </p>
                <form onSubmit={handleSubmit}>
                    {INPUTS.RESET_PASS.map((input) => (
                        <FormInput
                            key={input.name}
                            {...input}
                            value={
                                input.name === 'new_password'
                                    ? new_password
                                    : confirm_password
                            }
                            action={
                                input.name === 'new_password'
                                    ? (e) => setPassword(e.target.value)
                                    : (e) => setConfirmPassword(e.target.value)
                            }
                            error={
                                input.name === 'new_password'
                                    ? input.error
                                    : error
                            }
                        />
                    ))}
                    <div className="mt-6 flex select-none space-x-2">
                        <ConfirmButton
                            title="Change password"
                            disabled={
                                !new_password || !confirm_password
                                    ? true
                                    : false
                            }
                        />
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <Navigate to="/" from={{ from: location }} replace></Navigate>
    );
}

export default ResetPassPage;
