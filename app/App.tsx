import { WEATHER_API_KEY } from '@env';
import * as Location from 'expo-location';
import "expo-router/entry";
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WeatherDescKo } from './WeatherDescKo';
import { FontAwesome6, Fontisto } from '@expo/vector-icons';



const { width: SCREEN_WIDTH } = Dimensions.get('window');
const weatherApiKey = WEATHER_API_KEY;

type DailyWeather = {
  dt: number;
  temp: { day: number };
  weather: {
    main: string;
    description: string;
    icon: string;
    id: number;
  }[];
  wind_speed: number;
  humidity: number;
  pressure: number;
  // 필요하다면 더 추가
};

const WeatherDesc = ({ day }: { day: DailyWeather }) => {
  const id = day.weather[0].id;
  const match = WeatherDescKo.find(item => item.id === id);
  const desc = match?.desc ?? day.weather[0].description ?? "알 수 없음";
  const iconName = match?.icon ?? "question";

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%',
      alignSelf: 'center',
       }}>
      <Text
        style={[styles.weatherLabel, { flexShrink: 1 }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {desc}
      </Text>
      <Fontisto
        name={iconName as any}
        size={45}
        color="#00122e"
        style={[styles.weatherIcon, { marginLeft: 10, paddingTop: 20 }]}
      />
    </View>
  );
};


