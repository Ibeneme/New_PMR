import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomTextInput from '../../../Components/TextInputs/CustomTextInputs';
import CustomButton from '../../../Components/Buttons/CustomButton';
import {
  BoldText,
  RegularText,
} from '../../../Components/Texts/CustomTexts/BaseTexts';
import {nigerianStates, senderCities} from '../SendParcel/Steps/Data';
import AuthHeaders from '../../../Components/Headers/AuthHeaders';
import {Colors} from '../../../Components/Colors/Colors';
import ThreeDropdowns from '../../../Utils/DateDropdown';

const validationSchema = Yup.object().shape({
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  travel_date: Yup.string().required('Travel date is required'),
  arrival_date: Yup.string().required('Arrival date is required'),
});

const DeliverParcelStepA = () => {
  const navigation = useNavigation();
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <View style={styles.container}>
      <AuthHeaders />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <BoldText style={styles.header}>Parcel Delivery - Step 1</BoldText>
          <RegularText style={styles.description}>
            Please provide the necessary details for your parcel delivery.
          </RegularText>
        </View>
        <Formik
          initialValues={{
            state: '',
            city: '',
            travel_date: '',
            arrival_date: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            console.log(values)
            navigation.navigate('DeliverParcelStepB', {formData: values});
          }}>
          {({handleSubmit, errors, touched, setFieldValue, values}) => (
            <View>
              {/* Country - Fixed to Nigeria */}
              <View style={styles.inputContainer}>
                <RegularText>Country</RegularText>
                <RegularText style={styles.fixedText}>Nigeria</RegularText>
              </View>

              {/* State Selection */}
              <View style={styles.inputContainer}>
                <RegularText>State</RegularText>
                <TouchableOpacity
                  onPress={() => setStateModalVisible(true)}
                  style={styles.customDropdown}>
                  <RegularText style={styles.dropdownText}>
                    {selectedState || 'Select State'}
                  </RegularText>
                </TouchableOpacity>
                {touched.state && errors.state && (
                  <RegularText style={styles.errorText}>
                    {errors.state}
                  </RegularText>
                )}
              </View>

              <Modal
                visible={stateModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setStateModalVisible(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={{marginBottom: 12, gap: 4}}>
                      <BoldText fontSize={20}>State</BoldText>
                      <RegularText
                        fontSize={13}
                        style={{
                          backgroundColor: Colors.primaryColorFaded,
                          color: Colors.primaryColor,
                          padding: 12,
                        }}>
                        Select a State - You can Scroll down to view more
                      </RegularText>
                    </View>

                    <FlatList
                      data={nigerianStates}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedState(item);
                            setFieldValue('state', item);
                            setStateModalVisible(false);
                          }}
                          style={styles.modalItem}>
                          <RegularText>{item}</RegularText>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              </Modal>

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
                {touched.city && errors.city && (
                  <RegularText style={styles.errorText}>
                    {errors.city}
                  </RegularText>
                )}
              </View>

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
                            setFieldValue('city', item);
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

              {/* Travel Date Picker */}
              <BoldText>Travel Date</BoldText>
              <ThreeDropdowns
                onYearChange={year =>
                  setFieldValue(
                    'travel_date',
                    `${year}-${values.travel_date.split('-')[1] || ''}-${
                      values.travel_date.split('-')[2] || ''
                    }`,
                  )
                }
                onMonthChange={month =>
                  setFieldValue(
                    'travel_date',
                    `${values.travel_date.split('-')[0] || ''}-${month}-${
                      values.travel_date.split('-')[2] || ''
                    }`,
                  )
                }
                onDayChange={day =>
                  setFieldValue(
                    'travel_date',
                    `${values.travel_date.split('-')[0] || ''}-${
                      values.travel_date.split('-')[1] || ''
                    }-${day}`,
                  )
                }
              />
              {errors.travel_date && (
                <RegularText style={styles.error}>
                  {errors.travel_date}
                </RegularText>
              )}

              {/* Arrival Date Picker */}
              <BoldText>Arrival Date</BoldText>
              <ThreeDropdowns
                onYearChange={year =>
                  setFieldValue(
                    'arrival_date',
                    `${year}-${values.arrival_date.split('-')[1] || ''}-${
                      values.arrival_date.split('-')[2] || ''
                    }`,
                  )
                }
                onMonthChange={month =>
                  setFieldValue(
                    'arrival_date',
                    `${values.arrival_date.split('-')[0] || ''}-${month}-${
                      values.arrival_date.split('-')[2] || ''
                    }`,
                  )
                }
                onDayChange={day =>
                  setFieldValue(
                    'arrival_date',
                    `${values.arrival_date.split('-')[0] || ''}-${
                      values.arrival_date.split('-')[1] || ''
                    }-${day}`,
                  )
                }
              />
              {errors.arrival_date && (
                <RegularText style={styles.error}>
                  {errors.arrival_date}
                </RegularText>
              )}

              <CustomButton title="Next" onPress={handleSubmit} />
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  scrollContainer: {paddingBottom: 30, padding: 16},
  header: {fontSize: 20, textAlign: 'center', marginBottom: 10},
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  inputContainer: {marginBottom: 24},
  customDropdown: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownText: {fontSize: 16},
  fixedText: {
    fontSize: 14,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  errorText: {color: 'red', fontSize: 12, marginTop: 4},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '95%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    height: '80%',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default DeliverParcelStepA;
