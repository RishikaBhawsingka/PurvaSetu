import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F3F0E7"
      />

      <View style={styles.container}>

        {/* ================================================= */}
        {/* HEADER                                            */}
        {/* ================================================= */}

        <View style={styles.header}>

          {/* Small Header Logo */}
          <Text style={styles.headerLogo}>
            PurvaSetu
          </Text>

          {/* Authentication Buttons */}
          <View style={styles.authContainer}>

            {/* Login */}
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>
                Login
              </Text>
            </TouchableOpacity>

            {/* Sign Up */}
            <TouchableOpacity
              style={styles.signupButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Signup")}
            >
              <Text style={styles.signupText}>
                Sign Up
              </Text>
            </TouchableOpacity>



          </View>

        </View>


        {/* ================================================= */}
        {/* MAIN CONTENT                                      */}
        {/* ================================================= */}

        <View style={styles.mainContent}>

          {/* Eyebrow */}
          <Text style={styles.eyebrow}>
            SMART ROUTE INTELLIGENCE
          </Text>


          {/* ================================================= */}
          {/* MAIN BRAND LOGO                                  */}
          {/* ================================================= */}

          <View style={styles.mainLogoContainer}>

            <Text
              style={styles.mainLogo}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.65}
            >
              PURVA
              <Text style={styles.logoAccent}>
                SETU
              </Text>
            </Text>

          </View>


          {/* ================================================= */}
          {/* TAGLINE                                           */}
          {/* ================================================= */}

          <Text style={styles.tagline}>
            Bridging Distances,{"\n"}
            Connecting the Northeast
          </Text>


          {/* ================================================= */}
          {/* DECORATIVE DIVIDER                                */}
          {/* ================================================= */}

          <View style={styles.decorativeLine}>

            <View style={styles.line} />

            <View style={styles.dot} />

            <View style={styles.line} />

          </View>


          {/* ================================================= */}
          {/* DESCRIPTION                                       */}
          {/* ================================================= */}

          <Text style={styles.description}>
            Intelligent navigation designed for the
            unique roads and connectivity challenges
            of Northeast India.
          </Text>


          {/* ================================================= */}
          {/* ROUTE FEATURE CARDS                               */}
          {/* ================================================= */}

          <View style={styles.featureCards}>

            {/* ================================================= */}
            {/* FASTEST CARD                                      */}
            {/* ================================================= */}

            <View style={styles.featureCard}>

              <View
                style={[
                  styles.featureIcon,
                  styles.fastestIcon,
                ]}
              >
                <Text style={styles.featureIconText}>
                  ↗
                </Text>
              </View>

              <Text style={styles.featureTitle}>
                Fastest
              </Text>

              <Text style={styles.featureSubtitle}>
                Reach quicker with{"\n"}
                optimized routes.
              </Text>

            </View>


            {/* ================================================= */}
            {/* SAFEST CARD                                       */}
            {/* ================================================= */}

            <View style={styles.featureCard}>

              <View
                style={[
                  styles.featureIcon,
                  styles.safestIcon,
                ]}
              >
                <Text style={styles.featureIconText}>
                  ✓
                </Text>
              </View>

              <Text style={styles.featureTitle}>
                Safest
              </Text>

              <Text style={styles.featureSubtitle}>
                Navigate secure routes{"\n"}
                with real-time insights.
              </Text>

            </View>

          </View>


          {/* ================================================= */}
          {/* FIND BEST ROUTE CTA                               */}
          {/* ================================================= */}

          <TouchableOpacity
            style={styles.routeButton}
            activeOpacity={0.88}
            onPress={() => navigation.navigate("Route")}
          >

            {/* Left Side */}
            <View style={styles.routeLeft}>

              {/* Route Icon */}
              <View style={styles.routeIcon}>
                <Text style={styles.routeIconText}>
                  ⌖
                </Text>
              </View>


              {/* Route Text */}
              <View style={styles.routeButtonContent}>

                <Text style={styles.routeTitle}>
                  Find Best Route
                </Text>

                <Text style={styles.routeSubtitle}>
                  Fastest • Safest • Accessible
                </Text>

              </View>

            </View>


            {/* Arrow */}
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>
                →
              </Text>
            </View>

          </TouchableOpacity>
           <TouchableOpacity
  onPress={() => navigation.navigate("BackendTest")}
