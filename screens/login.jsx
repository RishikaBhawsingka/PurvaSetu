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
      Alert.alert(
        "Missing Information",
        "Please enter your email and password."
      );
      return;
    }

    Alert.alert("Success", "Login successful!", [
      {
        text: "OK",
        onPress: () => navigation.replace("Dashboard"),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
      >
        {/* BRAND */}
        <View style={styles.brandContainer}>
          <Text style={styles.logo}>PurvaSetu</Text>
          <View style={styles.logoLine} />
        </View>

        {/* LOGIN CARD */}
        <View style={styles.card}>

          {/* HEADER */}
          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.subtitle}>
            Access your logistics intelligence dashboard
          </Text>

          {/* EMAIL */}
          <Text style={styles.label}>Email Address</Text>

          <TextInput
            style={[
              styles.input,
              focusedField === "email" && styles.inputFocused,
            ]}
            placeholder="Enter your email"
            placeholderTextColor="#8B8F86"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={true}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            returnKeyType="next"
          />

          {/* PASSWORD */}
          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordContainer}>

            <TextInput
              style={[
                styles.passwordInput,
                focusedField === "password" && styles.passwordInputFocused,
              ]}
              placeholder="Enter your password"
              placeholderTextColor="#8B8F86"
              secureTextEntry={!showPassword}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
              editable={true}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              returnKeyType="done"
              underlineColorAndroid="transparent"
            />

            {/* SHOW / HIDE */}
            <TouchableOpacity
              style={styles.showButton}
              onPress={() => {
                setShowPassword((previous) => !previous);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.showText}>
                {showPassword ? "HIDE" : "SHOW"}
              </Text>
            </TouchableOpacity>

          </View>

          {/* FORGOT PASSWORD */}
          <TouchableOpacity
            style={styles.forgotButton}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* LOGIN */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.88}
          >
            <Text style={styles.loginButtonText}>
              LOGIN
            </Text>

            <Text style={styles.arrow}>
              →
            </Text>
          </TouchableOpacity>

          {/* SIGN UP */}
          <View style={styles.signupDivider} />

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Signup")}
              activeOpacity={0.7}
            >
              <Text style={styles.signupLink}>
                {" "}Sign Up
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  /* SCREEN */

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
    shadowOffset: {
      width: 0,
      height: 6,
    },
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

  /* LABEL */

  label: {
    color: "#33372F",
    fontSize: 13,
    fontWeight: "700",

    marginBottom: 8,
    marginTop: 16,
  },

  /* EMAIL */

  input: {
    width: "100%",
    height: 52,

    backgroundColor: "#F2EEE4",

    borderRadius: 14,

    borderWidth: 1,
    borderColor: "#C2B47C",

    paddingHorizontal: 16,

    fontSize: 15,
    color: "#20231F",
  },

  inputFocused: {
    borderColor: "#30483B",
    borderWidth: 1.5,

    shadowColor: "#30483B",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.12,
    shadowRadius: 6,

    elevation: 2,
  },

  /* PASSWORD */

  passwordContainer: {
    width: "100%",
    height: 52,

    position: "relative",
  },

  passwordInput: {
    width: "100%",
    height: 52,

    backgroundColor: "#F2EEE4",

    borderRadius: 14,

    borderWidth: 1,
    borderColor: "#C2B47C",

    paddingLeft: 16,
    paddingRight: 90,

    fontSize: 15,
    color: "#20231F",

    includeFontPadding: false,
  },

  passwordInputFocused: {
    borderColor: "#30483B",
    borderWidth: 1.5,

    shadowColor: "#30483B",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.12,
    shadowRadius: 6,

    elevation: 2,
  },

  /* SHOW BUTTON */

  showButton: {
    position: "absolute",

    right: 7,
    top: 7,

    height: 38,

    paddingHorizontal: 12,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 9,

    backgroundColor: "#DCE1D5",

    zIndex: 10,

    elevation: 2,
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
    width: "100%",
    height: 54,

    backgroundColor: "#A9573F",

    borderRadius: 15,

    marginTop: 26,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#A9573F",

    shadowOffset: {
      width: 0,
      height: 6,
    },

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