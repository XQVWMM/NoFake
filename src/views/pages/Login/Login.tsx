import React, { useState, useEffect } from "react";
import {
  InputWithLabel,
  InputWithLabelM,
  InputWithLabelPass,
  InputWithLabelPassM,
} from "../../components/InputWithLabel";
import arrow from "../../../assets/arrow-left-svgrepo-com.png";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // Deteksi lebar layar dan update saat resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const validate = () => {
    let valid = true;

    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email harus diisi");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Format email tidak valid");
      valid = false;
    }

    if (!password) {
      setPasswordError("Kata sandi harus diisi");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Kata sandi minimal 6 karakter");
      valid = false;
    }

    return valid;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Email:", email);
      console.log("Password:", password);
    } else {
      console.log("Form tidak valid");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* Jika mobile */}
      {isMobile ? (
        <div className="flex flex-col  bg-[#ffff] w-full h-screen text-[#172A3A] ">
          <img src={arrow} alt="" className="w-[55px] h-[55px] p-[10px]" />
          <div className="text-[32px]  pt-[5px] pl-[30px] text-left ">
            Selamat Datang,{" "}
          </div>
          <div className="text-[36px]  pt-[5px] pl-[30px] pb-[30px] text-left mb-6">
            Masuk ke NoFake
          </div>

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
                className="w-full h-[55px] bg-[#345A66] text-[#ffff] border-0 rounded-[5px] text-[18px] hover:bg-gray-100"
              >
                Masuk
              </button>

              <p className="text-sm text-center mt-4 text-[#172A3A]">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="underline text-[#172A3A] hover:text-gray-200"
                >
                  Daftar
                </Link>
              </p>
            </div>
          </form>
        </div>
      ) : (
        // Jika desktop
        <div className="bg-[#315D63] w-[582px] h-[723px] rounded-[10px] shadow-xl px-5  text-[#ffffff]">
          <div className="p-[50px]">
            <h2 className="text-[28px] text-left mb-2">
              Selamat Datang Kembali
            </h2>
            <h1 className="text-[36px] text-left font-bold">Masuk ke NoFake</h1>
          </div>

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
                className="w-full h-[67px] text-[20px] bg-[#ffff] border-0 text-black rounded-[5px]  hover:bg-gray-100"
              >
                Masuk
              </button>
            </div>

            <p className="text-center text-sm text-[#ffff] mt-3">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="underline text-[#ffff] hover:text-gray-200"
              >
                Daftar
              </Link>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
