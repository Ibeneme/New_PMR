import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {AppDispatch} from '../../Redux/Store';
import CustomTextInput from '../../Components/TextInputs/CustomTextInputs';
import CustomButton from '../../Components/Buttons/CustomButton';
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts';
import {Colors} from '../../Components/Colors/Colors';
import AuthHeaders from '../../Components/Headers/AuthHeaders';
import {useNavigation} from '@react-navigation/native';
import {ChangePassword} from '../../Redux/Auth/Auth';

// Validation schema using Yup
const validationSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password'), null as never], 'Passwords must match'),
});

const ChangePasswordScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Local loading and error state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleChangePassword = (values: any) => {
    setLoading(true); // Set loading state to true when submit is initiated
    setError(null); // Clear any previous error

    // Data for password change (you need phone_number and otp)
    const otpData = {
      phone_number: 'UserPhoneNumber', // Replace with actual phone number from state or user context
      otp: 'UserOTP', // Replace with actual OTP
      password: values.password, // New password
    };

    // Dispatch the ChangePassword action
    dispatch(ChangePassword(otpData))
      .unwrap()
      .then(() => {
        // Navigate to a success screen or home page on successful password change
        navigation.navigate('HomeScreen' as never);
      })
      .catch((err: any) => {
        // Set error message if the password change fails
        setError(
          err.message || 'An error occurred while changing the password.',
        );
      })
      .finally(() => {
        setLoading(false); // Set loading to false once the process is completed
      });
  };

  return (
    <View style={{backgroundColor: Colors.whiteColor, flex: 1}}>
      <AuthHeaders />
      <ScrollView style={{padding: 16, backgroundColor: Colors.whiteColor}}>
        <BoldText style={styles.title}>Change Password</BoldText>
        <RegularText style={styles.description}>
          Enter your new password and confirm it to reset your password.
        </RegularText>

        {/* Formik Form */}
        <Formik
          initialValues={{password: '', confirmPassword: ''}}
          validationSchema={validationSchema}
          onSubmit={handleChangePassword}>
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
                label="New Password"
                placeholder="New Password"
                onChangeText={handleChange('password')}
                value={values.password}
                error={errors.password}
                isPassword
              />

              <CustomTextInput
                label="Confirm Password"
                placeholder="Confirm Password"
                onChangeText={handleChange('confirmPassword')}
                value={values.confirmPassword}
                error={errors.confirmPassword}
                isPassword
              />

              <CustomButton
                title={loading ? 'Changing Password...' : 'Submit'}
                onPress={handleSubmit}
                marginTop={48}
              />
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
});

export default ChangePasswordScreen;
