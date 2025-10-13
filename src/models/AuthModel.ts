import type { User, UserCredential } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginValidationErrors {
  email?: string;
  password?: string;
}

export interface RegisterValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
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

  private registerInfo = {
    welcomeMessage: "Selamat Datang,",
    title: "Daftar ke NoFake",
    desktopTitle: "Daftar ke NoFake",
    submitButtonText: "Daftar",
    hasAccountText: "Sudah memiliki akun?",
    loginLinkText: "Masuk",
  };

  getAppInfo(mode: "login" | "register" = "login") {
    return mode === "login" ? this.loginInfo : this.registerInfo;
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

  async signUp(email: string, password: string): Promise<User> {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore with empty name
      await this.createUserProfile(user, email);

      return user;
    } catch (error) {
      console.error("Sign up error:", error);
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

  // Create user profile in Firestore
  private async createUserProfile(user: User, email: string): Promise<void> {
    try {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: email,
        name: "", // Empty string as requested
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isActive: true,
      };

      await setDoc(doc(this.db, "users", user.uid), userProfile);
    } catch (error) {
      console.error("Create user profile error:", error);
      throw error;
    }
  }

  // Update user name in Firestore
  async updateUserName(uid: string, name: string): Promise<void> {
    try {
      await updateDoc(doc(this.db, "users", uid), {
        name: name,
      });
    } catch (error) {
      console.error("Update user name error:", error);
      throw error;
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

  validateRegisterCredentials(
    credentials: RegisterCredentials
  ): RegisterValidationErrors {
    const errors: RegisterValidationErrors = {};

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

    // Confirm password validation
    if (!credentials.confirmPassword) {
      errors.confirmPassword = "Konfirmasi kata sandi harus diisi";
    } else if (credentials.password !== credentials.confirmPassword) {
      errors.confirmPassword = "Kata sandi tidak sama";
    }

    return errors;
  }

  isValidCredentials(credentials: LoginCredentials): boolean {
    const errors = this.validateCredentials(credentials);
    return Object.keys(errors).length === 0;
  }

  isValidRegisterCredentials(credentials: RegisterCredentials): boolean {
    const errors = this.validateRegisterCredentials(credentials);
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
      case "auth/email-already-in-use":
        return "Email sudah terdaftar. Silakan gunakan email lain atau masuk.";
      case "auth/weak-password":
        return "Kata sandi terlalu lemah. Gunakan minimal 6 karakter.";
      case "auth/operation-not-allowed":
        return "Operasi tidak diizinkan. Hubungi administrator.";

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