>
  <Text>Test Backend</Text>
</TouchableOpacity>

          {/* ================================================= */}
          {/* BOTTOM MESSAGE                                    */}
          {/* ================================================= */}

          <Text style={styles.bottomMessage}>
            Built for low connectivity regions across NER
          </Text>

        </View>

      </View>
    </SafeAreaView>
  );
};

export default Home;


/* ========================================================= */
/*                         STYLES                             */
/* ========================================================= */

const styles = StyleSheet.create({

  /* ======================================================= */
  /* SAFE AREA                                               */
  /* ======================================================= */

  safeArea: {
    flex: 1,
    backgroundColor: "#F3F0E7",
  },


  /* ======================================================= */
  /* MAIN CONTAINER                                          */
  /* ======================================================= */

  container: {
    flex: 1,
    backgroundColor: "#F3F0E7",
    paddingHorizontal: 22,
  },


  /* ======================================================= */
  /* HEADER                                                   */
  /* ======================================================= */

  header: {
    height: 72,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: "#D8D5C9",
  },


  /* Header PURVASETU */

  headerLogo: {
    fontSize: 19,

    fontWeight: "900",

    letterSpacing: 2,

    color: "#29463A",
  },


  /* ======================================================= */
  /* AUTH BUTTONS                                             */
  /* ======================================================= */

  authContainer: {
    flexDirection: "row",

    alignItems: "center",

    gap: 8,
  },


  /* ======================================================= */
  /* LOGIN BUTTON                                             */
  /* ======================================================= */

  loginButton: {
    height: 38,

    paddingHorizontal: 15,

    borderRadius: 20,

    borderWidth: 1.5,

    borderColor: "#29463A",

    justifyContent: "center",

    alignItems: "center",
  },


  loginText: {
    fontSize: 13,

    fontWeight: "700",

    color: "#29463A",
  },


  /* ======================================================= */
  /* SIGN UP BUTTON                                           */
  /* ======================================================= */

  signupButton: {
    height: 38,

    paddingHorizontal: 16,

    borderRadius: 20,

    backgroundColor: "#29463A",

    justifyContent: "center",

    alignItems: "center",
  },


  signupText: {
    fontSize: 13,

    fontWeight: "700",

    color: "#F3F0E7",
  },


  /* ======================================================= */
  /* MAIN CONTENT                                             */
  /* ======================================================= */

  mainContent: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    paddingBottom: 20,
  },


  /* ======================================================= */
  /* EYEBROW                                                  */
  /* ======================================================= */

  eyebrow: {
    fontSize: 11,

    letterSpacing: 2.2,

    fontWeight: "800",

    color: "#B38D42",

    marginBottom: 14,

    textAlign: "center",
  },


  /* ======================================================= */
  /* MAIN LOGO                                                */
  /* ======================================================= */

  mainLogoContainer: {
    width: "100%",

    alignItems: "center",

    justifyContent: "center",
  },


  mainLogo: {
    fontSize: 52,

    lineHeight: 60,

    fontWeight: "900",

    letterSpacing: -1.5,

    color: "#20231F",

    textAlign: "center",

    includeFontPadding: false,
  },


  /* SETU accent */

  logoAccent: {
    color: "#A9573F",
  },


  /* ======================================================= */
  /* TAGLINE                                                  */
  /* ======================================================= */

  tagline: {
    marginTop: 8,

    fontSize: 18,

    lineHeight: 25,

    fontWeight: "600",

    color: "#596057",

    textAlign: "center",

    letterSpacing: 0.1,
  },


  /* ======================================================= */
  /* DECORATIVE LINE                                          */
  /* ======================================================= */

  decorativeLine: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    marginTop: 27,

    marginBottom: 24,

    width: "65%",
  },


  line: {
    flex: 1,

    height: 1,

    backgroundColor: "#D1CEC1",
  },


  dot: {
    width: 7,

    height: 7,

    borderRadius: 5,

    backgroundColor: "#B38D42",

    marginHorizontal: 10,
  },


  /* ======================================================= */
  /* DESCRIPTION                                              */
  /* ======================================================= */

  description: {
    maxWidth: 315,

    fontSize: 14,

    lineHeight: 22,

    fontWeight: "500",

    color: "#6A6D65",

    textAlign: "center",

    marginBottom: 24,
  },


  /* ======================================================= */
  /* FEATURE CARDS                                            */
  /* ======================================================= */

  featureCards: {
    width: "100%",

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "stretch",

    marginBottom: 18,

    paddingHorizontal: 2,
  },


  /* ======================================================= */
  /* INDIVIDUAL FEATURE CARD                                  */
  /* ======================================================= */

  featureCard: {
    width: "48.2%",

    minHeight: 145,

    backgroundColor: "#F8F7F1",

    borderRadius: 22,

    alignItems: "center",

    justifyContent: "flex-start",

    paddingTop: 15,

    paddingBottom: 13,

    paddingHorizontal: 7,

    borderWidth: 1,

    borderColor: "#E1DED3",

    /* iOS shadow */
    shadowColor: "#20231F",

    shadowOffset: {
      width: 0,

      height: 6,
    },

    shadowOpacity: 0.13,

    shadowRadius: 9,

    /* Android shadow */
    elevation: 5,
  },


  /* ======================================================= */
  /* FEATURE ICONS                                            */
  /* ======================================================= */

  featureIcon: {
    width: 46,

    height: 46,

    borderRadius: 23,

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 9,
  },


  /* Fastest */

  fastestIcon: {
    backgroundColor: "#E4EBDD",
  },


  /* Safest */

  safestIcon: {
    backgroundColor: "#E1E9E1",
  },


  featureIconText: {
    fontSize: 22,

    fontWeight: "800",

    color: "#29463A",
  },


  /* ======================================================= */
  /* FEATURE TITLE                                            */
  /* ======================================================= */

  featureTitle: {
    fontSize: 14,

    fontWeight: "800",

    color: "#29322D",

    marginBottom: 5,

    textAlign: "center",
  },


  /* ======================================================= */
  /* FEATURE DESCRIPTION                                      */
  /* ======================================================= */

  featureSubtitle: {
    fontSize: 10.5,

    lineHeight: 15,

    fontWeight: "500",

    color: "#777A72",

    textAlign: "center",
  },


  /* ======================================================= */
  /* FIND BEST ROUTE                                          */
  /* ======================================================= */

  routeButton: {
    width: "100%",

    minHeight: 82,

    borderRadius: 22,

    backgroundColor: "#29463A",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingLeft: 14,

    paddingRight: 12,

    shadowColor: "#20231F",

    shadowOffset: {
      width: 0,

      height: 7,
    },

    shadowOpacity: 0.16,

    shadowRadius: 12,

    elevation: 6,
  },


  /* ======================================================= */
  /* ROUTE LEFT                                               */
  /* ======================================================= */

  routeLeft: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,
  },


  /* ======================================================= */
  /* ROUTE ICON                                               */
  /* ======================================================= */

  routeIcon: {
    width: 54,

    height: 54,

    borderRadius: 17,

    backgroundColor: "#D8DED2",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 13,
  },


  routeIconText: {
    fontSize: 28,

    color: "#29463A",

    fontWeight: "700",
  },


  /* ======================================================= */
  /* ROUTE TEXT                                               */
  /* ======================================================= */

  routeButtonContent: {
    flex: 1,
  },


  routeTitle: {
    fontSize: 18,

    fontWeight: "800",

    color: "#F3F0E7",

    marginBottom: 4,
  },


  routeSubtitle: {
    fontSize: 11,

    fontWeight: "600",

    color: "#C9D0C5",

    letterSpacing: 0.2,
  },


  /* ======================================================= */
  /* ARROW                                                    */
  /* ======================================================= */

  arrowContainer: {
    width: 42,

    height: 42,

    borderRadius: 21,

    backgroundColor: "#3D594C",

    justifyContent: "center",

    alignItems: "center",
  },


  arrow: {
    fontSize: 23,

    color: "#F3F0E7",

    fontWeight: "400",
  },


  /* ======================================================= */
  /* BOTTOM MESSAGE                                           */
  /* ======================================================= */

  bottomMessage: {
    marginTop: 20,

    fontSize: 11,

    fontWeight: "600",

    color: "#85877F",

    letterSpacing: 0.2,

    textAlign: "center",
  },

});