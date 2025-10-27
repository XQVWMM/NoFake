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
  } = useAuthController("login");

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-xl">Logging in...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#172A3A] px-4">
      {/* Back button for mobile (kept outside form container) */}
      {isMobile && (
        <div className="self-start mb-2">
          <button onClick={goToHome} className="p-0">
            <img src={arrow} alt="Back" className="w-[48px] h-[48px] p-[6px]" />
          </button>
        </div>
      )}

      {/* Judul / heading — Diletakkan di luar container hijau seperti yang diminta */}
      <div className="text-center mt-[-10px]">
        <h1 className="text-[38px] font-bold mb-2">Selamat datang kembali</h1>
        <div className="text-center mb-10">
          <span className="text-[22px]">Masuk ke </span>
          <span className="text-[22px] font-semibold">NoFake</span>
        </div>
      </div>

      {/* Container (lebih kecil / compact) */}
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

            <div className="w-full flex justify-end">
              <button
                type="button"
                className="text-xs text-[#345A66] hover:underline hover:cursor-pointer"
              >
                Lupa kata sandi?
              </button>
            </div>

            <div className="w-full mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-[85%] h-[52px] bg-[#345A66] text-white rounded-[8px] text-[16px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memuat..." : appInfo?.submitButtonText || "Masuk"}
              </button>
            </div>

            <p className="text-sm text-center text-[#172A3A] mt-1">
              {appInfo?.noAccountText || "Belum memiliki akun?"}{" "}
              <button
                type="button"
                onClick={goToRegister}
                className="underline text-[#172A3A] hover:text-gray-600"
              >
                {appInfo?.registerLinkText || "Daftar"}
              </button>
            </p>
          </form>
        </div>
      ) : (
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

          <div className="w-full flex justify-end">
            <button
              type="button"
              className="text-xs text-[#345A66] hover:underline hover:cursor-pointer"
            >
              Lupa kata sandi?
            </button>
          </div>

          <div className="w-full flex justify-center mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[56px] text-[18px] bg-[#345A66] text-white rounded-[8px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2d4c55] hover:cursor-pointer"
            >
              {isLoading ? "Memuat..." : appInfo?.submitButtonText || "Masuk"}
            </button>
          </div>

          <p className="text-center text-sm text-[#172A3A] mt-2">
            {appInfo?.noAccountText || "Belum memiliki akun?"}{" "}
            <button
              type="button"
              onClick={goToRegister}
              className="underline text-[#345A66] hover:text-gray-600 hover:cursor-pointer"
            >
              {appInfo?.registerLinkText || "Daftar"}
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
