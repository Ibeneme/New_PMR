import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import CustomButton from '../../../Components/Buttons/CustomButton';
import {
  BoldText,
  RegularText,
} from '../../../Components/Texts/CustomTexts/BaseTexts';
import {Colors} from '../../../Components/Colors/Colors';
import CustomTextInput from '../../../Components/TextInputs/CustomTextInputs';
import AuthHeaders from '../../../Components/Headers/AuthHeaders';

const validationSchema = Yup.object({
  bus_stop: Yup.string().nullable(),
  can_carry_light: Yup.boolean().nullable(),
  can_carry_heavy: Yup.boolean().nullable(),
  min_price: Yup.number()
    .min(0, 'Minimum price must be a positive number')
    .nullable(),
  max_price: Yup.number()
    .min(Yup.ref('min_price'), 'Max price must be greater than min price')
    .nullable(),
});

const DeliverParcelStepB = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {formData} = route.params; // Get form data passed from Step A

  const formik = useFormik({
    initialValues: {
      bus_stop: formData.bus_stop || '',
      can_carry_light: formData.can_carry_light || null, // Set as null initially
      can_carry_heavy: formData.can_carry_heavy || null, // Set as null initially
      min_price: formData.min_price || '',
      max_price: formData.max_price || '',
    },
    validationSchema,
    onSubmit: values => {
        if (
          values.min_price &&
          values.max_price &&
          values.max_price < values.min_price
        ) {
          Alert.alert('Max price cannot be lower than Min price.');
          return;
        }
      
        // Add 'option' key to the formData and merge with current form values
        const updatedFormData = {
          ...formData,
          ...values,
          option: 'deliver_parcel', // Add the new key-value pair here
        };
      
        // Navigate to the 'Summary' screen with the updated formData
        navigation.navigate('Summary', {formData: updatedFormData});
      },
  });

  const renderOption = (field, value) => {
    const options = ['Yes', 'No'];
    return options.map((option) => (
      <TouchableOpacity
        key={option}
        style={[
          styles.optionButton,
          formik.values[field] === (option === 'Yes') // Compare with boolean value
            ? {backgroundColor: Colors.primaryColor, color: 'white'}
            : {backgroundColor: '#f0f0f0', color: '#333'},
        ]}
        onPress={() => formik.setFieldValue(field, option === 'Yes')} // Set boolean value
      >
        <RegularText
          style={[
            styles.optionText,
            formik.values[field] === (option === 'Yes') 
              ? {color: 'white'} 
              : {color: '#333'},
          ]}
        >
          {option}
        </RegularText>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <AuthHeaders />
      <ScrollView contentContainerStyle={{paddingBottom: 20, padding: 16}}>
        <BoldText style={styles.title}>Step 2 of 3</BoldText>
        <RegularText style={styles.description}>
          Please fill out the details below to continue with the process.
        </RegularText>

        {/* Bus Stop */}
        <View style={styles.inputContainer}>
          <CustomTextInput
            label={`Bus Stop (Optional)`}
            placeholder="Enter Bus Stop"
            value={formik.values.bus_stop}
            onChangeText={formik.handleChange('bus_stop')}
            error={formik.errors.bus_stop}
          />
        </View>

        {/* Can Carry Light */}
        <View style={styles.inputContainer}>
          <RegularText>Can Carry Light</RegularText>
          <View style={styles.optionContainer}>
            {renderOption('can_carry_light', formik.values.can_carry_light)}
          </View>
        </View>

        {/* Can Carry Heavy */}
        <View style={styles.inputContainer}>
          <RegularText>Can Carry Heavy</RegularText>
          <View style={styles.optionContainer}>
            {renderOption('can_carry_heavy', formik.values.can_carry_heavy)}
          </View>
        </View>

        {/* Minimum Price */}
        <View style={styles.inputContainer}>
          <CustomTextInput
            label="Enter Min Price"
            placeholder="Enter Min Price"
            numeric
            value={formik.values.min_price.toString()}
            onChangeText={text =>
              formik.setFieldValue('min_price', parseFloat(text))
            }
            error={formik.errors.min_price}
          />
        </View>

        {/* Maximum Price */}
        <View style={styles.inputContainer}>
          <CustomTextInput
            label="Enter Max Price"
            placeholder="Enter Max Price"
            numeric
            value={formik.values.max_price.toString()}
            onChangeText={text =>
              formik.setFieldValue('max_price', parseFloat(text))
            }
            error={formik.errors.max_price}
          />
        </View>

        {/* Next Button */}
        <CustomButton
          title="Next"
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
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default DeliverParcelStepB;