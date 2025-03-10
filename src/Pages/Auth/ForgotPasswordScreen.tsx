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
import {forgotPassword} from '../../Redux/Auth/Auth';

// Validation schema using Yup
const validationSchema = Yup.object({
  phone_number: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{11,}$/, 'Phone number must be at least 11 digits'),
});

const ForgotPasswordScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Local loading and error state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const navigation = useNavigation();

  const handleForgotPassword = async (values: any) => {
    setLoading(true); // Set loading state to true when submit is initiated
    setError(null); // Clear any previous error

    try {
      // Dispatch the forgotPassword action
      const response = await dispatch(
        forgotPassword({phone_number: values.phone_number, otp: ''}),
      );

      // Check if the response is successful
      if (response.payload.success === true) {
        // Navigate to the ChangePasswordScreen if successful

        navigation.navigate('OTPScreen', {
          phone_number: values.phone_number,
          options: 'PasswordReset'
        });
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Set loading state to false once the process is completed
    }
  };

  return (
    <View style={{backgroundColor: Colors.whiteColor, flex: 1}}>
      <AuthHeaders />
      <ScrollView style={{padding: 16, backgroundColor: Colors.whiteColor}}>
        <BoldText style={styles.title}>Forgot Password</BoldText>
        <RegularText style={styles.description}>
          Enter your phone number to receive a password reset OTP.
        </RegularText>

        {/* Formik Form */}
        <Formik
          initialValues={{phone_number: ''}}
          validationSchema={validationSchema}
          onSubmit={handleForgotPassword}>
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

              <CustomButton
                title={loading ? 'Submitting...' : 'Submit'}
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

export default ForgotPasswordScreen;
