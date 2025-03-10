import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import CustomButton from '../../../../Components/Buttons/CustomButton';
import {Colors} from '../../../../Components/Colors/Colors';
import {
  BoldText,
  RegularText,
} from '../../../../Components/Texts/CustomTexts/BaseTexts';
import AuthHeaders from '../../../../Components/Headers/AuthHeaders';
import CustomTextInput from '../../../../Components/TextInputs/CustomTextInputs';

const StepC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {formData} = route.params; // Extract formData passed from StepB

  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [receiverGender, setReceiverGender] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate the form once all fields are filled
  useEffect(() => {
    if (
      receiverName &&
      receiverPhone &&
      receiverEmail &&
      receiverGender !== null
    ) {
      setIsFormValid(true); // Enable the Next button when form is valid
    } else {
      setIsFormValid(false); // Disable the Next button if any field is missing
    }
  }, [receiverName, receiverPhone, receiverEmail, receiverGender]);

  const handleNext = () => {
    const updatedFormData = {
      ...formData,
      receiver_name: receiverName,
      receiver_phone: receiverPhone,
      receiver_email: receiverEmail,
      receiver_gender: receiverGender,
      option: 'send_parcel',  // New key added
    };
  
    // Pass the updated formData to the next step (e.g., Summary page)
    navigation.navigate('Summary', { formData: updatedFormData });
  };
  return (
    <View style={styles.container}>
      <AuthHeaders />
      <View style={styles.header}>
        <BoldText style={styles.title}>Step 3 of 3</BoldText>
        <RegularText style={styles.description}>
          Please provide receiver details to complete the process.
        </RegularText>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.inputContainer}>
            <CustomTextInput
              label="Receiver's Name"
              placeholder="Enter receiver's name"
              value={receiverName}
              onChangeText={setReceiverName}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              label="Receiver's Phone"
              placeholder="Enter receiver's phone"
              value={receiverPhone}
              onChangeText={setReceiverPhone}
              numeric
              //keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              label="Receiver's Email"
              placeholder="Enter receiver's email"
              value={receiverEmail}
              onChangeText={setReceiverEmail}
              //keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <RegularText style={styles.label}>Receiver's Gender</RegularText>
            <View style={styles.genderSelection}>
              <TouchableOpacity
                onPress={() => setReceiverGender('Male')}
                style={[
                  styles.genderButton,
                  receiverGender === 'Male'
                    ? styles.selected
                    : styles.deselected,
                ]}>
                <RegularText
                  style={
                    receiverGender === 'Male'
                      ? styles.selectedOptionText
                      : styles.deselectedOptionText
                  }>
                  Male
                </RegularText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setReceiverGender('Female')}
                style={[
                  styles.genderButton,
                  receiverGender === 'Female'
                    ? styles.selected
                    : styles.deselected,
                ]}>
                <RegularText
                  style={
                    receiverGender === 'Female'
                      ? styles.selectedOptionText
                      : styles.deselectedOptionText
                  }>
                  Female
                </RegularText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setReceiverGender('Other')}
                style={[
                  styles.genderButton,
                  receiverGender === 'Other'
                    ? styles.selected
                    : styles.deselected,
                ]}>
                <RegularText
                  style={
                    receiverGender === 'Other'
                      ? styles.selectedOptionText
                      : styles.deselectedOptionText
                  }>
                  Other
                </RegularText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Next Button */}
          <CustomButton
            title="Next"
            onPress={handleNext}
            disabled={!isFormValid} // Disable if form is not valid
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
  header: {
    marginBottom: 20,
    padding: 16,
  },
  title: {
    fontSize: 24,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
  scrollContainer: {
    paddingBottom: 20,
    paddingTop: 24,
  },
  inputContainer: {
    marginBottom: -4,
  },
  label: {
    fontSize: 16,
    marginTop: 24,
  },
  genderSelection: {
    flexDirection: 'row',
    marginTop: 10,
  },
  genderButton: {
    height: 50,
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selected: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  selectedOptionText: {
    color: 'white',
    fontSize: 16,
  },
  deselected: {
    backgroundColor: 'transparent',
    borderColor: 'gray',
  },
  deselectedOptionText: {
    color: 'gray',
    fontSize: 16,
  },
});

export default StepC;
