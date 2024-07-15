import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForgotPasswordMutation } from '@services/api';
import { resetPwd } from '@features/authentication/slices';
import {
    AuthenTitle,
    FormInput,
    ConfirmButton,
} from '@features/authentication/components';
import { toast } from 'react-toastify';

function ForgotPassPage() {
    const [email, setEmail] = useState('');
    const [forgotPassword] = useForgotPasswordMutation();
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            return;
        }
        try {
            const res = await forgotPassword({ email: email }).unwrap();
            const resetUrl = res.url;
            const resetPwdToken = resetUrl.split('&token=')[1];
            dispatch(resetPwd(resetPwdToken));
            setEmail('');
            toast.success(res.message);
        } catch (error) {
            const errMsg = error.data.message;
            toast.error(errMsg);
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-auth-pattern bg-cover">
            <div className="w-[470px] divide-solid rounded-2xl border-[2px] border-[#5882C1] bg-[#5882C1]/[0.3] px-10 py-7">
                <AuthenTitle title="Forgot password" />
                <p className="cursor-default select-none font-kodchasan text-[17px] leading-[20px] text-[#a6a6a6]">
                    Enter your email address below and we send you a link to
                    reset your password.
                </p>
                <form onSubmit={handleSubmit}>
                    <FormInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        action={(e) => setEmail(e.target.value)}
                    />
                    <div className="mt-6 flex select-none space-x-2">
                        <ConfirmButton
                            title="Send email"
                            disabled={!email ? true : false}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassPage;
