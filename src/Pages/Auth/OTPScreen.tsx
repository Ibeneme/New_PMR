import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomTextInput from '../../Components/TextInputs/CustomTextInputs'; // Assuming CustomTextInput is your component
import CustomButton from '../../Components/Buttons/CustomButton'; // Assuming CustomButton is your component
import {Colors} from '../../Components/Colors/Colors'; // Assuming you have a Colors file for common colors
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts'; // Assuming you have custom text components for typography
import AuthHeaders from '../../Components/Headers/AuthHeaders';
import {resendOTP, verifyOTP} from '../../Redux/Auth/Auth';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../Redux/Store';

const OTPScreen = ({route}: any) => {
  const {phone_number, options} = route.params; // Get phone number and password passed from the registration screen
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 6) {
      // Show a validation message or alert if OTP is invalid
      Alert.alert('Please enter a valid OTP');
      return;
    }

    setLoading(true);

    // Dispatch the verifyOTP action with the phone_number and OTP
    dispatch(verifyOTP({phone_number, otp}))
      .then(response => {
        setLoading(false);
        console.log('OTP Verified:', response); // Log the response from the API or action

        // Check if OTP verification is successful
        if (response?.payload?.success === true) {
          if (options === 'PasswordReset') {
            navigation.navigate('ChangePasswordScreen' as never); // Change 'HomeScreen' to the appropriate next screen
          }
          navigation.navigate('HomeScreen' as never); // Change 'HomeScreen' to the appropriate next screen
       
          // Navigate to the HomeScreen if OTP verification is successful
        } else {
          Alert.alert('Error', 'OTP verification failed. Please try again.');
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('Error verifying OTP:', error); // Log the error object
        Alert.alert('Error', error.message || 'Something went wrong.');
      });
  };

  const handleResendOtp = () => {
    setLoading(true);

    // Dispatch the resendOTP action with the phone_number
    dispatch(resendOTP(phone_number))
      .then(response => {
        setLoading(false);

        if (response?.payload?.success === true) {
          console.log('OTP Resent:', response); // Log the response from the API or action
          Alert.alert('Success', 'OTP has been resent to your phone number.');
        } else {
          console.log('Failed to resend OTP:', response); // Log if the response indicates failure
          Alert.alert('Error', 'Failed to resend OTP. Please try again later.');
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('Error resending OTP:', error); // Log the error object
        Alert.alert('Error', error.message || 'Failed to resend OTP.');
      });
  };

  return (
    <View style={{backgroundColor: Colors.whiteColor, flex: 1}}>
      <AuthHeaders />

      {/* OTP Form */}
      <ScrollView style={{padding: 16, backgroundColor: Colors.whiteColor}}>
        <View style={styles.header}>
          <BoldText style={styles.title}>Verify OTP</BoldText>
          <RegularText style={styles.description}>
            We sent a 6-digit OTP to {phone_number}. Please enter it below.
          </RegularText>
        </View>
        <CustomTextInput
          numeric
          label="Enter OTP"
          placeholder="OTP"
          onChangeText={setOtp}
          value={otp}
          error={otp.length !== 6 ? 'OTP must be 6 digits' : ''}
        />

        <CustomButton
          title={loading ? 'Verifying...' : 'Verify OTP'}
          onPress={handleVerifyOtp}
          marginTop={48}
        />

        <TouchableOpacity style={{marginTop: 20}} onPress={handleResendOtp}>
          <RegularText style={styles.resendOtpText}>Resend OTP</RegularText>
        </TouchableOpacity>
      </ScrollView>

      {/* Optional: Resend OTP Button */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'left',
  },
  form: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  resendOtpText: {
    color: Colors.primaryColor,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    marginBottom: 120,
  },
});

export default OTPScreen;
