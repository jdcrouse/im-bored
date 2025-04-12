import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';

export default function Index() {
  const [response, setResponse] = useState<string>("");
  const { signOut } = useAuth();

  const handleNotify = async () => {
    try {
      const response = await fetch("http://localhost:8080/broadcast-boredom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notifier_id: "admin"
        }),
      });
      const data = await response.json();
      setResponse(JSON.stringify(data));
      Toast.show({
        type: 'success',
        text1: data.message,
        visibilityTime: 3000,
      });
    } catch (error: any) {
      setResponse("Error: " + error.message);
    } 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleNotify}
        style={styles.button}
      >
        <Text style={styles.buttonText}>im bored</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={signOut}
        style={[styles.button, { marginTop: 20 }]}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
}); 