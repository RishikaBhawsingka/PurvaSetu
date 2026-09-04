import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const Profile = () => {
  return (
    <View style={styles.container}>

      <Image
        source={{
          uri: 'https://i.pravatar.cc/300'
        }}
        style={styles.profileImage}
      />

      <Text style={styles.name}>
        Rishika
      </Text>

      <Text style={styles.bio}>
        React Native Developer 🚀
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>
          Projects Completed: 12
        </Text>

        <Text style={styles.cardText}>
          Skills: React Native, JavaScript
        </Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          Edit Profile
        </Text>
      </TouchableOpacity>

    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ca9fd3ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#6c3380ff',
  },

  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },

  bio: {
    fontSize: 16,
    color: '#030b15ff',
    marginTop: 8,
    marginBottom: 25,
  },

  card: {
    width: '100%',
    backgroundColor: '#794683ff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
  },

  cardText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#926693ff',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 14,
  },

  buttonText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
  },
})