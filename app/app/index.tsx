import { Button, View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import Toast from 'react-native-toast-message';

export default function Index() {
  const [response, setResponse] = useState<string>("");

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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={handleNotify}
        style={{
          backgroundColor: '#007AFF',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>im bored</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
}
