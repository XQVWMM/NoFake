import React from "react";
import { useHomeController } from "@/controllers/HomeController";
import logo from "../../../assets/logo.png";
import logo2 from "../../../assets/logo2.png";
import globe from "../../../assets/globe-svgrepo-com.png";
import calender from "../../../assets/calender-svgrepo-com.png";
import { useNavigate } from "react-router-dom";

const iconMap = {
  globe,
  calendar: calender,
};

const Home: React.FC = () => {
  const {
    activeButton,
    statistics,
    features,
    appInfo,
    error,
    handleButtonClick,
    isActive,
    handleStartVerification,
  } = useHomeController();
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

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
              onClick={() => navigate("/pricing")}
              className="`text-[14px] sm:text-[16px] md:text-[20px] px-5 sm:px-7 md:px-9 py-2 rounded-[10px] hover:underline hover:cursor-pointer"
            >
            Langganan
            </button>
          <button
            className={`text-[14px] sm:text-[16px] md:text-[20px] px-3 sm:px-4 md:px-6 py-2 rounded-[10px] hover:underline hover:cursor-pointer ${
              isActive("daftar")
                ? "active-btn text-white"
                : "text-black bg-transparent"
            }`}
            onClick={() => handleButtonClick("daftar")}
          >
            Daftar
          </button>
          <button
            className={`text-[14px] sm:text-[16px] md:text-[20px] px-3 sm:px-4 md:px-6 py-2 rounded-[10px] hover:underline hover:cursor-pointer ${
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

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-8 md:px-0">
        {/* Hero */}
        <section className="text-center py-6 sm:py-[18px]">
          <h1 className="text-[32px] sm:text-[48px] font-semibold mb-[10px]">
            {appInfo.title}
          </h1>
          <p className="text-[16px] sm:text-[20px] mb-[40px]">
            {appInfo.subtitle}
          </p>
        </section>

        {/* Statistics Section */}
        <section className="w-full max-w-[1152px] mx-auto rounded-[24px] overflow-hidden shadow-lg mb-[14px] p-0">
          <div className="bg-[#345A66] text-[#ffffff] p-[20px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[20px] md:gap-[10px] md:pl-[50px]">
            {statistics.map((stat, index) => (
              <div key={index}>
                <div className="flex items-end">
                  <div className="text-[28px] sm:text-[32px] leading-none mt-[20px] flex items-center">
                    {stat.value}
                    {stat.unit && (
                      <span className="text-[14px] sm:text-[16px] leading-none ml-[13px]">
                        {stat.unit}
                      </span>
                    )}
                    {stat.icon &&
                      iconMap[stat.icon as keyof typeof iconMap] && (
                        <img
                          src={iconMap[stat.icon as keyof typeof iconMap]}
                          alt=""
                          className="h-[20px] sm:h-[24px] w-[20px] sm:w-[24px] ml-[10px]"
                        />
                      )}
                  </div>
                </div>
                <p className="text-[14px] sm:text-[16px] mt-[4px]">
                  {stat.title}
                </p>
                <p className="text-[12px] sm:text-[14px] max-w-[161px] mt-[10px]">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why & Verification Section */}
        <section className="w-full max-w-[1152px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[10px] mb-[40px] text-[#ffffff]">
          <div className="bg-[#345A66] p-[20px] sm:pl-[30px] rounded-[24px] shadow-md">
            <h3 className="text-[24px] sm:text-[32px] mt-[10px] mb-[20px]">
              {appInfo.whyTitle}
            </h3>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-[20px] sm:gap-[40px]">
              <img
                src={logo2}
                alt="Logo"
                className="h-[120px] sm:h-[170px] mx-auto sm:ml-[30px]"
              />
              <div className="grid gap-[20px] sm:gap-[30px] mb-[20px] mr-[32px]">
                {features.map((feature, index) => (
                  <div key={index}>
                    <p className="text-[18px] sm:text-[28px] font-medium">
                      {feature.title}
                    </p>
                    <p className="text-[14px] sm:text-[14px]">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative bg-[#345A66] p-[20px] sm:pl-[30px] rounded-[24px] shadow-md">
            <h3 className="text-[24px] sm:text-[32px] mb-[20px]">
              {appInfo.verificationTitle}
            </h3>
            <p className="text-white pb-16 max-w-[429px]">
              {appInfo.verificationDescription}
            </p>
            <button
              className="absolute bottom-[30px] right-[30px] sm:right-[68px] min-w-[150px] sm:min-w-[190px] min-h-[45px] sm:min-h-[50px] bg-[#172A3A] text-white rounded-[10px] hover:cursor-pointer hover:bg-[#142634]"
              onClick={handleStartVerification}
            >
              {appInfo.ctaText}
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1f4d56] text-white text-center py-3 sm:py-4 mt-auto">
        <p className="text-[12px] sm:text-[14px] md:text-[16px]">
          {appInfo.footerText}
        </p>
      </footer>
    </div>
  );
};

export default Home;
