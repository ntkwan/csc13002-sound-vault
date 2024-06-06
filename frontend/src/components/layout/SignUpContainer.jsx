import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import hide from "../../assets/img/hide.svg";
import axios from "axios";

function SignUpContainer() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signup = (req, res) => {
        axios({
            method: "post",
            data: {
                name: name,
                email: email,
                password: password
            },
            withCredentials: true,
            url: "http://localhost:5000/signup"
        }).then(res => console.log(res)).catch(err => console.log(err));
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-[370px] bg-transparent">
                <h1 className="text-center text-[55px] text-[#fcfcfc] font-italianno font-light my-3 cursor-default">
                    Sign up
                </h1>
                <p className="text-[17px] leading-[20px] text-[#a6a6a6] font-kodchasan cursor-default">
                    To upload music and products, you must accept our
                    <a href="#" className="text-[#8774f9] font-normal px-1">terms</a> and
                    <a href="#" className="text-[#8774f9] font-normal px-1">conditions</a>
                    <span className="text-[#7b7b7b]"> on the registration</span> website
                </p>

                <div className="relative mt-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="font-poppins text-[13.6px] w-full h-[50px] bg-[#383838] border-none outline-none rounded-[12px] p-4 pr-12 text-[#fcfcfc] placeholder-[#a5a5a5] shadow-md"
                        onChange={e => setName(e.target.value)}
                    >
                    </input>
                </div>

                <div className="relative mt-4">
                    <input
                        type="text"
                        placeholder="Email"
                        required
                        className="font-poppins text-[13.6px] w-full h-[50px] bg-[#383838] border-none outline-none rounded-[12px] p-4 pr-12 text-[#fcfcfc] placeholder-[#a5a5a5] shadow-md"
                        onChange={e => setEmail(e.target.value)}
                    >
                    </input>
                </div>

                <div className="relative mt-4">
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="font-poppins text-[13.6px] w-full h-[50px] bg-[#383838] border-none outline-none rounded-[12px] p-4 pr-12 text-[#fcfcfc] placeholder-[#a5a5a5] shadow-md"
                        onChange={e => setPassword(e.target.value)}
                    >
                    </input>
                    <img
                        src="{hide}"
                        alt=""
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl scale-75"
                    />
                </div>

                <div className="flex mt-6 space-x-2">
                    <a className="flex items-center justify-center w-[110px] h-[49px] border-2 border-[#fcfcfc] rounded-[15px] hover:bg-[#2d2c30] hover:border-[#2d2c30] hover:scale-105 transition-all cursor-pointer">
                        <i className='bx bxl-google text-[#fcfcfc] text-3xl'></i>
                    </a>
                    <button onClick={signup} className="flex-1 flex items-center justify-center h-[49px] bg-[#383838] rounded-[12px] text-[#fcfcfc] shadow-md hover:opacity-75 hover:scale-105 transition-all cursor-pointer">
                        <span className="font-kodchasan text-[13.5px]">Sign up</span>
                    </button>
                </div>

                <div className="mt-4 text-[#a6a6a6] text-[16px]">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="font-kodchasan mr-3 w-[16px] h-[16px] border border-[#ccc] rounded-[2px] bg-white checked:bg-[#383838] cursor-pointer"
                        />
                        I read and accepted the
                        <a href="#" className="text-[#8774f9] font-normal px-1">terms</a> and
                        <a href="#" className="text-[#8774f9] font-normal px-1">conditions</a>
                    </label>
                </div>

                <div className="mt-4 text-center text-[#a6a6a6] text-[15px] font-kodchasan cursor-default">
                    Already a member?
                    {/* <a href="#" className="font-semibold text-[#fcfcfc] px-1">Sign in</a> */}
                    <Link to="/signin" className="font-semibold text-[#fcfcfc] px-1">Sign in</Link>
                </div>
            </div>
        </div >
    );
}

export default SignUpContainer;