import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {loginUser} from '../../Redux/Auth/Auth';
import CustomTextInput from '../../Components/TextInputs/CustomTextInputs';
import CustomButton from '../../Components/Buttons/CustomButton';
import {AppDispatch} from '../../Redux/Store';
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts';
import {Colors} from '../../Components/Colors/Colors';
import AuthHeaders from '../../Components/Headers/AuthHeaders';
import {useNavigation} from '@react-navigation/native';
import {useToast} from '../../Context/useToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTokens} from '../../Context/TokenProvider';

// Validation schema using Yup
const validationSchema = Yup.object({
  phone_number: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{11,}$/, 'Phone number must be at least 11 digits'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {addToast} = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {updateTokens} = useTokens();
  const navigation = useNavigation();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleLogin = async (values: any) => {
    setLoading(true); // Set loading state to true when login is initiated
    setError(null); // Clear any previous error

    try {
      // Dispatch the loginUser action and handle response
      const response = await dispatch(loginUser(values));

      setLoading(false); // Set loading state to false once login is successful

      console.log('Login Response:', response);

      if (response.payload.success) {
        const {accessToken, refreshToken, user} = response.payload;

        // Store tokens and user data securely in AsyncStorage
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        await AsyncStorage.setItem('temp_id', user?._id);
        await AsyncStorage.setItem('phone_number', values.phone_number); // Store phone number
        await AsyncStorage.setItem('password', values.password); // Store password

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
        addToast('Invalid credentials. Please try again.', 'error');
      }
    } catch (err: any) {
      setLoading(false); // Set loading state to false if an error occurs

      // Log the error and display error message
      console.error('Login Error:', err);
      setError(err.message || 'An error occurred'); // Set the error message
    }
  };

  return (
    <View style={{backgroundColor: Colors.whiteColor, flex: 1}}>
      <AuthHeaders />
      <ScrollView style={{padding: 16, backgroundColor: Colors.whiteColor}}>
        <BoldText style={styles.title}>Login</BoldText>
        <RegularText style={styles.description}>
          Enter your phone number and password to access your account.
        </RegularText>

        {/* Formik Form */}
        <Formik
          initialValues={{phone_number: '', password: ''}}
          validationSchema={validationSchema}
          onSubmit={handleLogin}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
          }) => (
            <>
              <CustomTextInput
                label="Phone Number"
                placeholder="Phone Number"
                onChangeText={handleChange('phone_number')}
                value={values.phone_number}
                error={errors.phone_number}
              />

              <CustomTextInput
                label="Password"
                placeholder="Password"
                onChangeText={handleChange('password')}
                value={values.password}
                error={errors.password}
                isPassword
              />

              <CustomButton
                title={loading ? 'Logging in...' : 'Login'}
                onPress={handleSubmit}
                marginTop={48}
              />

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ForgotPasswordScreen' as never)
                }>
                <RegularText style={styles.forgotPassword}>
                  Forgot Password?
                </RegularText>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  forgotPassword: {
    color: Colors.primaryColor,
    textAlign: 'right',
    marginTop: 12,
    fontSize: 14,
  },
});

export default LoginScreen;
