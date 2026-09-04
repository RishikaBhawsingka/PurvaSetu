
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Missing Information", "Please enter your email and password.");
      return;
    }

    // Backend login will be connected later
    Alert.alert("Success", "Login successful!");

    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <Text style={styles.logo}>PurvaSetu</Text>

        <Text style={styles.title}>Welcome Back</Text>

        <Text style={styles.subtitle}>
          Access your logistics intelligence dashboard
        </Text>

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
          placeholder="Enter your password"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>
            Don't have an account?
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 10,
  },

  forgotText: {
    color: "#A9573F",
    fontSize: 13,
    fontWeight: "700",
  },

  loginButton: {
    backgroundColor: "#30483B",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },

  loginButtonText: {
    color: "#EDE8DC",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },

  signupText: {
    color: "#20231F",
    fontSize: 14,
  },

  signupLink: {
    color: "#A9573F",
    fontWeight: "800",
    fontSize: 14,
  },
});

