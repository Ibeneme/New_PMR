import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import CustomTextInput from '../../../Components/TextInputs/CustomTextInputs';
import CustomButton from '../../../Components/Buttons/CustomButton';
import {
  RegularText,
  BoldText,
} from '../../../Components/Texts/CustomTexts/BaseTexts';
import {Colors} from '../../../Components/Colors/Colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import AuthHeaders from '../../../Components/Headers/AuthHeaders';
import ThreeDropdowns from '../../../Utils/DateDropdown';
import {senderCities} from '../SendParcel/Steps/Data';
import TimeDropdown from '../../../Utils/TimeDropdown';

const validationSchema = Yup.object({
  destination: Yup.string().nullable(),
  travelling_date: Yup.date().nullable(),
  current_city: Yup.string().nullable(),
  no_of_passengers: Yup.number()
    .min(1, 'Number of passengers must be at least 1')
    .max(2147483647, 'Number of passengers exceeds maximum')
    .nullable(),
  plate_no: Yup.string().nullable(),
  preferred_take_off: Yup.string().nullable(),
  time_of_take_off: Yup.string().nullable(),
  drop_off: Yup.string().nullable(),
  city: Yup.string().nullable(), // Adding validation for city selection
});

const OrderRide = () => {
  const route = useRoute()
  const {location} = route.params
  console.log(location)
  const navigation = useNavigation();
  const [currentCityModalVisible, setCurrentCityModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCurrentCity, setSelectedCurrentCity] = useState('');
  //const [senderCities, setSenderCities] = useState(['City A', 'City B', 'City C']); // Example cities
  const formik = useFormik({
    initialValues: {
      destination: '',
      travelling_date: '',
      current_city: '',
      no_of_passengers: '',
      plate_no: '',
      preferred_take_off: '',
      time_of_take_off: '',
      drop_off: '',
      city: '', // Add city field in initial values
    },
    validationSchema,
    onSubmit: values => {
      // Add the 'offer_ride' option to form data
      const updatedFormData = {
        ...values,
        option: 'offer_ride',
        location_name: location?.name,
        location_lat: location?.lat,
        location_lng: location?.lon,
      };

      // Navigate to the Summary screen, passing the form data
      navigation.navigate('Summary', {formData: updatedFormData});
    },
  });

  return (
    <View style={styles.container}>
      <AuthHeaders />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <BoldText style={styles.title}>Order Ride</BoldText>
        <RegularText style={styles.description}>
          Please provide the details for your ride.
        </RegularText>
        {/* Destination */}

        <View style={styles.inputContainer}>
          <RegularText>Travelling Date</RegularText>
          <ThreeDropdowns
            onYearChange={year =>
              formik.setFieldValue(
                'travelling_date',
                `${year}-${formik.values.travelling_date.split('-')[1] || ''}-${
                  formik.values.travelling_date.split('-')[2] || ''
                }`,
              )
            }
            onMonthChange={month =>
              formik.setFieldValue(
                'travelling_date',
                `${
                  formik.values.travelling_date.split('-')[0] || ''
                }-${month}-${
                  formik.values.travelling_date.split('-')[2] || ''
                }`,
              )
            }
            onDayChange={day =>
              formik.setFieldValue(
                'travelling_date',
                `${formik.values.travelling_date.split('-')[0] || ''}-${
                  formik.values.travelling_date.split('-')[1] || ''
                }-${day}`,
              )
            }
          />
        </View>
        {/* Travelling Date (Using ThreeDropdowns for Year, Month, Day) */}
        {/* Current City */}
        <CustomTextInput
          label="Destination"
          placeholder="Enter Destination"
          value={formik.values.destination}
          onChangeText={formik.handleChange('destination')}
          error={formik.errors.destination}
        />

        <View style={styles.inputContainer}>
          <RegularText>Current City</RegularText>
          <TouchableOpacity
            onPress={() => setCurrentCityModalVisible(true)}
            style={styles.customDropdown}>
            <RegularText style={styles.dropdownText}>
              {formik.values.current_city || 'Select Current City'}
            </RegularText>
          </TouchableOpacity>
          {formik.touched.current_city && formik.errors.current_city && (
            <RegularText style={styles.errorText}>
              {formik.errors.current_city}
            </RegularText>
          )}
        </View>
        {/* Number of Passengers */}
        <CustomTextInput
          label="Number of Passengers"
          placeholder="Enter Number of Passengers"
          value={formik.values.no_of_passengers}
          onChangeText={formik.handleChange('no_of_passengers')}
          error={formik.errors.no_of_passengers}
        />
        {/* Plate Number */}
        <CustomTextInput
          label="Plate Number"
          placeholder="Enter Plate Number"
          value={formik.values.plate_no}
          onChangeText={formik.handleChange('plate_no')}
          error={formik.errors.plate_no}
        />
        {/* Preferred Take-off */}
        <CustomTextInput
          label="Preferred Take-off Location"
          placeholder="Enter Preferred Take-off"
          value={formik.values.preferred_take_off}
          onChangeText={formik.handleChange('preferred_take_off')}
          error={formik.errors.preferred_take_off}
        />
        {/* Time of Take-off */}
        <View style={styles.inputContainer}>
          <RegularText>Time of Take-off</RegularText>
          <TimeDropdown
            selectedHour={formik?.values.time_of_take_off.split(':')[0] || ''}
            selectedMinute={formik?.values.time_of_take_off.split(':')[1] || ''}
            selectedAmPm={formik?.values.time_of_take_off.split(' ')[1] || 'AM'}
            onHourChange={hour => {
              const hour12 = hour % 12 || 12; // Adjusting to 12-hour format
              const amPm = formik.values.time_of_take_off.split(' ')[1] || 'AM';
              formik.setFieldValue(
                'time_of_take_off',
                `${hour12.toString().padStart(2, '0')}:${
                  formik.values.time_of_take_off.split(':')[1]
                } ${amPm}`,
              );
            }}
            onMinuteChange={minute => {
              const hour = formik.values.time_of_take_off.split(':')[0];
              const amPm = formik.values.time_of_take_off.split(' ')[1] || 'AM';
              formik.setFieldValue(
                'time_of_take_off',
                `${hour}:${minute.padStart(2, '0')}`,
              );
            }}
            onAmPmChange={amPm => {
              const hour = formik.values.time_of_take_off.split(':')[0];
              const minute = formik.values.time_of_take_off.split(':')[1];
              formik.setFieldValue(
                'time_of_take_off',
                `${hour}:${minute} ${amPm}`,
              );
            }}
          />
        </View>
        {/* Drop-off Location */}
        <CustomTextInput
          label="Drop-off Location"
          placeholder="Enter Drop-off Location"
          value={formik.values.drop_off}
          onChangeText={formik.handleChange('drop_off')}
          error={formik.errors.drop_off}
        />
        {/* City Selection */}
        <View style={styles.inputContainer}>
          <RegularText>City</RegularText>
          <TouchableOpacity
            onPress={() => setCityModalVisible(true)}
            style={styles.customDropdown}>
            <RegularText style={styles.dropdownText}>
              {selectedCity || 'Select City'}
            </RegularText>
          </TouchableOpacity>
          {formik.touched.city && formik.errors.city && (
            <RegularText style={styles.errorText}>
              {formik.errors.city}
            </RegularText>
          )}
        </View>
        {/* City Modal */}
        <Modal
          visible={cityModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCityModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={{marginBottom: 12, gap: 4}}>
                <BoldText fontSize={20}>City</BoldText>
                <RegularText
                  fontSize={13}
                  style={{
                    backgroundColor: Colors.primaryColorFaded,
                    color: Colors.primaryColor,
                    padding: 12,
                  }}>
                  Select a City - You can Scroll down to view more
                </RegularText>
              </View>

              <FlatList
                data={senderCities || []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCity(item);
                      formik.setFieldValue('city', item);
                      setCityModalVisible(false);
                    }}
                    style={styles.modalItem}>
                    <RegularText>{item}</RegularText>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={currentCityModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCurrentCityModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={{marginBottom: 12, gap: 4}}>
                <BoldText fontSize={20}>Current City</BoldText>
                <RegularText
                  fontSize={13}
                  style={{
                    backgroundColor: Colors.primaryColorFaded,
                    color: Colors.primaryColor,
                    padding: 12,
                  }}>
                  Select your Current City - You can Scroll down to view more
                </RegularText>
              </View>

              <FlatList
                data={senderCities || []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCurrentCity(item);
                      formik.setFieldValue('current_city', item);
                      setCurrentCityModalVisible(false);
                    }}
                    style={styles.modalItem}>
                    <RegularText>{item}</RegularText>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        <CustomButton
          title="Submit"
          onPress={formik.handleSubmit}
          disabled={!formik.isValid || formik.isSubmitting}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 0,
    marginTop: 20,
  },
  customDropdown: {
    backgroundColor: Colors.primaryColorFaded,
    padding: 12,
    borderRadius: 4,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.primaryColor,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    height: '70%',
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default OrderRide;
