// app/_layout.tsx
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RootLayout() {
  return <Stack />;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function IndexScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  console.log(Location);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    }

    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cityCon}>
        <Text style={styles.city}>현재 위치</Text>
        {location && (
          <Text style={styles.coord}>
            위도: {location.coords.latitude.toFixed(4)} / 경도: {location.coords.longitude.toFixed(4)}
          </Text>
        )}
        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
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
              <Text style={styles.regDate}>05월 23일</Text>
              <Text style={styles.weatherLabel}>흐림</Text>
              <View style={styles.tempCon}>
                <Text style={styles.temp}>30</Text>
                <Text style={styles.desc}>구름 많음</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}

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
    fontSize: 30,
    fontWeight: 'bold',
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