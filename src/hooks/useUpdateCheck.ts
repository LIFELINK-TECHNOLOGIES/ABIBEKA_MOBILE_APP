// src/hooks/useUpdateCheck.js
import { useState, useEffect, useCallback } from 'react';
import * as Updates from 'expo-updates';

export function useUpdateChecker() {
  const [updateStatus, setUpdateStatus] = useState('checking');

  const checkForUpdates = useCallback(async () => {
    // Skip in Expo Go/development
    if (__DEV__) {
      console.log('Development mode - skipping update check');
      setUpdateStatus('up-to-date');
      return;
    }

    try {
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        setUpdateStatus('downloading');
        const result = await Updates.fetchUpdateAsync();
        
        if (result.isNew) {
          setUpdateStatus('ready');
        } else {
          setUpdateStatus('up-to-date');
        }
      } else {
        setUpdateStatus('up-to-date');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      setUpdateStatus('error');
    }
  }, []);

  useEffect(() => {
    checkForUpdates();
  }, [checkForUpdates]);

  const reloadApp = useCallback(async () => {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Error reloading app:', error);
    }
  }, []);

  return { updateStatus, reloadApp, checkForUpdates };
}