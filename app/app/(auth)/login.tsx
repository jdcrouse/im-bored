import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import Toast from "react-native-toast-message";
import { COLORS } from "../../constants/colors";
import * as Font from "expo-font";

export default function LoginScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, signOut, session, loading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Righteous: require("../../assets/fonts/Righteous-Regular.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
        // Continue without custom fonts
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  const validateRegistration = () => {
    if (!username.trim()) {
      Toast.show({
        type: "error",
        text1: "Registration Error",
        text2: "Username is required",
      });
      return false;
    }
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Registration Error",
        text2: "Email is required",
      });
      return false;
    }
    if (!password.trim()) {
      Toast.show({
        type: "error",
        text1: "Registration Error",
        text2: "Password is required",
      });
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: "Email is required",
      });
      return false;
    }
    if (!password.trim()) {
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: "Password is required",
      });
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateRegistration()) return;

    try {
      await signUp(email, password, username);
      Toast.show({
        type: "success",
        text1: "Registration successful",
        text2: "Please check your email to confirm your account",
      });
      router.replace("/(tabs)");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Registration Error",
        text2: error.message || "Failed to register",
      });
    }
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: error.message || "Failed to login",
      });
    }
  };

  const handleSubmit = async () => {
    if (isRegistering) {
      await handleRegister();
    } else {
      await handleLogin();
    }
  };

  if (session) {
    return (
      <View style={styles.container}>
        <Text>Welcome, {session.user.email}</Text>
        <TouchableOpacity style={styles.button} onPress={signOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontFamily: "Righteous", fontSize: 72 }]}>
        {isRegistering ? "Create Account" : "i'm bored"}
      </Text>

      {isRegistering && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={COLORS.textSecondary}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={COLORS.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isRegistering ? "Register" : "Sign In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsRegistering(!isRegistering)}
      >
        <Text style={styles.switchButtonText}>
          {isRegistering
            ? "Already have an account? Sign In"
            : "Don't have an account? Register"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.text,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: COLORS.modalBackground,
    color: COLORS.text,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    width: "60%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    padding: 10,
    alignItems: "center",
  },
  switchButtonText: {
    color: COLORS.text,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