const App = () => {
  // const [location, setLocation] = useState(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [permitted, setPermitted] = useState(true);
  const [dailyWeather, setDailyWeather] = useState<DailyWeather[]>([]);


  const locationDate = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();

      if (!granted) {
        setPermitted(false);
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // const currentLocation = await Location.getCurrentPositionAsync({
      //   accuracy: Location.Accuracy.Highest
      // });
      // setLocation(currentLocation);
      // console.log("📍 위치 정보:", currentLocation);

      // const { latitude, longitude } = currentLocation.coords;

      // const address = await Location.reverseGeocodeAsync(
      //   { latitude, longitude },
      // );

      // 하드 코딩된 위치 정보
      const hardcodedLatitude = 37.55209180417618; // 예시: 서울 위도
      const hardcodedLongitude = 126.9173836945658; // 예시: 서울 경도

      const hardcodedLocationObject: Location.LocationObject = {
        coords: {
          latitude: hardcodedLatitude,
          longitude: hardcodedLongitude,
          altitude: null,       // 필요한 경우 실제 값으로 대체
          accuracy: null,      // 필요한 경우 실제 값으로 대체
          altitudeAccuracy: null, // 필요한 경우 실제 값으로 대체
          heading: null,       // 필요한 경우 실제 값으로 대체
          speed: null,        // 필요한 경우 실제 값으로 대체
        },
        timestamp: Date.now(), // 현재 타임스탬프
      };

      setLocation(hardcodedLocationObject); // 하드 코딩된 위치로 상태 업데이트
      console.log("📍 하드 코딩된 위치 정보:", hardcodedLocationObject);


      const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      });

      // 하드 코딩된 위치로 주소 정보 가져오기
      // const address = await getAddressFromCoords(hardcodedLatitude, hardcodedLongitude);
      // setCity(address);
      setCity('서울특별시');


      // Hardcoded Seoul
      // setLocation({ latitude: 37.55209180417618, longitude: 126.9173836945658 });



      const weatherAppUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&lang=kr&appid=${WEATHER_API_KEY}`;
      const resToWeather = await fetch(weatherAppUrl);
      const jsonForWeather = await resToWeather.json();

      if (Array.isArray(jsonForWeather.daily)) {
        setDailyWeather(jsonForWeather.daily);
      } else {
        setDailyWeather([]);
        setErrorMsg('날씨 데이터(daily)가 없습니다.');
      }
      // console.log('API 응답:', jsonForWeather);


      // console.log("🔑 API KEY:", WEATHER_API_KEY); // 이거 찍어봐!

      // setDailyWeather(weatherData.daily);

      // console.log("📫 주소 정보:", address[0].city);r
      // const cityAddress = address[0].city;
      // // setCity(cityAddress);

    } catch (error) {
      setErrorMsg(`Error fetching location/weather: ${error}`);
      console.error("🚨 에러 발생:", error);
    }
  };

  const date = new Date(); // Date 객체 생성
  // console.log(date); // 원시 Date 객체 출력
  
  const options = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;
  
  const dateString = date.toLocaleDateString('ko-KR', options);
  console.log(dateString); // 한국어 포맷된 날짜 출력



  useEffect(() => {
    locationDate(); // ✅ 반드시 이 안에서 호출
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cityCon}>
        {/* {errorMsg && <Text style={styles.error}>{errorMsg}</Text>} */}
        {location && (
          <>
            <Text style={styles.city}>{city}</Text>
            {/* <Text style={styles.coord}>경도: {location.coords.longitude}</Text>
            <Text style={styles.coord}>위도: {location.coords.latitude}</Text> */}
          </>
        )}
      </View>
      
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.weather}
      >
        {dailyWeather.length === 0 ? (
          <View style={styles.weatherInner}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={styles.weatherInner}>
            {dailyWeather.map((day) => {
              const date = new Date(day.dt * 1000);
              const dateString = date.toLocaleDateString('ko-KR', {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              // 요일 숫자+th/st/nd/rd 계산
              const n = date.getDate();
              const daySuffix = (n >= 11 && n <= 13) ? 'th' : ['st', 'nd', 'rd'][n % 10 - 1] || 'th';
              const weekDayText = `${n}${daySuffix}`;

              return (
                <View style={styles.day} key={day.dt}>
                  <Text style={styles.regDate}>{dateString}</Text>
                  <WeatherDesc day={day} />
                  <Text style={styles.temp}>
                    {typeof day.temp.day === 'number' ? day.temp.day.toFixed(1) : day.temp.day}
                  </Text>
                  <Text style={{ position: "absolute", bottom: 440, right: 80, fontSize: 50 }}>º</Text>
                  <View style={styles.forcastCon}>
                    <View style={styles.forcastTextBox}>
                      <Text style={styles.forcastTittle}>Weekly Forecast</Text>
                      <Text style={styles.WeekDayText}>{weekDayText}</Text>
                    </View>
                    <View style={styles.forcastBox}>
                      {/* 예시: 3개의 정보 박스 */}
                      <View style={styles.inforbox}>
                        <FontAwesome6 name="wind" size={24} color="white" />
                        <Text style={styles.forcastBoxText}>풍속</Text>
                        <Text style={styles.forcastBoxText}>{day.wind_speed} m/s</Text>
                  
                      </View>
                      <View style={styles.inforbox}>
                        <FontAwesome6 name="water" size={24} color="white" />
                        <Text style={styles.forcastBoxText}>습도</Text>
                        <Text style={styles.forcastBoxText}>{day.humidity} %</Text>
                       
                      </View>
                      <View style={styles.inforbox}>
                        <FontAwesome6 name="gauge" size={24} color="white" />
                        <Text style={styles.forcastBoxText}>기압</Text>
                        <Text style={styles.forcastBoxText}>{day.pressure} hPa</Text>
                        
                      </View>
                    </View>
                  </View>
                  {/* <Text style={styles.desc}>나는 햄복합니다~~ r</Text> */}
                </View>
              );
            })}
          </View>
        )}
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

  weatherInner: {
    width: '100%',
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  
  forcastCon: {
    width: '100%',
    flex: 0.6,
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 30,
  },

  forcastTextBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  forcastTittle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  
  forcastBox: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    justifyContent: 'space-between',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },

  WeekDayText: {
    flex : 2,
    fontSize: 20,
    fontWeight: 'normal',
    textAlign: 'right',
    paddingBottom: 12,
    paddingRight: 10,
  
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
    paddingTop: 50,
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
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
    textAlign: 'center',
  },
  temp: {
    fontSize: 100,
    color: 'black',
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  desc: {
    fontSize: 20,
    fontWeight: 'normal',
    color: 'black',
  },
  weatherIcon: {
    fontSize: 45,
    color: '#00122e',
  },
  forcastBoxText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    padding: 8,
    fontWeight: 'bold',
  },
  inforbox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});
export default App;
