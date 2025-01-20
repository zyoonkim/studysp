import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Image, Text, View, SafeAreaView } from 'react-native';
import { useFonts, DMSans_400Regular } from '@expo-google-fonts/dm-sans';

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
  });
  const [showTextBlocks, setShowTextBlocks] = useState([false, false, false, false]);

  const handlePress = (index) => {
    setShowTextBlocks((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const libraries = [
    {
      name: "Shapiro Undergraduate Library",
      image: "https://www.lib.umich.edu/static/e01b363c2988bc9ff1e2a9b5063aad2f/e2514/Shapiro-1stFloor4-Apr2019.jpg",
    },
    {
      name: "Hatcher Undergraduate Library",
      image: "https://www.lib.umich.edu/static/e01b363c2988bc9ff1e2a9b5063aad2f/e2514/Shapiro-1stFloor4-Apr2019.jpg",
    },
    {
      name: "Law Library",
      image: "https://www.lib.umich.edu/static/e01b363c2988bc9ff1e2a9b5063aad2f/e2514/Shapiro-1stFloor4-Apr2019.jpg",
    },
    {
      name: "Duderstadt Undergraduate Library",
      image: "https://www.lib.umich.edu/static/e01b363c2988bc9ff1e2a9b5063aad2f/e2514/Shapiro-1stFloor4-Apr2019.jpg",
    },
  ];

  // Show a loading state until the fonts are loaded
  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text>Loading fonts...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>  
      {/* Banner */}
      <View style={styles.banners}>
        <Image
          style={{
            height: 150,
            width: 300,
          }}
          source={require('./assets/Study.png')} 
        />
      </View>

      {/* Dropdowns */}
      <ScrollView style={{ flex: 1, width: '100%' }}>
        {libraries.map((library, index) => (
          <View style={styles.sections} key={index}>
            {/* Buttons */}
            <Pressable style={styles.button} onPress={() => handlePress(index)} >
              <Text style={styles.buttonText}>
                {library.name}
              </Text>
            </Pressable>

            {/* Floor Info */}
            {showTextBlocks[index] && (
              <View style={styles.textBlocks}>
                <View style={styles.row}>
                  <Image
                    source={{
                      width: 150,
                      height: 100,
                      uri: library.image,
                    }}
                  />
                  <Text style={styles.dropdown}>First Floor</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.dropdown}>Second Floor</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.dropdown}>Third Floor</Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
  },
  banners: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#00274C',
    marginBottom: 15,
  },
  sections: {
    width: '100%',
    justifyContent: 'center',
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20, 
  },
  button: {
    backgroundColor: "#00274C",
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 23,
    fontFamily: 'DMSans_400Regular',
  },
  row: {
    flexDirection: 'row',
    padding: 5, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: "white",
  },
  dropdown: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 30,
    textAlign: "left",
    color: "black",
    fontFamily: 'DMSans_400Regular',
  },
  textBlocks: {
    padding: 10, 
    paddingTop: 5, 
    borderWidth: 3, 
    borderColor: "#00274c",
    borderRadius: 10,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});