import * as Location from 'expo-location';
import "expo-router/entry";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const App = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const[city, setCity] = useState(null);


  const locationDate = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({ accuracy: 5 });
    setLocation(currentLocation);
    console.log("📍 위치 정보:", currentLocation);

    const { latitude, longitude } = currentLocation.coords;

    const address = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMap: false }
    );

    console.log("📫 주소 정보:", address[0].city);
    const cityAddress = address[0].city;
    setCity(cityAddress);
  };

  useEffect(() => {
    locationDate(); // ✅ 반드시 이 안에서 호출
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cityCon}>
        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
        {location && (
          <>
            <Text style={styles.city}>{city}</Text>
            <Text style={styles.coord}>경도: {location.coords.longitude}</Text>
            <Text style={styles.coord}>위도: {location.coords.latitude}</Text>
          </>
        )}
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.weather}
      >
        <View style={styles.weatherInner}>
          {[1, 2, 3, 4].map((_, index) => (
            <View style={styles.day} key={index}>
              <Text style={styles.regDate}>05월 55일</Text>
              <Text style={styles.weatherLabel}>흐림</Text>
              <View style={styles.tempCon}>
                <Text style={styles.temp}>30</Text>
                <Text style={styles.desc}>나는 햄복합니다</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe01a',
  },
  cityCon: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  city: {
    fontSize: 50,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  coord: {
    marginTop: 10,
    fontSize: 16,
  },
  error: {
    marginTop: 10,
    color: 'red',
  },
  weather: {
    flex: 1,
  },
  weatherInner: {
    flexDirection: 'row',
  },
  day: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  regDate: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    borderRadius: 30,
  },
  weatherLabel: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
  },
  tempCon: {
    alignItems: 'center',
    padding: 10,
  },
  temp: {
    fontSize: 200,
    color: 'black',
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  desc: {
    fontSize: 20,
    fontWeight: 'normal',
    color: 'black',
  },
});

export default App;