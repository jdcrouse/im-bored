import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, StyleSheet, Modal } from 'react-native';

export default function Layout() {
  const { session, signOut } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const handleGearPress = () => {
    setIsMenuVisible(true);
  };

  const handleLogOut = () => {
    setIsMenuVisible(false);
    signOut();
  };

  const handleSettingsPress = () => {
    setIsMenuVisible(false);
    setIsSettingsVisible(true);
  };

  if (!session) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontSize: 0,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: '',
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
            headerRight: () => (
              <TouchableOpacity
                onPress={handleGearPress}
                style={{ 
                  marginRight: 20,
                  padding: 10,
                  margin: -10,
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <FontAwesome name="cog" size={24} color="#000" />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleSettingsPress}
            >
              <FontAwesome name="user" size={20} color="#000" />
              <Text style={styles.menuItemText}>Account Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLogOut}
            >
              <FontAwesome name="sign-out" size={20} color="#ff4444" />
              <Text style={[styles.menuItemText, styles.logoutText]}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isSettingsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSettingsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSettingsVisible(false)}
        >
          <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>Account Settings</Text>
            </View>
            <View style={styles.settingsItem}>
              <Text style={styles.settingsLabel}>Email</Text>
              <Text style={styles.settingsValue}>{session?.user?.email}</Text>
            </View>
            <View style={styles.settingsItem}>
              <Text style={styles.settingsLabel}>Username</Text>
              <Text style={styles.settingsValue}>{session?.user?.user_metadata?.username}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  logoutText: {
    color: '#ff4444',
  },
  settingsContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -150 }],
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
    position: 'relative',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: 8,
  },
  settingsItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingsLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  settingsValue: {
    fontSize: 18,
    color: '#000',
  },
}); 