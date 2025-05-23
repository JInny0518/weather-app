import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [number, setNumber] = useState(0);

  return (
    <View style={ styles.container }>
      <Text style={{fontSize : 60}}> 결과 : {number}</Text>
      <View style={{ flexDirection : "row", gap:10}}>
       <Button title="증가" onPress={() => setNumber(number + 1)} />
        <Button title = "감소" onPress={() => setNumber(number -1)} />
      </View>
    </View>
  );}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  
  },
});