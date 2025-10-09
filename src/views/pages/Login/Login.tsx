import React from "react";
import { useAuthController } from "../../../controllers/AuthController";
import {
  InputWithLabel,
  InputWithLabelM,
  InputWithLabelPass,
  InputWithLabelPassM,
} from "../../components/InputWithLabel";
import arrow from "../../../assets/arrow-left-svgrepo-com.png";

const Login: React.FC = () => {
  const {
    email,
    password,
    emailError,
    passwordError,
    isLoading,
    error,
    success,
    isMobile,
    appInfo,
    setEmail,
    setPassword,
    handleSubmit,
    goToRegister,
    goToHome,
  } = useAuthController();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-xl">Logging in...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* Mobile View */}
      {isMobile ? (
        <div className="flex flex-col bg-[#ffff] w-full h-screen text-[#172A3A]">
          <button onClick={goToHome} className="self-start">
            <img
              src={arrow}
              alt="Back"
              className="w-[55px] h-[55px] p-[10px]"
            />
          </button>

          <div className="text-[32px] pt-[5px] pl-[30px] text-left">
            {appInfo.welcomeMessage}
          </div>
          <div className="text-[36px] pt-[5px] pl-[30px] pb-[30px] text-left mb-6">
            {appInfo.title}
          </div>

          {/* Success Message */}
          {success && (
            <div className="mx-[30px] mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-[30px] mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col items-center w-full space-y-5"
          >
            <InputWithLabelM
              value={email}
              onChange={(e) =>
                setEmail(typeof e === "string" ? e : e.target.value)
              }
              name="email"
              error={emailError}
            />

            <InputWithLabelPassM
              value={password}
              onChange={(e) =>
                setPassword(typeof e === "string" ? e : e.target.value)
              }
              name="password"
              error={passwordError}
            />

            <div className="w-[80%] justify-center mt-[50px]">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[55px] bg-[#345A66] text-[#ffff] border-0 rounded-[5px] text-[18px] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memuat..." : appInfo.submitButtonText}
              </button>

              <p className="text-sm text-center mt-4 text-[#172A3A]">
                {appInfo.noAccountText}{" "}
                <button
                  type="button"
                  onClick={goToRegister}
                  className="underline text-[#172A3A] hover:text-gray-600"
                >
                  {appInfo.registerLinkText}
                </button>
              </p>
            </div>
          </form>
        </div>
      ) : (
        /* Desktop View */
        <div className="bg-[#315D63] w-[582px] h-[723px] rounded-[10px] shadow-xl px-5 text-[#ffffff]">
          <div className="p-[50px]">
            <h2 className="text-[28px] text-left mb-2">
              {appInfo.desktopWelcome}
            </h2>
            <h1 className="text-[36px] text-left font-bold">
              {appInfo.desktopTitle}
            </h1>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mx-[50px] mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-[50px] mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col items-center space-y-4"
          >
            <InputWithLabel
              value={email}
              onChange={(e) =>
                setEmail(typeof e === "string" ? e : e.target.value)
              }
              name="email"
              error={emailError}
            />

            <InputWithLabelPass
              value={password}
              onChange={(e) =>
                setPassword(typeof e === "string" ? e : e.target.value)
              }
              name="password"
              error={passwordError}
            />

            <div className="w-[85%] flex justify-center mt-[40px]">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[67px] text-[20px] bg-[#ffff] border-0 text-black rounded-[5px] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memuat..." : appInfo.submitButtonText}
              </button>
            </div>

            <p className="text-center text-sm text-[#ffff] mt-3">
              {appInfo.noAccountText}{" "}
              <button
                type="button"
                onClick={goToRegister}
                className="underline text-[#ffff] hover:text-gray-200"
              >
                {appInfo.registerLinkText}
              </button>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
