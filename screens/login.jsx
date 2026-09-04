import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* BRAND */}
        <View style={styles.brandContainer}>
          <Text style={styles.logo}>PurvaSetu</Text>
          <View style={styles.logoLine} />
        </View>

        <View style={styles.card}>
          {/* HEADER */}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Access your logistics intelligence dashboard
          </Text>

          {/* EMAIL */}
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, focusedField === "email" && styles.inputFocused]}
            placeholder="Enter your email"
            placeholderTextColor="#8B8F86"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
          />

          {/* PASSWORD */}
          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.passwordWrapper,
              focusedField === "password" && styles.inputFocused,
            ]}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#8B8F86"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />

            <TouchableOpacity
              style={styles.showButton}
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              <Text style={styles.showText}>
                {showPassword ? "HIDE" : "SHOW"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* FORGOT PASSWORD */}
          <TouchableOpacity style={styles.forgotButton} activeOpacity={0.7}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* LOGIN */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.88}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          {/* SIGN UP */}
          <View style={styles.signupDivider} />
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Signup")}
              activeOpacity={0.7}
            >
              <Text style={styles.signupLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/*
  DESIGN TOKENS — matched 1:1 to Signup.jsx so the two screens read as one
  continuous design system rather than siblings with a family resemblance.
  screen bg     #EDE8DC
  card bg       #F6F1E7    border #DDE0D5
  input bg      #F2EEE4    border #C2B47C  → focus #30483B
  accent green  #30483B    accent rust #A9573F
  text primary  #20231F    text body #33372F    text muted #5E675D
  show/hide pill#DCE1D5
*/

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EDE8DC",
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },

  /* BRAND */

  brandContainer: {
    alignItems: "center",
    marginBottom: 24,
  },

  logo: {
    color: "#30483B",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 3.5,
  },

  logoLine: {
    width: 30,
    height: 3,
    backgroundColor: "#A9573F",
    borderRadius: 5,
    marginTop: 8,
  },

  /* CARD */

  card: {
    width: "100%",
    backgroundColor: "#F6F1E7",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#DDE0D5",
    paddingHorizontal: 22,
    paddingVertical: 30,

    shadowColor: "#30483B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },

  /* HEADER */

  title: {
    color: "#20231F",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.3,
  },

  subtitle: {
    color: "#5E675D",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 28,
  },

  /* LABELS */

  label: {
    color: "#33372F",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 16,
  },

  /* INPUTS */

  input: {
    height: 52,
    backgroundColor: "#F2EEE4",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#20231F",
    borderWidth: 1,
    borderColor: "#C2B47C",
  },

  inputFocused: {
    borderColor: "#30483B",
    borderWidth: 1.5,
    shadowColor: "#30483B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },

  /* PASSWORD */

  passwordWrapper: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2EEE4",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C2B47C",
    paddingRight: 6,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#20231F",
  },

  showButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    backgroundColor: "#DCE1D5",
  },

  showText: {
    color: "#30483B",
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.6,
  },

  /* FORGOT PASSWORD */

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },

  forgotText: {
    color: "#A9573F",
    fontSize: 13,
    fontWeight: "700",
  },

  /* LOGIN BUTTON */

  loginButton: {
    height: 54,
    backgroundColor: "#A9573F",
    borderRadius: 15,
    marginTop: 26,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#A9573F",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },

  loginButtonText: {
    color: "#F6F1E7",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
  },

  arrow: {
    color: "#F6F1E7",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },

  /* SIGN UP */

  signupDivider: {
    height: 1,
    backgroundColor: "#DDE0D5",
    marginTop: 22,
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  signupText: {
    color: "#33372F",
    fontSize: 13,
  },

  signupLink: {
    color: "#30483B",
    fontWeight: "800",
    fontSize: 13,
  },
});