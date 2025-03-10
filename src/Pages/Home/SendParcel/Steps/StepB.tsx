import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import CustomButton from '../../../../Components/Buttons/CustomButton';
import {Colors} from '../../../../Components/Colors/Colors';
import {
  BoldText,
  RegularText,
} from '../../../../Components/Texts/CustomTexts/BaseTexts';
import AuthHeaders from '../../../../Components/Headers/AuthHeaders';

const StepB = () => {
  const route = useRoute();
  const {formData} = route.params; // Extract data passed from StepA

  const [isPerishable, setIsPerishable] = useState(null); // Initially none selected
  const [isFragile, setIsFragile] = useState(null); // Initially none selected
  const [isFormValid, setIsFormValid] = useState(false);
  const navigation = useNavigation();
  const handleSelection = (type, value) => {
    if (type === 'is_perishable') {
      setIsPerishable(value);
    } else if (type === 'is_fragile') {
      setIsFragile(value);
    }
  };

  // Check if both options are selected
  useEffect(() => {
    if (isPerishable !== null && isFragile !== null) {
      setIsFormValid(true); // Enable Next button only when both are selected
    } else {
      setIsFormValid(false); // Disable Next button if any option is not selected
    }
  }, [isPerishable, isFragile]);

  return (
    <View style={styles.container}>
      <AuthHeaders />
      <View style={styles.header}>
        <BoldText style={styles.title}>Step 2 of 3</BoldText>
        <RegularText style={styles.description}>
          Please review the details and select the options below.
        </RegularText>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.optionContainer}>
            <RegularText>Is the item perishable?</RegularText>
            <View style={styles.selectionContainer}>
              <TouchableOpacity
                onPress={() => handleSelection('is_perishable', true)}
                style={[
                  styles.optionButton,
                  isPerishable === true ? styles.selected : styles.deselected,
                ]}>
                <RegularText
                  style={
                    isPerishable === true
                      ? styles.selectedOptionText
                      : styles.deselectedOptionText
                  }>
                  Yes
                </RegularText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSelection('is_perishable', false)}
                style={[
                  styles.optionButton,
                  isPerishable === false ? styles.selected : styles.deselected,
                ]}>
                <RegularText
                  style={
                    isPerishable === false
                      ? styles.selectedOptionText
                      : styles.deselectedOptionText
                  }>
                  No
                </RegularText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.optionContainer}>
            <RegularText>Is the item fragile?</RegularText>
            <View style={styles.selectionContainer}>
              <TouchableOpacity
                onPress={() => handleSelection('is_fragile', true)}
                style={[
                  styles.optionButton,
                  isFragile === true ? styles.selected : styles.deselected,
                ]}>
                <RegularText
                  style={
                    isFragile === true
                      ? styles.selectedOptionText
                      : styles.deselectedOptionText
                  }>
                  Yes
                </RegularText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSelection('is_fragile', false)}
                style={[
                  styles.optionButton,
                  isFragile === false ? styles.selected : styles.deselected,
                ]}>
                <RegularText
                  style={
                    isFragile === false
                      ? styles.selectedOptionText
                      : styles.deselectedOptionText
                  }>
                  No
                </RegularText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Next Button */}
          <CustomButton
            title="Next"
            onPress={() => {
              // Update formData with selected options
              const updatedFormData = {
                ...formData,
                is_perishable: isPerishable,
                is_fragile: isFragile,
              };

              // Log the updated formData to confirm
              console.log(updatedFormData);

              // Navigate to StepC and pass updated formData
              navigation.navigate('StepC', {formData: updatedFormData});
            }}
            disabled={!isFormValid} // Disable the button if the form is not valid
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
  optionContainer: {
    marginBottom: 20,
  },
  selectionContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  optionButton: {
    height: 50,
    width: '48%',
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
    color: 'white', // Selected option text color
    fontSize: 16,
  },
  deselected: {
    backgroundColor: 'transparent',
    borderColor: 'gray',
  },
  deselectedOptionText: {
    color: 'gray', // Deselected option text color
    fontSize: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#666',
  },
});

export default StepB;
