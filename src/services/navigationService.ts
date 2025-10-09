import type { NavigateFunction } from "react-router-dom";

class NavigationService {
  private navigate: NavigateFunction | null = null;

  setNavigate(navigateFunction: NavigateFunction) {
    this.navigate = navigateFunction;
  }

  navigateTo(path: string, options?: { replace?: boolean; state?: any }) {
    if (this.navigate) {
      this.navigate(path, options);
    } else {
      console.error("Navigate function not set");
    }
  }

  goBack() {
    if (this.navigate) {
      this.navigate(-1);
    }
  }

  goHome() {
    this.navigateTo("/");
  }

  goToLogin() {
    this.navigateTo("/login");
  }

  goToRegister() {
    this.navigateTo("/register");
  }

  goToChat() {
    this.navigateTo("/chat");
  }
}

export const navigationService = new NavigationService();
