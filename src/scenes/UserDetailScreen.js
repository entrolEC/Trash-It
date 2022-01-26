import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  Dimensions,
  ActivityIndicator,
  Button,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCode,
} from '@react-native-community/google-signin';

import {URL} from '../../env.json';
import {LineChart} from 'react-native-chart-kit';
import dateFormat, {masks} from 'dateformat';

export const UserDetailScreen = ({user}) => {
  const [errMessage, setErrMessage] = useState();
  const [trashcanNum, setTrashcanNum] = useState();
  const [userData, setUserData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [chartData, setChartData] = useState({});
  const chartLabels = [];
  for (let i = 0; i < 7; i++) {
    chartLabels.push(
      dateFormat(new Date().getTime() - i * 24 * 60 * 60 * 1000, 'mm-dd'),
    );
  }
  chartLabels.reverse();

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#ffffff',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(37, 37, 37, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    getUserData();
    console.log(user);
  }, [user]);

  const getUserData = async () => {
    var requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'GET',
      redirect: 'follow',
    };

    const params = user.user.id;
    await fetch(`http://${URL}/users/${params}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('getUserData', result.log);
        let tmpUserData = [];
        for (let i = 0; i < 7; i++) {
          tmpUserData.push(
            result.log[chartLabels[i]] == null
              ? 0
              : result.log[chartLabels[i]].length,
          );
        }
        setUserData(tmpUserData);
        setTrashcanNum(result.total);
      })
      .catch((error) => console.log('error on userdetail ', error, params));
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <View style={styles.profile}>
        <Image
          source={{
            uri: user.user.photo,
          }}
          style={styles.image}
        />
        <View style={styles.profiletext}>
          <Text style={styles.username}>{user.user.name}</Text>
          <Text style={styles.email}>{user.user.email}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text>
          지금까지 총 {trashcanNum}개의 쓰레기통의 사진을 올리셨습니다.
        </Text>
      </View>
      <LineChart
        data={{
          labels: chartLabels,
          datasets: [
            {
              data: userData,
            },
          ],
        }}
        width={Dimensions.get('window').width - 20}
        height={220}
        verticalLabelRotation={0}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profiletext: {
    marginLeft: 30,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 25,
  },
  email: {
    marginTop: 10,
  },
  content: {
    marginTop: '10%',
  },
  chart: {
    marginTop: '20%',
  },
});
