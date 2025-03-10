import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ThreeDropdowns from '../../../Utils/DateDropdown';
import CustomTextInput from '../../../Components/TextInputs/CustomTextInputs';
import {
  RegularText,
  BoldText,
} from '../../../Components/Texts/CustomTexts/BaseTexts'; // Assuming you have these components
import { senderCities } from '../SendParcel/Steps/Data';
import AuthHeaders from '../../../Components/Headers/AuthHeaders';
import CustomButton from '../../../Components/Buttons/CustomButton';
import { Colors } from '../../../Components/Colors/Colors';

// Type definition for form state
interface JoinForm {
  destination: string;
  travelling_date: string;
  current_city: string;
}

// Validation schema with Yup
const validationSchema = Yup.object().shape({
  destination: Yup.string().required('Destination is required'),
  travelling_date: Yup.string().required('Travelling date is required'),
  current_city: Yup.string().required('Current city is required'),
});

const Join = () => {
  const [currentCity, setCurrentCity] = useState<string>('');
  const [isCurrentCityModalVisible, setCurrentCityModalVisible] = useState(false);
  const navigation = useNavigation();

  // Function to handle current city selection from modal
  const handleCurrentCityChange = (city: string) => {
    setCurrentCity(city);
    setCurrentCityModalVisible(false);
  };

  // Function to submit the form
  const handleSubmit = (values: JoinForm, resetForm: () => void) => {
    if (values.travelling_date) {
      const formdatas = {
       ...values,
        option: 'join_ride', // Pass the option in the formdata object
      };

      navigation.navigate('Summary', {formData: formdatas});

      resetForm(); // Reset the form after successful submission
    } else {
      console.log('Invalid travelling date');
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeaders />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <BoldText style={styles.heading}>Join a Ride</BoldText>
        <RegularText style={styles.description}>
          Fill out the form to join us for an exciting journey!
        </RegularText>

        <Formik
          initialValues={{
            destination: '',
            travelling_date: '',
            current_city: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <>
              {/* Destination Field */}
              <View style={styles.inputContainer}>
                <CustomTextInput
                  value={values.destination}
                  onChangeText={handleChange('destination')}
                  onBlur={handleBlur('destination')}
                  placeholder="Enter destination"
                  label="Enter destination"
                  error={errors.destination}
                />
              </View>

              {/* Travelling Date Field using ThreeDropdowns */}
              <View style={styles.inputContainer}>
                <BoldText>Travelling Date</BoldText>
                <ThreeDropdowns
                  onYearChange={year =>
                    setFieldValue(
                      'travelling_date',
                      `${year}-${values.travelling_date?.split('-')[1] || ''}-${
                        values.travelling_date?.split('-')[2] || ''
                      }`,
                    )
                  }
                  onMonthChange={month =>
                    setFieldValue(
                      'travelling_date',
                      `${
                        values.travelling_date?.split('-')[0] || ''
                      }-${month}-${
                        values.travelling_date?.split('-')[2] || ''
                      }`,
                    )
                  }
                  onDayChange={day =>
                    setFieldValue(
                      'travelling_date',
                      `${values.travelling_date?.split('-')[0] || ''}-${
                        values.travelling_date?.split('-')[1] || ''
                      }-${day}`,
                    )
                  }
                />
                {touched.travelling_date && errors.travelling_date && (
                  <Text style={styles.errorText}>{errors.travelling_date}</Text>
                )}
              </View>

              {/* Current City Field */}
              <View style={styles.inputContainer}>
                <BoldText>Current City</BoldText>
                <TouchableOpacity
                  onPress={() => setCurrentCityModalVisible(true)}
                  style={styles.customDropdown}>
                  <RegularText style={styles.dropdownText}>
                    {currentCity ||
                      'Select Current City - Choose from Dropdown'}
                  </RegularText>
                </TouchableOpacity>
                {touched.current_city && errors.current_city && (
                  <RegularText style={styles.errorText}>
                    {errors.current_city}
                  </RegularText>
                )}
              </View>

              {/* Submit Button */}
              <CustomButton
                title="Submit"
                onPress={() => handleSubmit()}> {/* Ensure that this calls handleSubmit from Formik */}
              </CustomButton>

              {/* Modal for Current City Selection */}
              <Modal
                visible={isCurrentCityModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCurrentCityModalVisible(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={{ marginBottom: 12, gap: 4 }}>
                      <BoldText fontSize={20}>Select Current City</BoldText>
                      <RegularText
                        fontSize={13}
                        style={{
                          backgroundColor: '#F0F0F0',
                          padding: 12,
                        }}>
                        Select a City - You can Scroll down to view more
                      </RegularText>
                    </View>
                    <FlatList
                      data={senderCities}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            handleCurrentCityChange(item); 
                            setFieldValue('current_city', item);  // Store selected city in form values
                          }}
                          style={styles.modalItem}>
                          <RegularText style={styles.modalItemText}>
                            {item}
                          </RegularText>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              </Modal>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  customDropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.grayColor,
    paddingVertical: 8,
  },
  submitButton: {
    backgroundColor: Colors.primaryColor,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '95%',
    height: '80%',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Join;