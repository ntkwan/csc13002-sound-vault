import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSignUpMutation } from '@services/api';
import {
    AuthenTitle,
    FormInput,
    GoogleButton,
    ConfirmButton,
    TermAndPolicyBox,
} from '@features/authentication/components';
import { INPUTS, Loading } from '@components';
import { toast } from 'react-toastify';

function SignUpPage() {
    const [showTermsAndPolicy, setShowTermsAndPolicy] = useState(false);
    const handleShowTermsAndPolicy = () =>
        setShowTermsAndPolicy(!showTermsAndPolicy);

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [checked, setChecked] = useState(false);
    const nav = useNavigate();

    const [signUp, { isLoading }] = useSignUpMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (values['password'] !== values['confirmPassword']) return;
        if (
            !values['name'] ||
            !values['email'] ||
            !values['password'] ||
            !checked ||
            !values['name'].match(INPUTS.SIGN_UP[0].pattern) ||
            !values['password'].match(INPUTS.SIGN_UP[2].pattern)
        ) {
            return;
        }
        try {
            const res = await signUp(values).unwrap();
            setValues({ name: '', email: '', password: '' });
            toast.success(res.message);
            nav('/signin');
        } catch (error) {
            const errMsg = error.data.message;
            toast.error(errMsg);
        }
    };

    const handleAction = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return isLoading ? (
        <Loading />
    ) : (
        <div className="relative">
            {showTermsAndPolicy && (
                <TermAndPolicyBox
                    title="Terms and Policy"
                    onClose={handleShowTermsAndPolicy}
                />
            )}
            <div className="flex h-screen w-screen items-center justify-center bg-auth-pattern bg-cover">
                <div className="w-[470px] divide-solid rounded-2xl border-[2px] border-[#5882C1] bg-[#5882C1]/[0.3] px-10 py-7">
                    <AuthenTitle title="Sign up" />
                    <p className="cursor-default select-none font-kodchasan text-[17px] leading-[20px] text-[#a6a6a6]">
                        To upload music and products, you must accept our
                        <a href="#" className="px-1 font-normal text-[#8774f9]">
                            terms
                        </a>{' '}
                        and
                        <a href="#" className="px-1 font-normal text-[#8774f9]">
                            policy
                        </a>
                        <span className="text-[#7b7b7b]">
                            {' '}
                            on the registration
                        </span>{' '}
                        website
                    </p>
                    <form onSubmit={handleSubmit}>
                        {INPUTS.SIGN_UP.map((input) => (
                            <FormInput
                                key={input.name}
                                {...input}
                                haveIcon={input.type === 'password'}
                                value={values[input.name]}
                                action={handleAction}
                            />
                        ))}
                        <div className="mt-6 flex select-none space-x-2">
                            <GoogleButton />
                            <ConfirmButton
                                title="Sign up"
                                disabled={
                                    !values['name'] ||
                                    !values['email'] ||
                                    !values['password'] ||
                                    !checked
                                        ? true
                                        : false
                                }
                            />
                        </div>
                    </form>

                    <div className="mt-4 flex select-none text-[15px] text-[#a6a6a6]">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value={checked}
                                onClick={() => setChecked(!checked)}
                                className="mr-3 h-[16px] w-[16px] cursor-pointer rounded-[2px] border border-[#ccc] bg-white font-kodchasan checked:bg-[#383838]"
                            />
                        </label>
                        I read and accepted the
                        <p
                            className="px-[4px] font-normal text-[#8774f9] hover:underline hover:opacity-80"
                            onClick={handleShowTermsAndPolicy}
                        >
                            term and policy
                        </p>
                    </div>

                    <div className="mt-4 cursor-default select-none text-center font-kodchasan text-[15px] text-[#a6a6a6]">
                        Already a member?
                        <Link
                            to="/signin"
                            className="px-1 font-semibold text-[#fcfcfc]"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
