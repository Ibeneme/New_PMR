import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomTextInput from '../../Components/TextInputs/CustomTextInputs';
import CustomButton from '../../Components/Buttons/CustomButton';
//import {updateUserProfile} from '../../Redux/Auth/Auth'; // Assuming updateUserProfile is a Redux action
import {AppDispatch} from '../../Redux/Store';
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts';
import {Colors} from '../../Components/Colors/Colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {updateUser} from '../../Redux/Auth/Auth';
import AuthHeaders from '../../Components/Headers/AuthHeaders';

// Validation schema using Yup
const validationSchema = Yup.object({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const EditProfileScreen = () => {
  const route = useRoute();
  const {user} = route.params; // Get user data from route params
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateProfile = (values: any) => {
    setLoading(true);
    setError(null);

    // Include the _id in the values passed for the update
    const updatedValues = {
      ...values,
      _id: user?._id, // Add the user ID to the values being updated
    };

    dispatch(updateUser(updatedValues))
      .then(response => {
        setLoading(false);
        console.log('Profile update successful:', response); // Log successful response
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack(); // Navigate back after successful update
      })
      .catch((err: any) => {
        setLoading(false);
        setError(err.message || 'An error occurred');
        console.error('Error during profile update:', err); // Log the error
      });
  };

  return (
    <View style={{backgroundColor: Colors.whiteColor, flex: 1}}>
      <AuthHeaders />
      <ScrollView style={{padding: 16, backgroundColor: Colors.whiteColor}}>
        <BoldText style={styles.title}>Edit Profile</BoldText>
        <RegularText style={styles.description}>
          Update your profile details below.
        </RegularText>

        {/* Formik Form */}
        <Formik
          initialValues={{
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleUpdateProfile}>
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
                label="Email"
                placeholder="Email"
                onChangeText={handleChange('email')}
                value={values.email}
                error={errors.email}
              />

              {error && (
                <RegularText style={styles.errorText}>{error}</RegularText>
              )}

              <CustomButton
                title={loading ? 'Updating...' : 'Update Profile'}
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
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default EditProfileScreen;
