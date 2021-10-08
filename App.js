import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { StyleSheet, Text, View , ScrollView, Dimensions,ActivityIndicator } from 'react-native';

const windowWidth = Dimensions.get('window').width

export default function App() {
  const DATE = [ "내일", "모레", "사흘 후", "나흘 후", "5일 후", "6일 후", "7일 후", ]
  const [city,setcity] = useState("Loading..")
  const [current, setCurrent] = useState()
  const [location] = useState()
  const [tempmax, setTempmax] = useState()
  const [sibal,setSibal] = useState()
  const [weather,setWeather] = useState()
  const [OK,setOK] = useState(true)
  const ask = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync()
    if(!granted){
      setOK(false)
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5})
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false})
    setcity(`${location[0].district} ${location[0].street}`)
    const API_KEY = "98b84918bcd6f42b284152f8ae08d4a7"
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json()
    const response2 = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    const json2 = await response2.json()
    setTempmax(json2)
    let JSONDAILY = json.daily
    setCurrent(json.current)
    setWeather(JSONDAILY)
    setSibal(JSONDAILY)

    
  
  }
 useEffect(() => {ask()
}, [])

  return (
    <View style={styles.container}>
      <View style={styles.Up}>
        <Text style={styles.Title}>{city}</Text>
        </View>
      <View style={styles.DOWN}>
      <ScrollView  horizontal pagingEnabled style={styles.Down}>
      {weather===undefined ? (<View style={styles.Day}>
            <ActivityIndicator size="large" color="white"/>
          </View>)
        :  
            (<View style={styles.Day}>
              <Text style={styles.Temp}>현재온도 {current.temp}℃</Text>
              <Text style={styles.Temp}>{current.weather[0].description}</Text>
              <Text>최고온도 : {tempmax.main.temp_max}℃</Text>
              <Text>최저온도 : {tempmax.main.temp_min}℃</Text>
              </View>
          )}
       
       {sibal===undefined ? (<View style={styles.Day}>
            <ActivityIndicator size="large" color="white"/>
          </View>)
        :  
          (sibal.map((day, index) => 
            <View key={index} style={styles.Day}>
              <Text>{DATE[index]}</Text>
              <Text>{day.weather[0].description}</Text>
              <Text>최고온도 : {day.temp.max}℃</Text>
              <Text>최저온도 : {day.temp.min}℃</Text>
              </View>
          ))}


      </ScrollView>
      </View>
    
      <StatusBar style="auto" />
    
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    backgroundColor:"red"

  },
  Up:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:'#D1EBFF',

  },
Down:{
  flex:3,
  backgroundColor:'#9FE0F7'

},
DOWN:{flex:3},
Title:{
  marginTop:10,
  fontSize:50,


},
Day:{ justifyContent:"center",
width:windowWidth,
alignItems:"center"

},
Temp:{fontSize:30},
Weather:{fontSize:30}
});
