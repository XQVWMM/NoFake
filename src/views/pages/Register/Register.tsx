import React, { useEffect } from "react";
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
  useEffect(() => {
    document.title = "NoFake | Register";
  }, []);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#172A3A] px-4">
      {/* Back button for mobile */}
      {isMobile && (
        <div className="self-start mb-2">
          <button onClick={goToHome} className="p-0">
            <img src={arrow} alt="Back" className="w-[48px] h-[48px] p-[6px]" />
          </button>
        </div>
      )}

      {/* Heading - mirip login */}
      <div className="text-center mt-[-10px] mb-4">
        <h1 className="text-[38px] font-bold mb-2">Selamat datang!</h1>
        <div className="text-center mb-10">
          <span className="text-[22px]">Buat akun </span>
          <span className="text-[22px] font-semibold">NoFake</span>
        </div>
      </div>

      {/* MOBILE VERSION */}
      {isMobile ? (
        <div className="bg-[#ffffff] w-full max-w-md rounded-[10px] text-[#172A3A] pb-8">
          {/* Success / Error */}
          <div className="px-6 pt-0">
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col items-center space-y-4 px-6"
          >
            <InputWithLabelEE
              value={email}
              onChange={(e) =>
                setEmail(typeof e === "string" ? e : e.target.value)
              }
              name="email"
              error={emailError}
            />

            <InputWithLabelPassRR
              value={password}
              onChange={(e) =>
                setPassword(typeof e === "string" ? e : e.target.value)
              }
              name="password"
              error={passwordError}
            />

            <InputWithLabelPassConn
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(typeof e === "string" ? e : e.target.value)
              }
              name="confirmPassword"
              error={confirmPasswordError}
            />

            <div className="w-full mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[52px] bg-[#345A66] text-white rounded-[8px] text-[16px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memuat..." : appInfo.submitButtonText || "Daftar"}
              </button>
            </div>

            <p className="text-sm text-center text-[#172A3A] mt-1">
              {(appInfo as any).hasAccountText || "Sudah memiliki akun?"}{" "}
              <button
                type="button"
                onClick={goToLogin}
                className="underline text-[#172A3A] hover:text-gray-600"
              >
                {(appInfo as any).loginLinkText || "Masuk"}
              </button>
            </p>
          </form>
        </div>
      ) : (
        // DESKTOP VERSION
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col items-center w-full max-w-sm mx-auto px-6 pb-8 space-y-4 text-[#172A3A]"
        >
          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <InputWithLabelE
            value={email}
            onChange={(e) =>
              setEmail(typeof e === "string" ? e : e.target.value)
            }
            name="email"
            error={emailError}
          />

          <InputWithLabelPassR
            value={password}
            onChange={(e) =>
              setPassword(typeof e === "string" ? e : e.target.value)
            }
            name="password"
            error={passwordError}
          />

          <InputWithLabelPassCon
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(typeof e === "string" ? e : e.target.value)
            }
            name="confirmPassword"
            error={confirmPasswordError}
          />

          <div className="w-full flex justify-center mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[56px] text-[18px] bg-[#345A66] text-white rounded-[8px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2d4c55] hover:cursor-pointer"
            >
              {isLoading ? "Memuat..." : appInfo.submitButtonText || "Daftar"}
            </button>
          </div>

          <p className="text-center text-sm text-[#172A3A] mt-2">
            {(appInfo as any).hasAccountText || "Sudah memiliki akun?"}{" "}
            <button
              type="button"
              onClick={goToLogin}
              className="underline text-[#345A66] hover:text-gray-600 hover:cursor-pointer"
            >
              {(appInfo as any).loginLinkText || "Masuk"}
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default Register;
