import { ENV_CONFIG } from './env-config';

export interface ModeConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  mode: 'development' | 'production';
  apiUrl: string;
}

class ModeService {
  private mode: 'development' | 'production';

  constructor() {
    this.mode = ENV_CONFIG.APP_MODE as 'development' | 'production';
  }

  // Get current mode
  getCurrentMode(): 'development' | 'production' {
    return this.mode;
  }

  // Check if running in development mode
  isDevelopmentMode(): boolean {
    return this.mode === 'development' || ENV_CONFIG.IS_DEV_MODE;
  }

  // Check if running in production mode
  isProductionMode(): boolean {
    return this.mode === 'production' || ENV_CONFIG.IS_PROD_MODE;
  }

  // Set mode (for runtime switching)
  setMode(mode: 'development' | 'production'): void {
    this.mode = mode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('appMode', mode);
    }
  }

  // Get mode from localStorage (for persistence)
  getModeFromStorage(): 'development' | 'production' {
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('appMode');
      if (storedMode === 'development' || storedMode === 'production') {
        this.mode = storedMode;
        return storedMode;
      }
    }
    return this.mode;
  }

  // Get complete mode configuration
  getModeConfig(): ModeConfig {
    return {
      isDevelopment: this.isDevelopmentMode(),
      isProduction: this.isProductionMode(),
      mode: this.mode,
      apiUrl: ENV_CONFIG.API_BASE_URL,
    };
  }

  // Check if blocking features should be enabled
  shouldEnableBlocking(): boolean {
    return this.isProductionMode();
  }

  // Check if email notifications should be enabled
  shouldEnableEmailNotifications(): boolean {
    return this.isProductionMode();
  }


  // Get mode-specific error messages
  getModeSpecificMessage(feature: string): string {
    if (this.isDevelopmentMode()) {
      return `${feature} (Disabled in Development Mode)`;
    }
    return `${feature} (Enabled in Production Mode)`;
  }
}

export default new ModeService();
