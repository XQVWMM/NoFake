import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import logo2 from "../../../assets/logo2.png";
import globe from "../../../assets/globe-svgrepo-com.png";
import calender from "../../../assets/calender-svgrepo-com.png";

const Home: React.FC = () => {
  const [activeButton, setActiveButton] = useState<"daftar" | "masuk" | null>(
    null
  );

  const handleButtonClick = (button: "daftar" | "masuk") => {
    setActiveButton(button);
  };

  const isActive = (button: "daftar" | "masuk") => activeButton === button;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <style>{`
        body {
          font-family: 'Inter', sans-serif;
        }
        .active-btn {
          background: #172A3A !important;
          color: #ffffff !important;
        }
      `}</style>

      {/* Header */}
      <header className="flex flex-wrap justify-between items-center px-4 sm:px-8 md:px-[80px] py-3 bg-white sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo"
            className="h-[70px] sm:h-[100px] md:h-[120px] w-auto"
          />
        </div>

        <nav className="flex flex-wrap gap-3 sm:gap-6 md:gap-[52px] mt-2 sm:mt-0">
          <button
            className={`text-[14px] sm:text-[16px] md:text-[20px] px-3 sm:px-4 md:px-6 py-2 rounded-[10px] ${
              isActive("daftar")
                ? "active-btn text-white"
                : "text-black bg-transparent"
            }`}
            onClick={() => handleButtonClick("daftar")}
          >
            Daftar
          </button>
          <button
            className={`text-[14px] sm:text-[16px] md:text-[20px] px-3 sm:px-4 md:px-6 py-2 rounded-[10px] ${
              isActive("masuk")
                ? "active-btn text-white"
                : "text-black bg-transparent"
            }`}
            onClick={() => handleButtonClick("masuk")}
          >
            Masuk
          </button>
        </nav>
      </header>

      {/* Konten Utama */}
      <main className="flex-grow px-4 sm:px-8 md:px-0">
        {/* Hero */}
        <section className="text-center py-6 sm:py-[18px]">
          <h1 className="text-[32px] sm:text-[48px] font-semibold mb-[10px]">
            NoFake
          </h1>
          <p className="text-[16px] sm:text-[20px] mb-[40px]">
            Lindungi Diri Anda dari Misinformasi & Hoaks
          </p>
        </section>

        {/* Statistik Section */}
        <section className="w-full max-w-[1152px] mx-auto rounded-[24px] overflow-hidden shadow-lg mb-[14px] p-0">
          <div className="bg-[#345A66] text-[#ffffff] p-[20px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[20px] md:gap-[10px] md:pl-[50px]">
            <div>
              <div className="flex items-end">
                <div className="text-[28px] sm:text-[32px] leading-none mt-[20px] flex items-center">
                  1.923
                  <img
                    src={globe}
                    alt=""
                    className="h-[20px] sm:h-[24px] w-[20px] sm:w-[24px] ml-[10px]"
                  />
                </div>
              </div>
              <p className="text-[14px] sm:text-[16px] mt-[4px]">
                Total Hoaks Ditemukan (2024)
              </p>
              <p className="text-[12px] sm:text-[14px] max-w-[161px] mt-[10px]">
                Sepanjang tahun 2024, Komdigi mengidentifikasi dan
                mengklarifikasi ribuan konten hoaks.
              </p>
            </div>

            <div>
              <div className="flex items-end">
                <div className="text-[28px] sm:text-[32px] leading-none mt-[20px] flex items-center">
                  215
                  <img
                    src={calender}
                    alt=""
                    className="h-[20px] sm:h-[24px] w-[20px] sm:w-[24px] ml-[10px]"
                  />
                </div>
              </div>
              <p className="text-[14px] sm:text-[16px] mt-[4px]">
                Puncak Kasus Bulanan
              </p>
              <p className="text-[12px] sm:text-[14px] max-w-[161px] mt-[10px]">
                Jumlah kasus hoaks terbanyak terjadi pada bulan September 2024.
              </p>
            </div>

            <div>
              <div className="flex items-end mt-[20px]">
                <span className="text-[28px] sm:text-[32px] leading-none">
                  2x
                </span>
                <span className="text-[14px] sm:text-[16px] leading-none ml-[13px]">
                  Lebih Cepat
                </span>
              </div>
              <p className="text-[14px] sm:text-[16px] mt-[4px]">
                Penyebaran Hoaks
              </p>
              <p className="text-[12px] sm:text-[14px] max-w-[161px] mt-[10px]">
                Hoaks dapat viral dalam hitungan menit, jauh lebih cepat
                daripada klarifikasi.
              </p>
            </div>

            <div>
              <div className="flex items-end mt-[20px]">
                <span className="text-[28px] sm:text-[32px] leading-none">
                  70%
                </span>
                <span className="sm:text-[28px] leading-none ml-[3px]">+</span>
              </div>
              <p className="text-[14px] sm:text-[16px] mt-[4px]">
                Penyebaran Hoaks
              </p>
              <p className="text-[12px] sm:text-[14px] max-w-[161px] mt-[10px]">
                Hoaks dapat viral dalam hitungan menit, jauh lebih cepat
                daripada klarifikasi.
              </p>
            </div>
          </div>
        </section>

        {/* Mengapa & Verifikasi */}
        <section className="w-full max-w-[1152px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[10px] mb-[40px] text-[#ffffff]">
          <div className="bg-[#345A66] p-[20px] sm:pl-[30px] rounded-[24px] shadow-md">
            <h3 className="text-[24px] sm:text-[32px] mt-[10px] mb-[20px]">
              Mengapa Harus?
            </h3>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-[20px] sm:gap-[40px]">
              <img
                src={logo2}
                alt="Logo"
                className="h-[120px] sm:h-[170px] mx-auto sm:ml-[30px]"
              />
              <div className="grid gap-[20px] sm:gap-[30px] mb-[20px] mr-[32px]">
                <div>
                  <p className="text-[18px] sm:text-[28px] font-medium">
                    Akses instan
                  </p>
                  <p className="text-[14px] sm:text-[14px]">
                    melalui WhatsApp Bot
                  </p>
                </div>
                <div>
                  <p className="text-[18px] sm:text-[20px] font-medium">
                    Analisis edukatif
                  </p>
                  <p className="text-[14px] sm:text-[14px]">Mudah dipahami</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative bg-[#345A66] p-[20px] sm:pl-[30px] rounded-[24px] shadow-md">
            <h3 className="text-[24px] sm:text-[32px] mb-[20px]">
              Mulai Verifikasi
            </h3>
            <p className="text-white pb-16 max-w-[429px]">
              Bagikan tautan atau cuplikan berita yang meragukan, dan dapatkan
              hasil verifikasi yang jelas, akurat, serta mudah dipahami.
            </p>
            <button className="absolute bottom-[30px] right-[30px] sm:right-[68px] min-w-[150px] sm:min-w-[190px] min-h-[45px] sm:min-h-[50px] bg-[#172A3A] text-white rounded-[10px]">
              Coba Sekarang
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1f4d56] text-white text-center py-3 sm:py-4 mt-auto">
        <p className="text-[12px] sm:text-[14px] md:text-[16px]">
          &copy; 2025 NoFake. Semua Hak Dilindungi.
        </p>
      </footer>
    </div>
  );
};

export default Home;
