import React, { useState } from "react";
import { Input } from "./Input";
import { Label } from "./Label";
import mail from "../../assets/Mail.png";
import eyesN from "../../assets/eyesN.png";
import eyes from "../../assets/eyes.png";

interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
  name?: string;
  error?: string;
  autocomplete?: string;
}

/* ✉️ EMAIL INPUT */
export function InputWithLabel({
  value = "",
  onChange,
  name,
  error,
}: InputProps) {
  return (
    <div className="w-[85%] flex flex-col text-white ">
      <Label htmlFor="email" className="text-white text-[18px] mb-[10px]">
        Email
      </Label>

      <div className="relative">
        {/* Input */}
        <Input
          type="text"
          id="email"
          placeholder="contoh@gmail.com"
          className={`border-2 pr-10 rounded-[5px] bg-white text-[#315D63]
          placeholder:text-gray-500 placeholder:opacity-90 
          focus:outline-none focus:ring-2  transition
          ${error ? "border-red-500" : "border-black"}`}
          style={{ textIndent: "10px" }}
          value={value}
          onChange={onChange}
          name={name}
        />
        <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
          <img src={mail} alt="Mail icon" className=" w-5 h-5 " />
        </div>
      </div>

      {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
    </div>
  );
}
export function InputWithLabelM({
  value = "",
  onChange,
  name,
  error,
}: InputProps) {
  return (
    <div className="w-[85%] flex flex-col text-black space-y-1 ">
      <Label
        htmlFor="email"
        className="text-[#172A3A] font-normal text-[18px] mb-[10px]"
      >
        Email
      </Label>

      <div className="relative">
        {/* Input */}
        <Input
          type="text"
          id="email"
          placeholder="contoh@gmail.com"
          className={`border-2 pr-10 rounded-[5px] bg-white text-[#315D63]
          placeholder:text-gray-500 placeholder:opacity-90 
          focus:outline-none focus:ring-2  transition
          ${error ? "border-red-500" : "border-black"}`}
          style={{ textIndent: "10px" }}
          value={value}
          onChange={onChange}
          name={name}
        />
        <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
          <img src={mail} alt="Mail icon" className=" w-5 h-5 " />
        </div>
      </div>

      {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
    </div>
  );
}
export function InputWithLabelE({
  value = "",
  onChange,
  name,
  error,
}: InputProps) {
  return (
    <div className="w-[85%] flex flex-col text-white ">
      <Label htmlFor="email" className="text-white text-[18px] mb-[10px]">
        Email
      </Label>

      <div className="relative">
        {/* Input */}
        <Input
          type="text"
          id="email"
          placeholder="contoh@gmail.com"
          className={`border-2 pr-10 rounded-[5px] bg-white text-[#315D63]
          placeholder:text-gray-500 placeholder:opacity-90 
          focus:outline-none focus:ring-2  transition
          ${error ? "border-red-500" : "border-black"}`}
          style={{ textIndent: "10px" }}
          value={value}
          onChange={onChange}
          name={name}
        />
        <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
          <img src={mail} alt="Mail icon" className=" w-5 h-5 " />
        </div>
      </div>

      {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
    </div>
  );
}
export function InputWithLabelEE({
  value = "",
  onChange,
  name,
  error,
}: InputProps) {
  return (
    <div className="w-[85%] flex flex-col text-[#172A3A ">
      <Label
        htmlFor="email"
        className="text-[#172A3A] font-normal text-[18px] mb-[10px]"
      >
        Email
      </Label>

      <div className="relative">
        {/* Input */}
        <Input
          type="text"
          id="email"
          placeholder="contoh@gmail.com"
          className={`border-2 pr-10 rounded-[5px] bg-white text-[#315D63]
          placeholder:text-gray-500 placeholder:opacity-90 
          focus:outline-none focus:ring-2  transition
          ${error ? "border-red-500" : "border-black"}`}
          style={{ textIndent: "10px" }}
          value={value}
          onChange={onChange}
          name={name}
        />
        <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
          <img src={mail} alt="Mail icon" className=" w-5 h-5 " />
        </div>
      </div>

      {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
    </div>
  );
}

/* 🔒 PASSWORD INPUT */
export function InputWithLabelPass({
  value,
  onChange,
  name,
  error,
  autocomplete,
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="w-[85%] flex flex-col text-white space-y-1 mt-4 ">
      <Label
        htmlFor="password"
        className="text-white text-[18px] mb-[10px] mt-[10px]"
      >
        Kata Sandi
      </Label>
      <div className="relative">
        <Input
          type={isPasswordVisible ? "text" : "password"}
          id="password"
          placeholder="••••••••"
          className={`w-full rounded-[5px] bg-white text-[#315D63] placeholder:text-[18px] 
            border-2 ${error ? "border-red-400" : "border-black"} 
            focus:outline-none focus:ring-2  transition`}
          value={value}
          onChange={onChange}
          name={name}
          autoComplete={autocomplete}
          style={{ textIndent: "10px" }}
        />
        <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className=" focus:ring-0 hover:opacity-100 transition bg-transparent border-none outline-none"
          >
            <img
              src={isPasswordVisible ? eyes : eyesN}
              alt="Toggle visibility"
              className="w-[20px] h-[20px]   object-contain select-none pointer-events-none"
            />
          </button>
        </div>
      </div>

      {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
    </div>
  );
}
export function InputWithLabelPassM({
  value,
  onChange,
  name,
  error,
  autocomplete,
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="w-[85%] flex flex-col  space-y-1 mt-4 ">
      <Label
        htmlFor="password"
        className="text-[#172A3A] font-normal text-[18px] mb-[10px] mt-[30px]"
      >
        Kata Sandi
      </Label>
      <div className="relative">
        <Input
          type={isPasswordVisible ? "text" : "password"}
          id="password"
          placeholder="••••••••"
          className={`w-full rounded-[5px] bg-white text-[#315D63] placeholder:text-[18px] 
            border-2 ${error ? "border-red-400" : "border-black"} 
            focus:outline-none focus:ring-2  transition`}
          value={value}
          onChange={onChange}
          name={name}
          autoComplete={autocomplete}
          style={{ textIndent: "10px" }}
        />
        <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className=" focus:ring-0 hover:opacity-100 transition bg-transparent border-none outline-none"
          >
            <img
              src={isPasswordVisible ? eyes : eyesN}
              alt="Toggle visibility"
              className="w-[20px] h-[20px]   object-contain select-none pointer-events-none"
            />
          </button>
        </div>
      </div>

      {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
    </div>
  );
}
export function InputWithLabelPassR({
  value,
  onChange,
  name,
  error,
  autocomplete,
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="w-[85%] flex flex-col text-white">
      <Label
        htmlFor="password"
        className="text-white text-[18px] mb-[10px] mt-[10px]"
      >
        Kata Sandi
      </Label>
      <div className="relative">
        <Input
          type={isPasswordVisible ? "text" : "password"}
          id="password"
          placeholder="••••••••"
          className={`w-full rounded-[5px] bg-white text-[#315D63] placeholder:text-[18px] 
            border-2 ${error ? "border-red-400" : "border-black"} 
            focus:outline-none focus:ring-2  transition`}
          value={value}
          onChange={onChange}
          name={name}
          autoComplete={autocomplete}
          style={{ textIndent: "10px" }}
        />
        <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className=" focus:ring-0 hover:opacity-100 transition bg-transparent border-none outline-none"
          >
            <img
              src={isPasswordVisible ? eyes : eyesN}
              alt="Toggle visibility"
              className="w-[20px] h-[20px]   object-contain select-none pointer-events-none"
            />
          </button>
        </div>
      </div>

      {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function InputWithLabelPassRR({
  value,
  onChange,
  name,
  error,
  autocomplete,
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="w-[85%] flex flex-col text-white">
      <Label
        htmlFor="password"
        className="text-[#172A3A] font-normal text-[18px] mb-[10px] mt-[10px]"
      >
        Kata Sandi
      </Label>
      <div className="relative">
        <Input
          type={isPasswordVisible ? "text" : "password"}
          id="password"
          placeholder="••••••••"
          className={`w-full rounded-[5px] bg-white text-[#315D63] placeholder:text-[18px] 
            border-2 ${error ? "border-red-400" : "border-black"} 
            focus:outline-none focus:ring-2  transition`}
          value={value}
          onChange={onChange}
          name={name}
          autoComplete={autocomplete}
          style={{ textIndent: "10px" }}
        />
        <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className=" focus:ring-0 hover:opacity-100 transition bg-transparent border-none outline-none"
          >
            <img
              src={isPasswordVisible ? eyes : eyesN}
              alt="Toggle visibility"
              className="w-[20px] h-[20px]   object-contain select-none pointer-events-none"
            />
          </button>
        </div>
      </div>

      {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
    </div>
  );
}
export function InputWithLabelPassCon({
  value,
  onChange,
  name,
  error,
  autocomplete,
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="w-[85%] flex flex-col text-white space-y-1 mt-4 ">
      <Label
        htmlFor="password"
        className="text-white text-[18px] mb-[10px] mt-[10px]"
      >
        Kata Sandi (Konfirmasi)
      </Label>
      <div className="relative">
        <Input
          type={isPasswordVisible ? "text" : "password"}
          id="password"
          placeholder="••••••••"
          className={`w-full rounded-[5px] bg-white text-[#315D63] placeholder:text-[18px] 
            border-2 ${error ? "border-red-400" : "border-black"} 
            focus:outline-none focus:ring-2  transition`}
          value={value}
          onChange={onChange}
          name={name}
          autoComplete={autocomplete}
          style={{ textIndent: "10px" }}
        />
        <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className=" focus:ring-0 hover:opacity-100 transition bg-transparent border-none outline-none"
          >
            <img
              src={isPasswordVisible ? eyes : eyesN}
              alt="Toggle visibility"
              className="w-[20px] h-[20px]   object-contain select-none pointer-events-none"
            />
          </button>
        </div>
      </div>

      {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function InputWithLabelPassConn({
  value,
  onChange,
  name,
  error,
  autocomplete,
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="w-[85%] flex flex-col text-[#172A3A] space-y-1 mt-4 ">
      <Label
        htmlFor="password"
        className="text-[#172A3A] font-normal text-[18px] mb-[10px] mt-[10px]"
      >
        Kata Sandi (Konfirmasi)
      </Label>
      <div className="relative">
        <Input
          type={isPasswordVisible ? "text" : "password"}
          id="password"
          placeholder="••••••••"
          className={`w-full rounded-[5px] bg-white text-[#315D63] placeholder:text-[18px] 
            border-2 ${error ? "border-red-400" : "border-black"} 
            focus:outline-none focus:ring-2  transition`}
          value={value}
          onChange={onChange}
          name={name}
          autoComplete={autocomplete}
          style={{ textIndent: "10px" }}
        />
        <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className=" focus:ring-0 hover:opacity-100 transition bg-transparent border-none outline-none"
          >
            <img
              src={isPasswordVisible ? eyes : eyesN}
              alt="Toggle visibility"
              className="w-[20px] h-[20px]   object-contain select-none pointer-events-none"
            />
          </button>
        </div>
      </div>

      {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
    </div>
  );
}
