import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../Redux/Auth/Auth'; // Assuming registerUser is a Redux action
import CustomTextInput from '../../Components/TextInputs/CustomTextInputs';
import CustomButton from '../../Components/Buttons/CustomButton';
import { AppDispatch } from '../../Redux/Store';
import { BoldText, RegularText } from '../../Components/Texts/CustomTexts/BaseTexts';
import { Colors } from '../../Components/Colors/Colors';
import AuthHeaders from '../../Components/Headers/AuthHeaders';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

// Validation schema using Yup
const validationSchema = Yup.object({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  phone_number: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{11,}$/, 'Phone number must be at least 11 digits'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  referral_code: Yup.string().optional(),
});

const CreateAccountScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation(); // Initialize navigation

  // Local loading and error state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = (values: any) => {
    setLoading(true); // Set loading state to true when registration is initiated
    setError(null); // Clear any previous error

    dispatch(registerUser(values))
      .then(() => {
        setLoading(false); // Set loading state to false once registration is successful
        // Log phone number and password, then navigate to OTP page
        console.log('Phone Number:', values.phone_number);
        console.log('Password:', values.password);

        // Navigate to OTP page and pass the phone number and password as params
        navigation.navigate('OTPScreen', {
          phone_number: values.phone_number,
          options: 'none',
        });
      })
      .catch((err: any) => {
        setLoading(false); // Set loading state to false if an error occurs
        setError(err.message || 'An error occurred'); // Set the error message
      });
  };

  return (
    <View style={{ backgroundColor: Colors.whiteColor, flex: 1 }}>
      <AuthHeaders />
      <ScrollView style={{ padding: 16, backgroundColor: Colors.whiteColor }}>
        <BoldText style={styles.title}>Create Account</BoldText>
        <RegularText style={styles.description}>
          Fill out the form to create an account.
        </RegularText>

        {/* Formik Form */}
        <Formik
          initialValues={{
            first_name: '',
            last_name: '',
            phone_number: '',
            email: '',
            password: '',
            referral_code: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
          }) => (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  justifyContent: 'space-between',
                }}>
                <CustomTextInput
                  label="First Name"
                  placeholder="First Name"
                  onChangeText={handleChange('first_name')}
                  value={values.first_name}
                  error={errors.first_name}
                  width={'48%'}
                />

                <CustomTextInput
                  label="Last Name"
                  placeholder="Last Name"
                  onChangeText={handleChange('last_name')}
                  value={values.last_name}
                  error={errors.last_name}
                  width={'48%'}
                />
              </View>

              <CustomTextInput
                label="Phone Number"
                placeholder="Phone Number"
                onChangeText={handleChange('phone_number')}
                value={values.phone_number}
                error={errors.phone_number}
              />

              <CustomTextInput
                label="Email"
                placeholder="Email"
                onChangeText={handleChange('email')}
                value={values.email}
                error={errors.email}
              />

              <CustomTextInput
                label="Password"
                placeholder="Password"
                onChangeText={handleChange('password')}
                value={values.password}
                error={errors.password}
                isPassword
              />

              <CustomTextInput
                label="Referral Code (Optional)"
                placeholder="Referral Code"
                onChangeText={handleChange('referral_code')}
                value={values.referral_code}
                error={errors.referral_code}
              />

              <CustomButton
                title={loading ? 'Registering...' : 'Register'}
                onPress={handleSubmit}
                marginTop={48}
              />

              {/* Optional: Login Link */}
              <TouchableOpacity onPress={() => console.log('Navigate to Login')}>
                <RegularText style={styles.forgotPassword}>
                  Already have an account? Login
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
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  forgotPassword: {
    color: Colors.primaryColor,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    marginBottom: 120,
  },
});

export default CreateAccountScreen;