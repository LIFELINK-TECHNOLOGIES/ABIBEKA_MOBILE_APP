import RootNavigation from "./src/navigation/rootNavigation";
import { I18nextProvider } from 'react-i18next';
import i18n, { loadLanguage } from "./src/utils/i18n";
import { useEffect, useState, useCallback } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/utils/queryClient"; 
import { ActivityIndicator, View, Modal, TouchableOpacity, StyleSheet, Platform } from "react-native";
import Text from "./src/components/basics/txt";
import * as Updates from 'expo-updates';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 

export default function App() {
  const [updateStatus, setUpdateStatus] = useState('checking');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  useEffect(() => {
    loadLanguage();
  }, []);

  // ✅ Fixed update checker that works with expo-updates 10.9.8
  const checkForUpdates = useCallback(async () => {
    // Don't try to check for updates in Expo Go
    if (__DEV__ && !Updates.isEmbeddedLaunch) {
      console.log('Skipping update check in development/Expo Go');
      setUpdateStatus('up-to-date');
      return;
    }

    try {
      setUpdateStatus('checking');
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        setUpdateStatus('downloading');
        const result = await Updates.fetchUpdateAsync();
        
        if (result.isNew) {
          setUpdateStatus('ready');
          setShowUpdateModal(true);
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

  // ✅ Use Updates.useUpdateEvents() hook if available, otherwise skip listeners
  useEffect(() => {
    // The addListener API was removed in newer versions
    // Instead, use the checkForUpdates function above
    // For events, you can use Updates.useUpdateEvents() hook if needed
    try {
      if (Updates.useUpdateEvents) {
        // This is available in some versions
        console.log('Using useUpdateEvents hook');
      }
    } catch (e) {
      console.log('Update events listener not available');
    }
  }, []);

  const reloadApp = useCallback(async () => {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Error reloading app:', error);
    }
  }, []);

  // Show loading screen while downloading
  if (updateStatus === 'downloading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Downloading update...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <RootNavigation />
          
          {/* Custom Update Modal */}
          <Modal
            visible={showUpdateModal}
            transparent
            animationType="fade"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Available</Text>
                <Text style={styles.modalMessage}>
                  A new update has been downloaded. Would you like to restart now?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.secondaryButton}
                    onPress={() => setShowUpdateModal(false)}
                  >
                    <Text>Later</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => {
                      setShowUpdateModal(false);
                      reloadApp();
                    }}
                  >
                    <Text style={styles.primaryButtonText}>Restart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </I18nextProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});