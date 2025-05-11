import React, { useState, useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Image, Text, View, SafeAreaView, ActivityIndicator, Switch } from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';
import { useFonts, DMSans_400Regular } from '@expo-google-fonts/dm-sans';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
  });
  const [showTextBlocks, setShowTextBlocks] = useState([false, false, false, false]);
  const [hasPermission, setHasPermission] = useState(null);
  const [peopleCount, setPeopleCount] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(takePicture, 30000); // Every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handlePress = (index) => {
    setShowTextBlocks((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsLoading(true);
        setError(null);
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
        });

        const response = await axios.post(`${API_URL}/detect`, {
          image: photo.base64
        });

        setPeopleCount(response.data.people_count);
        setProcessedImage(`data:image/jpeg;base64,${response.data.processed_image}`);
      } catch (error) {
        setError('Failed to process image. Please try again.');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const libraries = [
    {
      name: "Shapiro Undergraduate Library",
      image: "https://www.lib.umich.edu/static/e01b363c2988bc9ff1e2a9b5063aad2f/e2514/Shapiro-1stFloor4-Apr2019.jpg",
      floors: [
        { name: "First Floor", capacity: 200 },
        { name: "Second Floor", capacity: 150 },
        { name: "Third Floor", capacity: 100 }
      ]
    },
    {
      name: "Hatcher Undergraduate Library",
      image: "https://www.lib.umich.edu/static/e01b363c2988bc9ff1e2a9b5063aad2f/e2514/Shapiro-1stFloor4-Apr2019.jpg",
      floors: [
        { name: "First Floor", capacity: 180 },
        { name: "Second Floor", capacity: 160 },
        { name: "Third Floor", capacity: 120 }
      ]
    },
    {
      name: "Law Library",
      image: "https://www.lib.umich.edu/static/e01b363c2988bc9ff1e2a9b5063aad2f/e2514/Shapiro-1stFloor4-Apr2019.jpg",
      floors: [
        { name: "First Floor", capacity: 150 },
        { name: "Second Floor", capacity: 130 },
        { name: "Third Floor", capacity: 110 }
      ]
    },
    {
      name: "Duderstadt Undergraduate Library",
      image: "https://www.lib.umich.edu/static/e01b363c2988bc9ff1e2a9b5063aad2f/e2514/Shapiro-1stFloor4-Apr2019.jpg",
      floors: [
        { name: "First Floor", capacity: 220 },
        { name: "Second Floor", capacity: 180 },
        { name: "Third Floor", capacity: 140 }
      ]
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
        <Camera 
          style={styles.camera} 
          ref={cameraRef}
          type={Camera.Constants.Type.back}
          ratio="16:9"
        >
          <View style={styles.cameraButtonContainer}>
            <Pressable style={styles.cameraButton} onPress={takePicture}>
              <Text style={styles.cameraButtonText}>Take Picture</Text>
            </Pressable>
          </View>
        </Camera>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#00274C" />
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
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
        <View style={styles.autoRefreshContainer}>
          <Text style={styles.autoRefreshText}>Auto-refresh every 30s</Text>
          <Switch
            value={autoRefresh}
            onValueChange={setAutoRefresh}
            trackColor={{ false: "#767577", true: "#00274C" }}
          />
        </View>
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
                {library.floors.map((floor, floorIndex) => (
                  <View key={floorIndex} style={styles.floorInfo}>
                    <Image
                      source={{
                        width: 150,
                        height: 100,
                        uri: library.image,
                      }}
                    />
                    <View style={styles.floorDetails}>
                      <Text style={styles.dropdown}>{floor.name}</Text>
                      <Text style={styles.capacityText}>Capacity: {floor.capacity}</Text>
                    </View>
                  </View>
                ))}
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
  floorInfo: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: "white",
  },
  floorDetails: {
    marginLeft: 20,
    flex: 1,
  },
  dropdown: {
    color: "black",
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
  },
  capacityText: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
    margin: 10,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  autoRefreshContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  autoRefreshText: {
    marginRight: 10,
    color: '#00274C',
  },
});