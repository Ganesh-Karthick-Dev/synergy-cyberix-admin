// Utility functions for handling login with single-user restriction
import { showToast } from './toast';

export interface LoginResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: any;
  };
  error?: {
    message: string;
    statusCode: number;
    code: string;
  };
}

export const handleLogin = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Get device information
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timestamp: new Date().toISOString(),
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ 
        email, 
        password, 
        deviceInfo: JSON.stringify(deviceInfo) 
      })
    });

    const data = await response.json();

    // Handle the new 409 error for USER_ALREADY_LOGGED_IN
    if (response.status === 409 && data.error?.code === 'USER_ALREADY_LOGGED_IN') {
      showUserAlreadyLoggedInModal(data.error);
      return data;
    }

    if (data.success) {
      // Normal login success - cookies are automatically set by the server
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      showToast.success(data.message || 'Login successful! Welcome to the security scanning dashboard.');
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      // Other login errors
      showToast.error(data.error?.message || 'Login failed. Please check your credentials.');
    }

    return data;
  } catch (error: any) {
    console.error('Login Error:', error);
    showToast.error('Login failed. Please try again.');
    throw error;
  }
};

export const showUserAlreadyLoggedInModal = (error: any) => {
  const existingDevice = error.details?.existingDevice || 'Unknown Device';
  const existingIp = error.details?.existingIp || 'Unknown IP';
  const existingLoginTime = error.details?.existingLoginTime ? 
    new Date(error.details.existingLoginTime).toLocaleString() : 'Unknown Time';

  const modalHTML = `
    <div id="user-logged-in-modal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>🔒 Account Already in Use</h3>
        </div>
        <div class="modal-body">
          <p>${error.message}</p>
          
          <div class="device-info">
            <h4>Current Active Session:</h4>
            <ul>
              <li><strong>Device:</strong> ${existingDevice}</li>
              <li><strong>IP Address:</strong> ${existingIp}</li>
              <li><strong>Login Time:</strong> ${existingLoginTime}</li>
            </ul>
          </div>
          
          <p>Please logout from that device first or use the options below.</p>
        </div>
        <div class="modal-actions">
          <button onclick="closeModal()" class="btn-secondary">Cancel</button>
          <button onclick="forceLogout()" class="btn-primary">Logout from All Devices</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

export const forceLogout = async () => {
  try {
    const response = await fetch('/api/auth/logout-all', {
      method: 'POST',
      credentials: 'include' // Important for cookies
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      // Clear local storage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      showToast.success(data.message || 'Logged out from all devices. You can now login.');
      closeModal();
    } else {
      showToast.error(data.error?.message || 'Failed to logout from all devices.');
    }
  } catch (error) {
    showToast.error('Failed to logout from all devices.');
  }
};

export const closeModal = () => {
  const modal = document.getElementById('user-logged-in-modal');
  if (modal) modal.remove();
};

// Add CSS for the modal
export const addModalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header h3 {
      margin: 0 0 1rem 0;
      color: #e74c3c;
    }

    .modal-body p {
      margin: 0.5rem 0;
      color: #666;
    }

    .modal-actions {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-secondary:hover {
      background: #545b62;
    }
  `;
  document.head.appendChild(style);
};

// Initialize the modal styles
if (typeof window !== 'undefined') {
  addModalStyles();
}
