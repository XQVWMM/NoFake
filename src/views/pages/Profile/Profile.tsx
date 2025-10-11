import React from "react";

interface Profile {
  isOpen: boolean;
  onClose: () => void;
}

const Profile: React.FC<Profile> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Card popup */}
      <div
        className="bg-white rounded-xl shadow-lg w-[90%] md:w-[700px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#355A64] h-24 relative">
          <div className="absolute -bottom-10 left-10">
            <img className="w-20 h-20 rounded-full border-4 border-white shadow-md" />
          </div>
        </div>

        {/* Content */}
        <div className="pt-14 px-10 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">Yohan Estetika</h2>
              <p className="text-gray-500 text-base">Yohan.estetik@gmail.com</p>
            </div>
            <div>
              <button className="mt-2 text-base text-blue-700 font-medium mr-[20px]">
                Ubah Profil
              </button>
              <button className="bg-[#1E2B32] text-white px-4 py-1.5 rounded-full text-base">
                Pengaturan
              </button>
            </div>
          </div>

          {/* Tema Dropdown */}
          <div className="mt-6">
            <label className="block text-base font-medium text-gray-700 mb-1">
              Tema
            </label>
            <select className="border border-gray-400 rounded-md px-3 py-1.5 text-sm">
              <option>Gelap</option>
              <option>Terang</option>
            </select>
          </div>

          {/* Logout */}
          <div className="flex justify-end mt-8">
            <button className="text-red-600 font-semibold text-base">
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
