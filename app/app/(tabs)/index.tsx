import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../constants/styles";

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>i'm bored</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
