import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useNavigation, useRoute} from '@react-navigation/native';
import ThreeDropdowns from '../../../../Utils/DateDropdown';
import CustomButton from '../../../../Components/Buttons/CustomButton';
import AuthHeaders from '../../../../Components/Headers/AuthHeaders';
import {
  BoldText,
  RegularText,
} from '../../../../Components/Texts/CustomTexts/BaseTexts';
import {Colors} from '../../../../Components/Colors/Colors';
import {nigerianStates, senderCities} from './Data';
const validationSchema = Yup.object({
  state: Yup.string().required('State is required'),
  sender_city: Yup.string().required('Sender city is required'),
  receiver_city: Yup.string().required('Receiver city is required'),
  delivery_date: Yup.string().required('Delivery date is required').nullable(),
});

const StepA = () => {
  const route = useRoute()
  const {location} = route.params
  console.log(location)
  const navigation = useNavigation();
  const [state, setState] = useState('');
  const [senderCity, setSenderCity] = useState('');
  const [receiverCity, setReceiverCity] = useState('');
  const [isStateModalVisible, setStateModalVisible] = useState(false);
  const [isSenderCityModalVisible, setSenderCityModalVisible] = useState(false);
  const [isReceiverCityModalVisible, setReceiverCityModalVisible] =
    useState(false);

  const formik = useFormik({
    initialValues: {
      state: '',
      sender_city: '',
      receiver_city: '',
      delivery_date: null,
    },
    validationSchema,
    onSubmit: values => {
      if (!values.delivery_date) {
        // Show error message if no date is selected
        Alert.alert('Please select a delivery date before proceeding.');
        return;
      }
      navigation.navigate('StepB', {formData: values});
    },
  });

  const handleStateChange = value => {
    setState(value);
    formik.setFieldValue('state', value);
    setStateModalVisible(false);
  };

  const handleSenderCityChange = value => {
    setSenderCity(value);
    formik.setFieldValue('sender_city', value);
    setSenderCityModalVisible(false);
  };

  const handleReceiverCityChange = (value: any) => {
    setReceiverCity(value);
    formik.setFieldValue('receiver_city', value);
    setReceiverCityModalVisible(false);
  };

  const handleYearChange = (year: any) => {
    formik.setFieldValue(
      'delivery_date',
      `${year}-${formik?.values?.delivery_date?.split('-')[1] || ''}-${
        formik?.values?.delivery_date?.split('-')[2] || ''
      }`,
    );
  };

  const handleMonthChange = (month: any) => {
    formik?.setFieldValue(
      'delivery_date',
      `${formik?.values?.delivery_date?.split('-')[0] || ''}-${month}-${
        formik?.values?.delivery_date?.split('-')[2] || ''
      }`,
    );
  };

  const handleDayChange = (day: any) => {
    formik?.setFieldValue(
      'delivery_date',
      `${formik?.values?.delivery_date?.split('-')[0] || ''}-${
        formik?.values?.delivery_date?.split('-')[1] || ''
      }-${day}`,
    );
  };

  const isNextButtonDisabled = !formik.values.delivery_date;

  return (
    <View style={styles.container}>
      <AuthHeaders />
      <View style={{padding: 16, paddingTop: 24}}>
        <ScrollView>
          <BoldText style={styles.title}>Step 1 of 3</BoldText>
          <RegularText style={styles.description}>
            Please fill out the details below to continue with the process.
          </RegularText>

          <View style={styles.inputContainer}>
            <RegularText>State</RegularText>
            <TouchableOpacity
              onPress={() => setStateModalVisible(true)}
              style={styles.customDropdown}>
              <RegularText style={styles.dropdownText}>
                {state || 'Select State - Choose from Dropdown'}
              </RegularText>
            </TouchableOpacity>
            {formik.touched.state && formik.errors.state && (
              <RegularText style={styles.errorText}>
                {formik.errors.state}
              </RegularText>
            )}
          </View>

          <Modal
            visible={isStateModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setStateModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={{marginBottom: 12, gap: 4}}>
                  <BoldText fontSize={20}>Select a State</BoldText>
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
                      onPress={() => handleStateChange(item)}
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

          <View style={styles.inputContainer}>
            <RegularText>Sender City</RegularText>
            <TouchableOpacity
              onPress={() => setSenderCityModalVisible(true)}
              style={styles.customDropdown}>
              <RegularText style={styles.dropdownText}>
                {senderCity || 'Select Sender City - Choose from Dropdown'}
              </RegularText>
            </TouchableOpacity>
            {formik.touched.sender_city && formik.errors.sender_city && (
              <RegularText style={styles.errorText}>
                {formik.errors.sender_city}
              </RegularText>
            )}
          </View>

          <Modal
            visible={isSenderCityModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setSenderCityModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={{marginBottom: 12, gap: 4}}>
                  <BoldText fontSize={20}>Select Sender City</BoldText>
                  <RegularText
                    fontSize={13}
                    style={{
                      backgroundColor: Colors.primaryColorFaded,
                      color: Colors.primaryColor,
                      padding: 12,
                    }}>
                    Select a Sender City - You can Scroll down to view more
                  </RegularText>
                </View>

                <FlatList
                  data={senderCities}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => handleSenderCityChange(item)}
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

          <View style={styles.inputContainer}>
            <RegularText>Receiver City</RegularText>
            <TouchableOpacity
              onPress={() => setReceiverCityModalVisible(true)}
              style={styles.customDropdown}>
              <RegularText style={styles.dropdownText}>
                {receiverCity || 'Select Receiver City - Choose from Dropdown'}
              </RegularText>
            </TouchableOpacity>
            {formik.touched.receiver_city && formik.errors.receiver_city && (
              <RegularText style={styles.errorText}>
                {formik.errors.receiver_city}
              </RegularText>
            )}
          </View>

          <Modal
            visible={isReceiverCityModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setReceiverCityModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={{marginBottom: 12, gap: 4}}>
                  <BoldText fontSize={20}>Select Receiver City</BoldText>
                  <RegularText
                    fontSize={13}
                    style={{
                      backgroundColor: Colors.primaryColorFaded,
                      color: Colors.primaryColor,
                      padding: 12,
                    }}>
                    Select a Receiver City - You can Scroll down to view more
                  </RegularText>
                </View>
                <FlatList
                  data={senderCities}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => handleReceiverCityChange(item)}
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

          <RegularText>Delivery Date</RegularText>
          <ThreeDropdowns
            onYearChange={handleYearChange}
            onMonthChange={handleMonthChange}
            onDayChange={handleDayChange}
          />
          {formik.touched.delivery_date && formik.errors.delivery_date && (
            <RegularText style={styles.errorText}>
              {formik.errors.delivery_date}
            </RegularText>
          )}
          <CustomButton
            title="Next"
            onPress={formik.handleSubmit}
            disabled={isNextButtonDisabled}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    //fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 32,
  },
  customDropdown: {
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingLeft: 15,
    marginTop: 6,
  },
  dropdownText: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    padding: 20,
    borderRadius: 10,
    height: '75%',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default StepA;
