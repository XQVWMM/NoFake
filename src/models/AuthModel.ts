import type { User, UserCredential } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginValidationErrors {
  email?: string;
  password?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: any;
  lastLoginAt: any;
  isActive: boolean;
}

export class AuthModel {
  private auth = auth;
  private db = db;

  private loginInfo = {
    welcomeMessage: "Selamat Datang,",
    title: "Masuk ke NoFake",
    desktopWelcome: "Selamat Datang Kembali",
    desktopTitle: "Masuk ke NoFake",
    submitButtonText: "Masuk",
    noAccountText: "Belum punya akun?",
    registerLinkText: "Daftar",
    forgotPasswordText: "Lupa kata sandi?",
  };

  getAppInfo() {
    return this.loginInfo;
  }

  // Firebase Authentication Methods
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update last login time
      await this.updateUserLastLogin(user.uid);

      return user;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(this.db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }

      return null;
    } catch (error) {
      console.error("Get user profile error:", error);
      throw error;
    }
  }

  // Update user last login time
  private async updateUserLastLogin(uid: string): Promise<void> {
    try {
      await updateDoc(doc(this.db, "users", uid), {
        lastLoginAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Update last login error:", error);
      // Don't throw error for this non-critical operation
    }
  }

  // Validation Methods
  validateCredentials(credentials: LoginCredentials): LoginValidationErrors {
    const errors: LoginValidationErrors = {};

    // Email validation
    if (!credentials.email) {
      errors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = "Format email tidak valid";
    }

    // Password validation
    if (!credentials.password) {
      errors.password = "Kata sandi harus diisi";
    } else if (credentials.password.length < 6) {
      errors.password = "Kata sandi minimal 6 karakter";
    }

    return errors;
  }

  isValidCredentials(credentials: LoginCredentials): boolean {
    const errors = this.validateCredentials(credentials);
    return Object.keys(errors).length === 0;
  }

  getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      // Authentication errors
      case "auth/user-not-found":
        return "Pengguna tidak ditemukan. Silakan daftar terlebih dahulu.";
      case "auth/wrong-password":
        return "Kata sandi salah. Silakan coba lagi.";
      case "auth/invalid-email":
        return "Format email tidak valid.";
      case "auth/user-disabled":
        return "Akun Anda telah dinonaktifkan.";
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan. Silakan coba lagi nanti.";
      case "auth/network-request-failed":
        return "Koneksi jaringan bermasalah. Periksa koneksi internet Anda.";
      case "auth/invalid-credential":
        return "Kredensial tidak valid. Silakan coba lagi.";
      case "auth/user-token-expired":
        return "Sesi telah berakhir. Silakan masuk kembali.";

      // Firestore errors
      case "permission-denied":
        return "Akses ditolak. Periksa izin Anda.";
      case "unavailable":
        return "Layanan sedang tidak tersedia. Coba lagi nanti.";
      case "deadline-exceeded":
        return "Waktu permintaan habis. Silakan coba lagi.";

      default:
        return "Terjadi kesalahan. Silakan coba lagi.";
    }
  }

  // Validation helpers
  isValidEmail(email: string): boolean {
    return /\S+@\S+\.\S+/.test(email);
  }
}
