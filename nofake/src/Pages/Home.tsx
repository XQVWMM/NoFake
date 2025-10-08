import React, { useState } from 'react';
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";
import globe from "../assets/globe-svgrepo-com.png";
import calender from "../assets/calender-svgrepo-com.png";
const Home: React.FC = () => {
  const [activeButton, setActiveButton] = useState<'daftar' | 'masuk' | null>(null);

  const handleButtonClick = (button: 'daftar' | 'masuk') => {
    setActiveButton(button);
  };

  const isActive = (button: 'daftar' | 'masuk') => activeButton === button;

  return (
    <>
    <div className="w-full min-h-screen m-0 p-0 overflow-x-hidden bg-white">
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
      <header className="flex justify-between items-center px-4 sm:px-8 md:px-[80px] py-2 bg-white sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-[100px] sm:h-[157px] w-[100px] sm:w-[157px]" />
        </div>

        <nav className="flex items-center gap-4 sm:gap-[52px]">
          <button
            className={`text-[16px] sm:text-[20px] px-4 sm:px-6 py-2 sm:py-3 min-w-[120px] sm:min-w-[150px] min-h-[40px] sm:min-h-[50px] rounded-[10px] border-none ${
            isActive('daftar') ? 'active-btn text-white' : 'text-black bg-transparent'
            }`}
            onClick={() => handleButtonClick('daftar')}
          >
            Daftar
          </button>
          <button
            className={`text-[16px] sm:text-[20px] px-4 sm:px-6 py-2 sm:py-3 min-w-[120px] sm:min-w-[150px] min-h-[40px] sm:min-h-[50px] rounded-[10px] border-none ${
            isActive('masuk') ? 'active-btn text-white' : 'text-black bg-transparent'
          }`}
      onClick={() => handleButtonClick('masuk')}
    >
      Masuk
    </button>
  </nav>
</header>


      <section className="text-center py-[18px]">
        <h1 className="text-[48px] mb-[10px]">NoFake</h1>
        <p className="text-[20px] mb-[50px]">Lindungi Diri Anda dari Misinformasi & Hoaks</p>
      </section>

      {/* Statistik Section */}
      <section className="w-full max-w-[1152px] mx-auto items-center rounded-[24px] overflow-hidden shadow-lg mb-[14px] p-0">
        <div className="bg-[#345A66] text-[#ffffff] p-[20px] grid grid-cols-4 gap-[10px] pl-[50px]">
          <div>
            <div className="flex items-end">
              <div className="text-[32px] leading-none mt-[20px]">1.923
                <img src={globe} alt="" className="h-[24px] w-[24px]  ml-[20px]" />
              </div>
            </div>
            <p className="text-[16px]">Total Hoaks Ditemukan (2024)</p>
            <p className="text-[14px] max-w-[161px]">
              Sepanjang tahun 2024, Komdigi mengidentifikasi dan mengklarifikasi ribuan konten hoaks.
            </p>
          </div>

          <div>
            <div className="flex items-end">
              <div className="text-[32px] leading-none mt-[20px]">215
                <img src={calender} alt="" className="h-[24px] w-[24px] ml-[20px]" />
              </div>
            </div>
            <p className="text-[16px]">Puncak Kasus Bulanan</p>
            <p className="text-[14px] max-w-[161px]">Jumlah kasus hoaks terbanyak terjadi pada bulan September 2024.</p>
          </div>

          <div>
            <div className="flex items-end mt-[20px]">
              <span className="text-[32px] leading-none ">2x</span>
              <span className="text-[16px] leading-none ml-[13px]">Lebih Cepat</span>
            </div>
            <p className="text-[16px]">Penyebaran Hoaks</p>
            <p className="text-[14px] max-w-[161px]">Hoaks dapat viral dalam hitungan menit, jauh lebih cepat daripada klarifikasi.</p>
          </div>

          <div>
            <div className="text-[32px] mt-[18px]">70%+</div>
            <p className="text-[16px] ">Sebaran via Chat Pribadi</p>
            <p className="text-[14px] max-w-[161px]">Mayoritas hoaks menyebar lewat aplikasi chatting terenkripsi (misalnya WhatsApp).</p>
          </div>
        </div>
      </section>

      {/* Mengapa dan Verifikasi */}
      <section className="w-full max-w-[1152px] mx-auto items-center items-stretch grid grid-cols-2 gap-[6px] mb-[40px] text-[#ffffff]">
        <div className="bg-[#345A66] pl-[30px] rounded-[24px] shadow-md text-white">
          <div className="text-[32px] mt-[30px]">Mengapa Harus?</div>

          <div className="flex items-center gap-[55px]">
            <div className="flex">
              <img src={logo2} alt="Logo" className="h-[170px] mr-[32px] ml-[30px]" />
            </div>

            <div className="grid grid-cols-1 mb-[30px]">
              <div className="mb-4">
                <p className="text-[20px]">Akses instan</p>
                <p className="text-[14px]">melalui WhatsApp Bot</p>
              </div>

              <div>
                <p className="text-[20px]">Analisis edukatif</p>
                <p className="text-[14px]">Mudah dipahami</p>
              </div>
            </div>
          </div>
        </div>

        <div className=" relative bg-[#345A66] pl-[30px] rounded-[24px] shadow-md text-white">
          <h3 className="text-[32px] ">Mulai Verifikasi</h3>
          <p className="text-white pb-16 max-w-[429px]">
            Bagikan tautan atau cuplikan berita yang meragukan, dan dapatkan hasil verifikasi yang jelas, akurat, serta mudah dipahami.
          </p>
          <button className="absolute bottom-[40px] right-[68px] min-w-[190px] min-h-[50px] bg-[#172A3A] text-[#ffff] rounded-[10px] shadow-none outline-none focus:outline-none appearance-none border-none">
            Coba Sekarang
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1f4d56] h-[50px] text-[#ffffff]  text-center">
        <p className='pt-[20px]'>&copy; 2025 NoFake. Semua Hak Dilindungi.</p>
      </footer>
      </div>
    </>
  );
};

export default Home