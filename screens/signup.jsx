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

export default function Signup({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Tracks which field currently has focus so inputs can show a
  // deliberate, subtle focus state instead of a static border.
  const [focusedField, setFocusedField] = useState(null);

  const roles = [
    {
      id: "citizen",
      title: "Public Citizen",
      description: "Access routes, alerts & report issues",
      icon: "◉",
    },
    {
      id: "administrator",
      title: "Administrator",
      description: "Manage operations & monitor the network",
      icon: "◆",
    },
    {
      id: "driver",
      title: "Convoy Driver",
      description: "Navigate routes & update deliveries",
      icon: "▣",
    },
    {
      id: "ndma",
      title: "NDMA / SDRF",
      description: "Coordinate emergency response operations",
      icon: "✦",
    },
    {
      id: "logistic",
      title: "Logistic Lead",
      description: "Manage supplies & logistics movement",
      icon: "◇",
    },
  ];

  const handleSignup = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields and select your role."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone.trim())) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Weak Password",
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Error", "Passwords do not match.");
      return;
    }

    // Backend signup will be connected later
    Alert.alert(
      "Account Created",
      `Welcome to PurvaSetu, ${name.trim()}!`,
      [
        {
          text: "Continue",
          onPress: () => navigation.navigate("Login"),
        },
      ]
    );
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join the intelligent logistics network
          </Text>

          {/* PERSONAL INFORMATION */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>01</Text>
            </View>
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          <View style={styles.sectionRule} />

          {/* FULL NAME */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, focusedField === "name" && styles.inputFocused]}
            placeholder="Enter your full name"
            placeholderTextColor="#8B8F86"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
          />

          {/* EMAIL */}
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, focusedField === "email" && styles.inputFocused]}
            placeholder="Enter your email address"
            placeholderTextColor="#8B8F86"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
          />

          {/* PHONE */}
          <Text style={styles.label}>Phone Number</Text>
          <View
            style={[
              styles.phoneWrapper,
              focusedField === "phone" && styles.inputFocused,
            ]}
          >
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>

            <TextInput
              style={styles.phoneInput}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor="#8B8F86"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* SECURITY */}
          <View style={[styles.sectionHeader, styles.securityHeader]}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>02</Text>
            </View>
            <Text style={styles.sectionTitle}>Account Security</Text>
          </View>
          <View style={styles.sectionRule} />

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
              placeholder="Create a password"
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
          <Text style={styles.helperText}>
            Use at least 8 characters for a secure password.
          </Text>

          {/* CONFIRM PASSWORD */}
          <Text style={styles.label}>Confirm Password</Text>
          <View
            style={[
              styles.passwordWrapper,
              focusedField === "confirmPassword" && styles.inputFocused,
            ]}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm your password"
              placeholderTextColor="#8B8F86"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
            />

            <TouchableOpacity
              style={styles.showButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              activeOpacity={0.7}
            >
              <Text style={styles.showText}>
                {showConfirmPassword ? "HIDE" : "SHOW"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ROLE */}
          <View style={[styles.sectionHeader, styles.roleHeader]}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>03</Text>
            </View>
            <View>
              <Text style={styles.sectionTitle}>Choose Your Role</Text>
              <Text style={styles.sectionSubtitle}>
                Select the role that best describes you
              </Text>
            </View>
          </View>
          <View style={styles.sectionRule} />

          {/* ROLE CARDS */}
          <View style={styles.rolesContainer}>
            {roles.map((item) => {
              const selected = role === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.roleCard, selected && styles.roleCardSelected]}
                  onPress={() => setRole(item.id)}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.roleIcon,
                      selected && styles.roleIconSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleIconText,
                        selected && styles.roleIconTextSelected,
                      ]}
                    >
                      {item.icon}
                    </Text>
                  </View>

                  <View style={styles.roleContent}>
                    <Text
                      style={[
                        styles.roleTitle,
                        selected && styles.roleTitleSelected,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.roleDescription}>
                      {item.description}
                    </Text>
                  </View>

                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SELECTED ROLE */}
          {role !== "" && (
            <View style={styles.selectedRoleBox}>
              <Text style={styles.selectedRoleLabel}>SELECTED ROLE</Text>
              <Text style={styles.selectedRoleText}>
                {roles.find((item) => item.id === role)?.title}
              </Text>
            </View>
          )}

          {/* CREATE ACCOUNT */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            activeOpacity={0.88}
          >
            <Text style={styles.signupText}>CREATE ACCOUNT</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          {/* LOGIN */}
          <View style={styles.loginDivider} />
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLink}> Login</Text>
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <Text style={styles.footerText}>
            By creating an account, you agree to the PurvaSetu terms and
            privacy policy.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/*
  DESIGN TOKENS (palette values are unchanged from the original spec —
  only how/where they're applied has been refined for hierarchy and rhythm)
  ------------------------------------------------------------------------
  screen bg        #EDE8DC
  card bg          #F6F1E7   (was #CBD0C0 — softened so the card reads as
                              one continuous surface with the screen instead
                              of a hard nested box)
  card border      #DDE0D5
  input bg         #F2EEE4
  input border     #C2B47C   → focus: #30483B
  accent (green)   #30483B
  accent (rust)    #A9573F
  text primary     #20231F
  text body        #33372F
  text muted       #5E675D / #697166 / #747A70 / #8B8F86
  sage containers  #CBD0C0 / #DCE1D5 / #E2E5D8 / #DDE0D5
  gold/neutral     #C2B47C / #D2CCB8 / #D4CCB8
*/

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EDE8DC",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 36,
  },

  /* BRAND — sits above the card as its own lockup, so the card doesn't
     have to carry the logo's visual weight on top of the form */

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

  /* CARD — a single soft surface, not a contrasting box: close in tone to
     the screen background, separated by a hairline border and a gentle
     shadow instead of hard color contrast */

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

  /* SECTIONS — a genuine 3-step sequence (info → security → role), so the
     numbered badges stay; they now sit inside a compact stepper row with a
     hairline rule underneath to close out the section cleanly */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionNumber: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: "#30483B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  sectionNumberText: {
    color: "#EDE8DC",
    fontSize: 11,
    fontWeight: "700",
  },

  sectionTitle: {
    color: "#20231F",
    fontSize: 15.5,
    fontWeight: "700",
  },

  sectionSubtitle: {
    color: "#697166",
    fontSize: 12,
    marginTop: 2,
  },

  sectionRule: {
    height: 1,
    backgroundColor: "#D4CCB8",
    marginBottom: 18,
  },

  securityHeader: {
    marginTop: 30,
  },

  roleHeader: {
    marginTop: 30,
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

  /* PHONE */

  phoneWrapper: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2EEE4",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C2B47C",
    overflow: "hidden",
  },

  countryCode: {
    height: "100%",
    minWidth: 56,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#CBD0C0",
    borderRightWidth: 1,
    borderRightColor: "#D4CCB8",
  },

  countryCodeText: {
    color: "#30483B",
    fontSize: 14,
    fontWeight: "700",
  },

  phoneInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#20231F",
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

  helperText: {
    color: "#697166",
    fontSize: 11.5,
    marginTop: 8,
    marginLeft: 2,
  },

  /* ROLES */

  rolesContainer: {
    gap: 10,
  },

  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 68,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#F2EEE4",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D2CCB8",
  },

  roleCardSelected: {
    backgroundColor: "#E2E5D8",
    borderColor: "#30483B",
    borderWidth: 1.5,
  },

  roleIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#DDE0D5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  roleIconSelected: {
    backgroundColor: "#30483B",
  },

  roleIconText: {
    color: "#30483B",
    fontSize: 16,
    fontWeight: "700",
  },

  roleIconTextSelected: {
    color: "#F6F1E7",
  },

  roleContent: {
    flex: 1,
  },

  roleTitle: {
    color: "#20231F",
    fontSize: 14,
    fontWeight: "700",
  },

  roleTitleSelected: {
    color: "#30483B",
  },

  roleDescription: {
    color: "#747A70",
    fontSize: 11.5,
    lineHeight: 16,
    marginTop: 3,
    paddingRight: 8,
    fontWeight: "400",
  },

  /* RADIO */

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#8B8F86",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  radioSelected: {
    borderColor: "#30483B",
    backgroundColor: "#30483B",
  },

  radioDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#F6F1E7",
  },

  /* SELECTED ROLE */

  selectedRoleBox: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: "#DCE1D5",
    borderLeftWidth: 3,
    borderLeftColor: "#A9573F",
  },

  selectedRoleLabel: {
    color: "#697166",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },

  selectedRoleText: {
    color: "#30483B",
    fontSize: 13.5,
    fontWeight: "800",
    marginTop: 3,
  },

  /* BUTTON */

  signupButton: {
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

  signupText: {
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

  /* LOGIN */

  loginDivider: {
    height: 1,
    backgroundColor: "#DDE0D5",
    marginTop: 22,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  loginText: {
    color: "#33372F",
    fontSize: 13,
  },

  loginLink: {
    color: "#30483B",
    fontWeight: "800",
    fontSize: 13,
  },

  /* FOOTER */

  footerText: {
    color: "#747A70",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 10,
  },
});