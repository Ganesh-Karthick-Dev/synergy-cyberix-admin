import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string, duration = 3000) => {
    return toast.success(message, {
      duration,
      style: {
        background: '#12b76a',
        color: '#ffffff',
        border: '1px solid #039855',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    });
  },

  error: (message: string, duration = 4000) => {
    return toast.error(message, {
      duration,
      style: {
        background: '#f04438',
        color: '#ffffff',
        border: '1px solid #d92d20',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      duration: Infinity,
      style: {
        background: '#6b7280', // grey-500
        color: '#ffffff',
        border: '1px solid #4b5563', // grey-600
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    });
  },

  warning: (message: string, duration = 4000) => {
    return toast(message, {
      duration,
      icon: '⚠️',
      style: {
        background: '#f79009',
        color: '#ffffff',
        border: '1px solid #dc6803',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    });
  },

  info: (message: string, duration = 3000) => {
    return toast(message, {
      duration,
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#ffffff',
        border: '1px solid #2563eb',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    });
  },

  logout: (message: string = "Logged out successfully", duration = 3000) => {
    return toast.success(message, {
      duration,
      style: {
        background: '#12b76a', // success-500
        color: '#ffffff',
        border: '1px solid #039855', // success-600
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    });
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
};
