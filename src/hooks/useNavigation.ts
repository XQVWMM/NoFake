import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { navigationService } from "../services/navigationService";

export const useNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigationService.setNavigate(navigate);
  }, [navigate]);

  return {
    navigateTo: (path: string, options?: { replace?: boolean; state?: any }) =>
      navigate(path, options),
    goBack: () => navigate(-1),
    goHome: () => navigate("/"),
    goToLogin: () => navigate("/login"),
    goToRegister: () => navigate("/register"),
    goToDashboard: () => navigate("/dashboard"),
    goToChat: () => navigate("/chat"),
  };
};
