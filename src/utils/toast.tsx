import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Portal, useTheme } from 'react-native-paper';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = useCallback((msg: string, toastType: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setType(toastType);
    setVisible(true);
  }, []);

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return theme.colors.errorContainer || '#B3261E';
      case 'success':
        return '#1B5E20'; // Material You success green
      default:
        return theme.colors.surfaceVariant || '#1E1E1E';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Portal>
        <Snackbar
          visible={visible}
          onDismiss={onDismiss}
          duration={3000}
          action={{
            label: 'Dismiss',
            onPress: onDismiss,
          }}
          style={{
            backgroundColor: getBackgroundColor(),
          }}
        >
          {message}
        </Snackbar>
      </Portal>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

