import React from "react";
import avatar from "../../../assets/avatar.png";
import { auth, db } from "../../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface Profile {
  isOpen: boolean;
  onClose: () => void;
}

const Profile: React.FC<Profile> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [theme, setTheme] = React.useState<string>(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "Gelap" : "Terang";
  });

  if (!isOpen) return null;

  // Listen to auth state and fetch user data from Firestore
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setEmail(user.email || "");

        // Fetch user data from Firestore
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.name || "");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        name: name,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal menyimpan profil. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose(); // Close the profile modal
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Gagal keluar. Silakan coba lagi.");
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);

    // Update localStorage
    const themeValue = selectedTheme === "Gelap" ? "dark" : "light";
    localStorage.setItem("theme", themeValue);

    // Trigger a storage event to update other components (like chat page)
    window.dispatchEvent(new Event("storage"));
  };

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
            <img
              src={avatar}
              className="w-20 h-20 rounded-full border-4 border-white shadow-md"
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-14 px-10 pb-6">
          <div className="flex justify-between items-start">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xl font-semibold text-black border-b border-gray-400 focus:outline-none"
                  placeholder="Masukkan nama Anda"
                />
              ) : (
                <h2 className="text-xl text-gray-900 font-semibold">
                  {name || "Nama belum diatur"}
                </h2>
              )}
              <p className="text-gray-500 text-base">{email}</p>
            </div>
            <div>
              {isEditing ? (
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="mt-2 text-base text-green-700 font-medium mr-[20px] ml-[20px] disabled:opacity-50"
                >
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="mt-2 text-base text-blue-700 font-medium mr-[20px]"
                >
                  Ubah Profil
                </button>
              )}
            </div>
          </div>

          {/* Tema Dropdown */}
          <div className="mt-6">
            <label className="block text-base font-medium text-gray-700 mb-1">
              Tema
            </label>
            <select
              value={theme}
              onChange={handleThemeChange}
              className="border border-gray-400 rounded-md px-3 py-1.5 text-sm text-gray-900"
            >
              <option value="Gelap">Gelap</option>
              <option value="Terang">Terang</option>
            </select>
          </div>

          {/* Logout */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleLogout}
              className="text-red-600 font-semibold text-base hover:text-red-800 transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
