import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { AuthModel } from "../models/AuthModel";
import type {
  LoginCredentials,
  RegisterCredentials,
  LoginValidationErrors,
  RegisterValidationErrors,
  UserProfile,
} from "../models/AuthModel";
import { useNavigation } from "../hooks/useNavigation";

export interface AuthControllerReturn {
  // State
  email: string;
  password: string;
  confirmPassword: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  isMobile: boolean;
  appInfo: ReturnType<AuthModel["getAppInfo"]>;
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;

  // Actions
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleRegister: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  handleLogout: () => Promise<void>;
  goToRegister: () => void;
  goToLogin: () => void;
  goToHome: () => void;
  clearErrors: () => void;
  clearMessages: () => void;
}

export const useAuthController = (
  mode: "login" | "register" = "login"
): AuthControllerReturn => {
  const [email, setEmailState] = useState("");
  const [password, setPasswordState] = useState("");
  const [confirmPassword, setConfirmPasswordState] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const authModel = new AuthModel();
  const navigation = useNavigation();
  const appInfo = authModel.getAppInfo(mode);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = authModel.onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const profile = await authModel.getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, [authModel]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const setEmail = (value: string) => {
    setEmailState(value);
    if (emailError) setEmailError("");
  };

  const setPassword = (value: string) => {
    setPasswordState(value);
    if (passwordError) setPasswordError("");
  };

  const setConfirmPassword = (value: string) => {
    setConfirmPasswordState(value);
    if (confirmPasswordError) setConfirmPasswordError("");
  };

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setError(null);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const setValidationErrors = (
    errors: LoginValidationErrors | RegisterValidationErrors
  ) => {
    setEmailError(errors.email || "");
    setPasswordError(errors.password || "");
    if ("confirmPassword" in errors) {
      setConfirmPasswordError(errors.confirmPassword || "");
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    clearMessages();

    try {
      await authModel.signIn(email, password);
      setSuccess("Login berhasil! Mengalihkan...");

      // Small delay to show success message
      setTimeout(() => {
        navigation.goToChat();
      }, 1000);
    } catch (firebaseError: any) {
      const errorMessage = authModel.getFirebaseErrorMessage(
        firebaseError.code
      );
      setError(errorMessage);
      console.error("Login error:", firebaseError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setIsLoading(true);
    clearMessages();

    try {
      await authModel.signUp(email, password);
      setSuccess("Registrasi berhasil! Mengalihkan...");

      // Small delay to show success message
      setTimeout(() => {
        navigation.goToChat();
      }, 1000);
    } catch (firebaseError: any) {
      const errorMessage = authModel.getFirebaseErrorMessage(
        firebaseError.code
      );
      setError(errorMessage);
      console.error("Register error:", firebaseError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authModel.signOut();
      setSuccess("Logout berhasil!");

      // Clear local state
      setEmailState("");
      setPasswordState("");
      clearErrors();

      setTimeout(() => {
        navigation.goHome();
      }, 1000);
    } catch (firebaseError: any) {
      const errorMessage = authModel.getFirebaseErrorMessage(
        firebaseError.code
      );
      setError(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    if (mode === "login") {
      const credentials: LoginCredentials = { email, password };

      // Validate credentials using model
      const validationErrors = authModel.validateCredentials(credentials);

      if (!authModel.isValidCredentials(credentials)) {
        setValidationErrors(validationErrors);
        return;
      }

      // Proceed with login
      await handleLogin(email, password);
    } else {
      const credentials: RegisterCredentials = {
        email,
        password,
        confirmPassword,
      };

      // Validate credentials using model
      const validationErrors =
        authModel.validateRegisterCredentials(credentials);

      if (!authModel.isValidRegisterCredentials(credentials)) {
        setValidationErrors(validationErrors);
        return;
      }

      // Proceed with registration
      await handleRegister(email, password, confirmPassword);
    }
  };

  const goToRegister = () => {
    navigation.goToRegister();
  };

  const goToLogin = () => {
    navigation.goToLogin();
  };

  const goToHome = () => {
    navigation.goHome();
  };

  return {
    // State
    email,
    password,
    confirmPassword,
    emailError,
    passwordError,
    confirmPasswordError,
    isLoading,
    error,
    success,
    isMobile,
    appInfo,
    currentUser,
    userProfile,
    isAuthenticated: !!currentUser,

    // Actions
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    handleLogin,
    handleRegister,
    handleLogout,
    goToRegister,
    goToLogin,
    goToHome,
    clearErrors,
    clearMessages,
  };
};
