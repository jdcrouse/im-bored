import React from 'react';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';

export default function TabLayout() {
  const { session, signOut } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const handleGearPress = () => {
    setIsMenuVisible(true);
  };

  const handleLogOut = () => {
    signOut();
    setIsMenuVisible(false);
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
            backgroundColor: COLORS.background,
          },
          headerTitleStyle: {
            fontSize: 0,
          },
          headerTintColor: COLORS.text,
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
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <FontAwesome name="cog" size={24} color={COLORS.icon} />
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
              <FontAwesome name="user" size={20} color={COLORS.icon} />
              <Text style={styles.menuItemText}>Account Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLogOut}
            >
              <FontAwesome name="sign-out" size={20} color={COLORS.button} />
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
    backgroundColor: COLORS.modalOverlay,
  },
  menuContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: COLORS.modalBackground,
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
    color: COLORS.text,
    fontWeight: '500',
  },
  logoutText: {
    color: COLORS.button,
  },
  settingsContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -150 }],
    backgroundColor: COLORS.modalBackground,
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
    borderBottomColor: COLORS.border,
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  settingsItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingsLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  settingsValue: {
    fontSize: 18,
    color: COLORS.text,
  },
}); 