
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

export default function Signup({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Error", "Passwords do not match.");
      return;
    }

    // Backend signup will be connected later
    Alert.alert("Success", "Account created successfully!");

    navigation.navigate("Login");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>

        <Text style={styles.logo}>PurvaSetu</Text>

        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>
          Join the intelligent logistics network
        </Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#777"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#777"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor="#777"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
        >
          <Text style={styles.signupText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate("login")}>
            <Text style={styles.loginLink}> Login</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EDE8DC",
    justifyContent: "center",
    padding: 24,
  },

  card: {
    backgroundColor: "#CBD0C0",
    borderRadius: 20,
    padding: 28,
  },

  logo: {
    color: "#30483B",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 24,
  },

  title: {
    color: "#20231F",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    color: "#30483B",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
  },

  label: {
    color: "#20231F",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    backgroundColor: "#EDE8DC",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 15,
    color: "#20231F",
    borderWidth: 1,
    borderColor: "#B8944A",
  },

  signupButton: {
    backgroundColor: "#A9573F",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 28,
    alignItems: "center",
  },

  signupText: {
    color: "#EDE8DC",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },

  loginText: {
    color: "#20231F",
    fontSize: 14,
  },

  loginLink: {
    color: "#30483B",
    fontWeight: "800",
    fontSize: 14,
  },
});

