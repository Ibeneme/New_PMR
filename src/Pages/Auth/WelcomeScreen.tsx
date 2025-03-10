import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Image, useWindowDimensions} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts';
import image from '../../../assets/images/car.png';
import {Colors} from '../../Components/Colors/Colors';
import CustomButton from '../../Components/Buttons/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {loginUser} from '../../Redux/Auth/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppDispatch} from '../../Redux/Store';
import {useTokens} from '../../Context/TokenProvider';

type Props = {};

const WelcomeScreen = (props: Props) => {
  const [showText, setShowText] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const {width, height} = useWindowDimensions();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>(); // Initialize the dispatch function

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowText(false);
      setShowImage(true);
    }, 500);

    const timer2 = setTimeout(() => {
      setShowImage(false);
      setShowContent(true);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  const {updateTokens} = useTokens();
  // Check AsyncStorage for phone number and password, and dispatch login if found
  useEffect(() => {
    const checkLogin = async () => {
      const phone_number = await AsyncStorage.getItem('phone_number');
      const password = await AsyncStorage.getItem('password');

      if (phone_number && password) {
        try {
          // Dispatch the loginUser action with phone_number and password
          const response = await dispatch(loginUser({phone_number, password}));

          console.log('Login Response:', response);

          if (response.payload.success) {
            const {accessToken, refreshToken, user} = response.payload;

            // Store tokens and user data securely in AsyncStorage
            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);
            await AsyncStorage.setItem('temp_id', user?._id);

            console.log(
              accessToken,
              refreshToken,
              user,
              'response.payload.success',
            );

            // Update tokens in the context
            updateTokens(accessToken, refreshToken);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            // // Navigate to OTP screen or any other screen after successful login
            // navigation.navigate('OTPScreen', {
            //   phone_number: values.phone_number,
            // });
          } else {
            // Handle unsuccessful login
          }
        } catch (err) {
          console.error('Login Error:', err);
          // Handle any errors during login
        }
      }
    };

    checkLogin(); // Call the checkLogin function when the component mounts
  }, [dispatch]);

  const handleLoginPress = () => {
    navigation.navigate('LoginScreen' as never);
  };

  const handleCreateAccountPress = () => {
    navigation.navigate('CreateAccountScreen' as never);
  };

  return (
    <View style={{flex: 1}}>
      {showText && (
        <View style={styles.purpleBackground}>
          <BoldText style={styles.whiteText}>PadimanRoute</BoldText>
        </View>
      )}

      {showContent && (
        <View style={styles.whiteBackground}>
          <View style={styles.columnContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={image}
                style={[styles.image, {height: height / 1.65, width: width}]}
              />
            </View>

            <View style={styles.textContainer}>
              <BoldText style={styles.headerText}>
                Welcome to PadimanRoute
              </BoldText>
              <RegularText style={styles.welcomeText}>
                Package Delivery Simplified and Rides for Users
              </RegularText>

              <View style={styles.buttonsContainer}>
                <CustomButton
                  title="Login"
                  onPress={handleLoginPress}
                  width={width - 16}
                />
                <CustomButton
                  title="Create Account"
                  onPress={handleCreateAccountPress}
                  width={width - 16}
                  marginTop={0}
                  backgroundColors={Colors.primaryColorFaded}
                  textColor={Colors.primaryColor}
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  purpleBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
  },
  whiteText: {
    fontSize: 24,
    color: 'white',
  },
  whiteBackground: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '100%',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    width: '100%',
  },
  image: {
    width: 400,
  },
  welcomeText: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'column',
    marginTop: 20,
    gap: 10,
    width: '100%',
  },
  headerText: {
    fontSize: 22,
    marginBottom: 4,
    textAlign: 'center',
  },
});

export default WelcomeScreen;
