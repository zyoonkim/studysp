import React, { useState, useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Image, Text, View, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';
import { useFonts, DMSans_400Regular } from '@expo-google-fonts/dm-sans';

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
  });
  const [showTextBlocks, setShowTextBlocks] = useState([false, false, false, false]);
  const [hasPermission, setHasPermission] = useState(null);
  const [peopleCount, setPeopleCount] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handlePress = (index) => {
    setShowTextBlocks((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
        });

        // Send image to Flask API
        const response = await axios.post('http://localhost:5000/detect', {
          image: photo.base64
        });

        setPeopleCount(response.data.people_count);
        setProcessedImage(`data:image/jpeg;base64,${response.data.processed_image}`);
      } catch (error) {
        console.error('Error:', error);
      }
    }
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

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text>Loading fonts...</Text></View>;
  }

  if (hasPermission === null) {
    return <View style={styles.loadingContainer}><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return <View style={styles.loadingContainer}><Text>No access to camera</Text></View>;
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

      {/* Camera Section */}
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraButtonContainer}>
            <Pressable style={styles.cameraButton} onPress={takePicture}>
              <Text style={styles.cameraButtonText}>Take Picture</Text>
            </Pressable>
          </View>
        </Camera>
        {processedImage && (
          <View style={styles.resultContainer}>
            <Image
              source={{ uri: processedImage }}
              style={styles.processedImage}
            />
            <Text style={styles.resultText}>
              People Count: {peopleCount}
            </Text>
          </View>
        )}
      </View>

      {/* Dropdowns */}
      <ScrollView style={{ flex: 1, width: '100%' }}>
        {libraries.map((library, index) => (
          <View style={styles.sections} key={index}>
            <Pressable style={styles.button} onPress={() => handlePress(index)}>
              <Text style={styles.buttonText}>
                {library.name}
              </Text>
            </Pressable>

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
  cameraContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: '#00274C',
    padding: 15,
    borderRadius: 10,
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 16,
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  processedImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
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