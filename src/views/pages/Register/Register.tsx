import React from "react";
import { useAuthController } from "../../../controllers/AuthController";
import {
  InputWithLabel,
  InputWithLabelE,
  InputWithLabelEE,
  InputWithLabelPass,
  InputWithLabelPassCon,
  InputWithLabelPassConn,
  InputWithLabelPassR,
  InputWithLabelPassRR,
} from "../../components/InputWithLabel";
import arrow from "../../../assets/arrow-left-svgrepo-com.png";

const Register: React.FC = () => {
  const {
    email,
    password,
    confirmPassword,
    emailError,
    passwordError,
    confirmPasswordError,
    isLoading,
    error,
    success,
    isMobile,
    appInfo,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    goToLogin,
    goToHome,
  } = useAuthController("register");

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-xl">Creating account...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* Jika mobile */}
      {isMobile ? (
        <div className="flex flex-col  bg-[#ffff] w-full h-screen text-[#172A3A] ">
          <button onClick={goToHome} className="self-start">
            <img
              src={arrow}
              alt="Back"
              className="w-[55px] h-[55px] p-[10px]"
            />
          </button>
          <div className="text-[32px]  pt-[5px] pl-[30px] text-left ">
            {appInfo.welcomeMessage}
          </div>
          <div className="text-[32px]  pt-[5px] pl-[30px] text-left mb-[30px]">
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
            className="flex flex-col items-center w-full space-y-5 text-black"
          >
            <InputWithLabelEE
              value={email}
              onChange={(e) =>
                setEmail(
                  typeof e === "string"
                    ? e
                    : (e.target as HTMLInputElement).value
                )
              }
              name="email"
              error={emailError}
            />

            <InputWithLabelPassRR
              value={password}
              onChange={(e) =>
                setPassword(
                  typeof e === "string"
                    ? e
                    : (e.target as HTMLInputElement).value
                )
              }
              name="password"
              error={passwordError}
            />

            <InputWithLabelPassConn
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  typeof e === "string"
                    ? e
                    : (e.target as HTMLInputElement).value
                )
              }
              name="confirmPassword"
              error={confirmPasswordError}
            />
            <div className="w-[80%] justify-center mt-[50px]">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[55px] bg-[#345A66] text-[#ffff] border-0 rounded-[5px] text-[18px] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memuat..." : appInfo.submitButtonText}
              </button>

              <p className="text-sm text-center text-[#172A3A] mt-4">
                {(appInfo as any).hasAccountText || "Sudah memiliki akun?"}{" "}
                <button
                  type="button"
                  onClick={goToLogin}
                  className="underline text-[#172A3A] hover:text-gray-600"
                >
                  {(appInfo as any).loginLinkText || "Masuk"}
                </button>
              </p>
            </div>
          </form>
        </div>
      ) : (
        // Jika desktop
        <div className="bg-[#315D63] w-[582px] h-[772px] rounded-[10px] shadow-xl text-[#ffffff]">
          <div className="pl-[40px] pt-[40px] pb-[30px]">
            <div className="text-[28px] text-left ">{appInfo.desktopTitle}</div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mx-[40px] mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-[40px] mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col items-center"
          >
            <InputWithLabelE
              value={email}
              onChange={(e) =>
                setEmail(
                  typeof e === "string"
                    ? e
                    : (e.target as HTMLInputElement).value
                )
              }
              name="email"
              error={emailError}
            />

            <InputWithLabelPassR
              value={password}
              onChange={(e) =>
                setPassword(
                  typeof e === "string"
                    ? e
                    : (e.target as HTMLInputElement).value
                )
              }
              name="password"
              error={passwordError}
            />
            <InputWithLabelPassCon
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  typeof e === "string"
                    ? e
                    : (e.target as HTMLInputElement).value
                )
              }
              name="confirmPassword"
              error={confirmPasswordError}
            />

            <div className="w-[85%] flex justify-center mt-[60px]">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[67px] text-[20px] bg-[#ffff] border-0 text-black rounded-[5px]  hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memuat..." : appInfo.submitButtonText}
              </button>
            </div>

            <p className="text-center text-sm text-[#ffff] mt-15">
              {(appInfo as any).hasAccountText || "Sudah memiliki akun?"}{" "}
              <button
                type="button"
                onClick={goToLogin}
                className="underline text-[#fff] hover:text-gray-200"
              >
                {(appInfo as any).loginLinkText || "Masuk"}
              </button>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
