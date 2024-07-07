import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@features/authentication/slices';
import { useSignInMutation } from '@services/api';
import {
    AuthenTitle,
    FormInput,
    GoogleButton,
    ConfirmButton,
} from '@features/authentication/components';
import { INPUTS, Loading } from '@components';
import { toast } from 'react-toastify';

function SignInPage() {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    const [signIn, { isLoading }] = useSignInMutation();
    const nav = useNavigate();
    const dispatch = useDispatch();

    const handleAction = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!values['email'] || !values['password']) {
            return;
        }
        try {
            const res = await signIn(values).unwrap();
            const user = values['email'];
            const token = res.accessToken;
            dispatch(setCredentials({ user, token }));
            setValues({ email: '', password: '' });
            toast.success(res.message);
            nav('/');
        } catch (error) {
            const errMsg = error.data.message;
            toast.error(errMsg);
        }
    };
    return isLoading ? (
        <Loading />
    ) : (
        <div className="flex h-screen w-screen items-center justify-center bg-auth-pattern bg-cover">
            <div className="w-[470px] divide-solid rounded-2xl border-[2px] border-[#5882C1] bg-[#5882C1]/[0.3] px-10 py-7">
                <AuthenTitle title="Sign in" />
                <form onSubmit={handleSubmit}>
                    {INPUTS.SIGN_IN.map((input) => (
                        <FormInput
                            key={input.name}
                            {...input}
                            haveIcon={input.type === 'password'}
                            value={values[input.name]}
                            action={handleAction}
                        />
                    ))}
                    <Link
                        to="/forgot-password"
                        className="select-none text-[12px] font-medium text-[#8774f9]"
                    >
                        Forgot your password?
                    </Link>
                    <div className="mt-6 flex select-none space-x-2">
                        <GoogleButton />
                        <ConfirmButton
                            title="Sign in"
                            disabled={
                                !values['email'] || !values['password']
                                    ? true
                                    : false
                            }
                        />
                    </div>
                </form>
                <div className="mt-4 select-none text-center font-kodchasan text-[15px] text-[#a6a6a6]">
                    Not a member?
                    <Link
                        to="/signup"
                        className="px-1 font-semibold text-[#fcfcfc]"
                    >
                        Sign up
                    </Link>
                    now
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
