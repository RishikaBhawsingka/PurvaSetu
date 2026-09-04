/**import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const Home = () => {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Welcome 👋
      </Text>

      <Text style={styles.subtitle}>
         to making of NER Project.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          Hello
        </Text>
      </TouchableOpacity>

    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },

  button: {
    backgroundColor: '#944b9aff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
})**/

import react from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'
const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EDE8DC" />

      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              PurvaSetu <Text style={styles.logoAI}>AI</Text>
            </Text>

            <Text style={styles.tagline}>
              Logistics & Accessibility Intelligence
            </Text>
          </View>

          <View style={styles.statusDot} />
        </View>


        {/* LOGIN / SIGN UP */}
        <View style={styles.authContainer}>

          <TouchableOpacity
  style={styles.loginButton}
  onPress={() => navigation.navigate('Login')}
>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
  style={styles.signupButton}
  onPress={() => navigation.navigate('Signup')}
>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>

        </View>


        {/* HERO SECTION */}
        <View style={styles.hero}>

          <Text style={styles.eyebrow}>
            SMART ROUTE INTELLIGENCE
          </Text>

          <Text style={styles.title}>
            Navigate NER{'\n'}
            <Text style={styles.titleAccent}>with confidence.</Text>
          </Text>

          <Text style={styles.description}>
            Intelligent route planning for the North Eastern Region,
            even when connectivity is limited.
          </Text>

        </View>


        {/* MAIN CTA */}
        <TouchableOpacity style={styles.routeButton}
        onPress={() => navigation.navigate("Route")} activeOpacity={0.85}>

          <View style={styles.routeIcon}>
            <Text style={styles.routeIconText}>⌖</Text>
          </View>

          <View style={styles.routeButtonContent}>
            <Text style={styles.routeButtonTitle}>
              Find Best Route
            </Text>

            <Text style={styles.routeButtonSubtitle}>
              Fastest • Safest • Accessible
            </Text>
          </View>

          <Text style={styles.arrow}>→</Text>

        </TouchableOpacity>


        {/* FEATURE CARDS */}
        <View style={styles.features}>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>⌁</Text>

            <Text style={styles.featureTitle}>
              Offline Maps
            </Text>

            <Text style={styles.featureText}>
              Navigate even{'\n'}without network
            </Text>
          </View>


          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>!</Text>

            <Text style={styles.featureTitle}>
              Risk Alerts
            </Text>

            <Text style={styles.featureText}>
              Detect route{'\n'}disruptions
            </Text>
          </View>

        </View>


        {/* BOTTOM INFO */}
        <View style={styles.bottomInfo}>

          <View style={styles.smallStatus} />

          <Text style={styles.bottomText}>
            Built for low-connectivity regions across NER
          </Text>

        </View>

      </View>
    </SafeAreaView>
  )
}

export default Home


const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#EDE8DC',
  },

  container: {
    flex: 1,
    backgroundColor: '#EDE8DC',
    paddingHorizontal: 24,
    paddingTop: 18,
  },


  /* HEADER */

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#30483B',
  },

  logoAI: {
    color: '#A9573F',
  },

  tagline: {
    marginTop: 3,
    fontSize: 9,
    letterSpacing: 0.7,
    color: '#6E7169',
    fontWeight: '500',
  },

  statusDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#30483B',
    borderWidth: 3,
    borderColor: '#CBD0C0',
  },


  /* AUTH */

  authContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 22,
    gap: 9,
  },

  loginButton: {
    paddingVertical: 9,
    paddingHorizontal: 17,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#30483B',
  },

  loginText: {
    color: '#30483B',
    fontSize: 13,
    fontWeight: '600',
  },

  signupButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#30483B',
  },

  signupText: {
    color: '#EDE8DC',
    fontSize: 13,
    fontWeight: '700',
  },


  /* HERO */

  hero: {
    marginTop: 55,
  },

  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '800',
    color: '#B8944A',
    marginBottom: 12,
  },

  title: {
    fontSize: 38,
    lineHeight: 43,
    fontWeight: '800',
    color: '#20231F',
  },

  titleAccent: {
    color: '#A9573F',
  },

  description: {
    marginTop: 17,
    fontSize: 15,
    lineHeight: 23,
    color: '#5C6058',
    maxWidth: 330,
  },


  /* ROUTE BUTTON */

  routeButton: {
    marginTop: 34,
    backgroundColor: '#30483B',
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#20231F',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  routeIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#CBD0C0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  routeIconText: {
    fontSize: 27,
    color: '#30483B',
    fontWeight: '700',
  },

  routeButtonContent: {
    flex: 1,
    marginLeft: 13,
  },

  routeButtonTitle: {
    color: '#EDE8DC',
    fontSize: 17,
    fontWeight: '700',
  },

  routeButtonSubtitle: {
    marginTop: 4,
    color: '#CBD0C0',
    fontSize: 11,
  },

  arrow: {
    color: '#EDE8DC',
    fontSize: 25,
    fontWeight: '300',
    marginLeft: 8,
  },


  /* FEATURES */

  features: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },

  featureCard: {
    flex: 1,
    backgroundColor: '#CBD0C0',
    borderRadius: 17,
    padding: 17,
    minHeight: 125,
  },

  featureIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#EDE8DC',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#A9573F',
    marginBottom: 13,
  },

  featureTitle: {
    color: '#20231F',
    fontSize: 14,
    fontWeight: '800',
  },

  featureText: {
    marginTop: 5,
    color: '#596057',
    fontSize: 11,
    lineHeight: 16,
  },


  /* BOTTOM */

  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 18,
  },

  smallStatus: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#B8944A',
    marginRight: 7,
  },

  bottomText: {
    color: '#777A72',
    fontSize: 10,
  },

})
