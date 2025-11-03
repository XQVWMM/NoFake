import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import arrowLeft from "../../assets/arrow-left-svgrepo-com.png";

export const Pricing: React.FC = () => {
  useEffect(() => {
    document.title = "NoFake | Pricing";
  }, []);
  const [isMonthly, setIsMonthly] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10">
      <button
        onClick={() => navigate("/")}
        className="absolute hover:cursor-pointer top-4 left-4 md:top-6 md:left-6 flex items-center justify-center rounded-full p-2 hover:bg-gray-100 transition"
      >
        <img
          src={arrowLeft}
          alt="Kembali"
          className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
        />
      </button>
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 mt-4">
          Pilih Rencana Verifikasi yang Tepat untuk Anda
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
          Dari pengguna harian hingga analis berita profesional — kami punya
          paket yang sesuai kebutuhan Anda.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {/* Gratis */}
        <div className="flex flex-col border border-black/25 shadow-[0_3px_6px_rgba(0,0,0,0.25)] rounded-xl p-6 ">
          <h2 className="text-3xl font-semibold text-[#345A66] mb-2 mt-6">
            Gratis
          </h2>

          <div className="flex items-end gap-1 mb-4">
            <p className="text-xs text-[#172A3A] pb-7">Rp</p>
            <p className="text-5xl font-bold text-[#345A66] leading-none pr-2">
              0
            </p>
            <div className="flex flex-col justify-end leading-tight pb-1">
              <p className="text-[12px] text-[#172A3A]">IDR /</p>
              <p className="text-[12px] text-[#172A3A]">Bulan</p>
            </div>
          </div>

          <p className="text-[#172A3A] font-medium mb-3">Cek Fakta Dasar</p>

          <button
            disabled
            className="w-full bg-gray-100 text-gray-500 border border-black/25 py-2 rounded-md text-sm font-medium cursor-not-allowed mb-5"
          >
            Paket anda saat ini
          </button>
          <hr className="mb-3" />

          <ul className="text-left text-gray-600 text-sm space-y-2">
            <li>✓ 5 verifikasi per hari</li>
            <li>✓ Chatbot interaktif dasar</li>
            <li>✓ Deteksi hoaks cepat</li>
            <li>✓ Ringkasan hasil benar/palsu</li>
          </ul>

          <p className="text-[#172A3A] text-xs mt-auto pt-6 text-left">
            Mulai gratis dan rasakan bagaimana NoFake membantu Anda memeriksa
            berita dengan mudah.
          </p>
          <p className="text-[#172A3A] text-xs mt-auto pt-6 text-center">
            Harga sudah termasuk pajak.
          </p>
        </div>

        {/* Prime1D */}
        <div className="flex flex-col border border-black/25 shadow-[0_3px_6px_rgba(0,0,0,0.25)] rounded-xl p-6">
          <h2 className="text-3xl font-semibold text-[#345A66] mb-2 mt-6">
            Prime1D
          </h2>

          <div className="flex items-end gap-1 mb-4">
            <p className="text-xs text-[#172A3A] pb-7">Rp</p>
            <p className="text-5xl font-bold text-[#345A66] leading-none pr-2">
              9.000
            </p>
            <div className="flex flex-col justify-end leading-tight pb-1">
              <p className="text-[12px] text-[#172A3A]">IDR /</p>
              <p className="text-[12px] text-[#172A3A]">Hari</p>
            </div>
          </div>

          <p className="text-[#172A3A] font-medium mb-3">
            Akses tanpa batas 24 jam penuh
          </p>

          <button className="w-full bg-[#345A66] hover:bg-[#26424b] text-white py-2 rounded-md text-sm font-medium mb-5">
            Tingkatkan ke Prime1D
          </button>
          <hr className="mb-3" />

          <ul className="text-left text-gray-600 text-sm space-y-2">
            <li>✓ Akses fitur tanpa batas 24 jam</li>
            <li>✓ Verifikasi tanpa batas</li>
            <li>✓ Riwayat hasil</li>
            <li>✓ Bebas iklan</li>
          </ul>

          <p className="text-[#172A3A] text-xs mt-auto pt-6 text-left">
            Butuh verifikasi intens dalam waktu singkat?
            <br />
            Gunakan paket Unlimited 1 Hari - bayar sekali, gunakan sepuasnya
            tanpa batas.
          </p>
          <p className="text-[#172A3A] text-xs mt-auto pt-6 text-center">
            Harga sudah termasuk pajak.
          </p>
        </div>

        {/* Pro */}
        <div className="flex flex-col border border-black/25 shadow-[0_3px_6px_rgba(0,0,0,0.25)] rounded-xl p-6 relative">
          <div className="absolute right-5 top-5 flex bg-gray-300 rounded-full text-sm">
            <button
              onClick={() => setIsMonthly(true)}
              className={`px-3 py-1 rounded-full ${
                isMonthly ? "bg-[#345A66] text-white" : "text-gray-800"
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setIsMonthly(false)}
              className={`px-3 py-1 rounded-full ${
                !isMonthly ? "bg-[#345A66] text-white" : "text-gray-800"
              }`}
            >
              Tahunan
            </button>
          </div>

          <h2 className="text-3xl font-semibold text-[#345A66] mb-2 mt-6">
            Pro
          </h2>

          <div className="flex items-end gap-1 mb-4">
            <p className="text-xs text-[#172A3A] pb-7">Rp</p>
            <p className="text-5xl font-bold text-[#345A66] leading-none pr-2">
              {isMonthly ? "49.000" : "29.000"}
            </p>
            <div className="flex flex-col justify-end leading-tight pb-1">
              <p className="text-[12px] text-[#172A3A]">IDR /</p>
              <p className="text-[12px] text-[#172A3A]">
                {isMonthly ? "Bulan" : "Bulan"}
              </p>
            </div>
          </div>

          <p className="text-[#172A3A] font-medium mb-3">
            Verifikasi Cerdas Tanpa Batas
          </p>

          <button className="w-full bg-[#345A66] hover:bg-[#26424b] text-white py-2 rounded-md text-sm font-medium mb-5">
            Tingkatkan ke Pro
          </button>
          <hr className="mb-3" />

          <ul className="text-left text-gray-600 text-sm space-y-2">
            <li>✓ Semua fitur di paket Gratis dan:</li>
            <li>✓ Tanpa batas verifikasi</li>
            <li>✓ Bebas iklan</li>
            <li>✓ Riwayat pencarian 30 hari</li>
            <li>✓ Prioritas respon chatbot</li>
          </ul>

          <p className="text-[#172A3A] text-xs mt-auto pt-6 text-left">
            Solusi lengkap untuk profesional yang membutuhkan verifikasi berita
            cepat, mendalam, dan akurat.
          </p>
          <p className="text-[#172A3A] text-xs mt-auto pt-6 text-center">
            Harga sudah termasuk pajak.
          </p>
        </div>
      </div>
    </div>
  );
};
