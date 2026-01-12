import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const handleLoginWithGoogle = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://cdn.dribbble.com/userupload/41711521/file/original-bbc733d00f7b57ba92811e5a0cb16c9f.gif)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="flex justify-center font-stretch-expanded font-bold text-5xl mt-10 mb-5">
              KaviosPix
            </h1>
            <p className="mb-5 font-stretch-expanded">
              Create albums, upload images with metadata, and share them
              securely—all powered by Google authentication.
            </p>
            <div className=" flex justify-center mt-5">
              <button
                onClick={handleLoginWithGoogle}
                className="btn bg-white text-black border-[#e5e5e5]"
              >
                <svg
                  aria-label="Google logo"
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <g>
                    <path d="m0 0H512V512H0" fill="#fff"></path>
                    <path
                      fill="#34a853"
                      d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                    ></path>
                    <path
                      fill="#4285f4"
                      d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                    ></path>
                    <path
                      fill="#fbbc02"
                      d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                    ></path>
                    <path
                      fill="#ea4335"
                      d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                    ></path>
                  </g>
                </svg>
                <span className="font-stretch-expanded">Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
