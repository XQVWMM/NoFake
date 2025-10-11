import { useState } from "react";
import { HomeModel } from "../models/HomeModel";
import { useNavigation } from "../hooks/useNavigation";
import type { StatisticData, FeatureData } from "../models/HomeModel";

export type ActiveButton = "daftar" | "masuk" | null;

export interface HomeControllerReturn {
  activeButton: ActiveButton;
  statistics: StatisticData[];
  features: FeatureData[];
  appInfo: ReturnType<HomeModel["getAppInfo"]>;
  error: string | null;

  handleButtonClick: (button: "daftar" | "masuk") => void;
  isActive: (button: "daftar" | "masuk") => boolean;
  handleStartVerification: () => void;
  navigateToAuth: (type: "daftar" | "masuk") => void;
}

export const useHomeController = (): HomeControllerReturn => {
  const homeModel = new HomeModel();
  const navigation = useNavigation();

  const [activeButton, setActiveButton] = useState<ActiveButton>(null);
  const [features] = useState<FeatureData[]>(homeModel.getFeatures());
  const [error] = useState<string | null>(null);

  const statistics = homeModel.getStatistics();
  const appInfo = homeModel.getAppInfo();

  // Button handlers
  const handleButtonClick = (button: "daftar" | "masuk") => {
    setActiveButton(button);
    navigateToAuth(button);
  };

  const isActive = (button: "daftar" | "masuk") => activeButton === button;

  const handleStartVerification = () => {
    navigation.goToChat();
  };

  const navigateToAuth = (type: "daftar" | "masuk") => {
    if (type === "daftar") {
      navigation.goToRegister();
    } else if (type === "masuk") {
      navigation.goToLogin();
    }
  };

  return {
    activeButton,
    statistics,
    features,
    appInfo,
    error,

    handleButtonClick,
    isActive,
    handleStartVerification,
    navigateToAuth,
  };
};
