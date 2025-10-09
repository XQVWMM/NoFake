import React, { useState, useEffect } from "react";
import { InputWithLabel, InputWithLabelE, InputWithLabelEE, InputWithLabelPass, InputWithLabelPassCon, InputWithLabelPassConn, InputWithLabelPassR, InputWithLabelPassRR } from "../components/InputWithLabel";
import arrow from "../assets/arrow-left-svgrepo-com.png";
import { Link } from "react-router-dom";
const Register: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
   const [confirmPasswordError, setConfirmPasswordError] = useState(""); 
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
    setConfirmPasswordError("");
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

    if (!confirmPassword) {
      setConfirmPasswordError("Konfirmasi kata sandi harus diisi");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Kata sandi tidak sama");
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
          <img src={arrow} alt="" className="w-[55px] h-[55px] p-[10px]"/>
          <div className="text-[32px]  pt-[5px] pl-[30px] text-left ">Selamat Datang, </div>
          <div className="text-[32px]  pt-[5px] pl-[30px] text-left mb-[30px]">Daftar ke NoFake </div>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col items-center w-full space-y-5 text-black">
            <InputWithLabelEE
              value={email}
              onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
              name="email"
              error={emailError}
            />

            <InputWithLabelPassRR
              value={password}
              onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
              name="password"
              error={passwordError}
            />

            <InputWithLabelPassConn
              value={confirmPassword}
              onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
              name="confirmPassword"
              error={confirmPasswordError}
            />
          <div className="w-[80%] justify-center mt-[50px]">
            <button
              type="submit"
              className="w-full h-[55px] bg-[#345A66] text-[#ffff] border-0 rounded-[5px] text-[18px] hover:bg-gray-100"
            >
              Daftar
            </button>

            <p className="text-sm text-center text-[#172A3A] mt-4">
              Sudah memiliki akun?{" "}
              <Link
                to="/login"
                className="underline text-[#172A3A] hover:text-gray-200"
              >
                Masuk
              </Link>
            </p>
            </div>
          </form>
        </div>
      ) : (
        // Jika desktop
        <div className="bg-[#315D63] w-[582px] h-[772px] rounded-[10px] shadow-xl text-[#ffffff]">
          <div className="pl-[40px] pt-[40px] pb-[30px]">
            <div className="text-[28px] text-left ">Daftar ke NoFake</div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col items-center">
            <InputWithLabelE
              value={email}
              onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
              name="email"
              error={emailError}
            />

            <InputWithLabelPassR
              value={password}
              onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
              name="password"
              error={passwordError}
            />
            <InputWithLabelPassCon
              value={confirmPassword}
              onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
              name="confirmPassword"
              error={confirmPasswordError}
            />

            <div className="w-[85%] flex justify-center mt-[60px]">
              <button
                type="submit"
                className="w-full h-[67px] text-[20px] bg-[#ffff] border-0 text-black rounded-[5px]  hover:bg-gray-100"
              >
                Daftar
              </button>
            </div>

            <p className="text-center text-sm text-[#ffff] mt-15">
              Sudah memiliki akun?{" "}
              <Link
                to="/login"
                className="underline text-[#fff] hover:text-gray-200"
              >
                Masuk
              </Link>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
