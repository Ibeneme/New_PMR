import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BoldText, RegularText } from '../../../../Components/Texts/CustomTexts/BaseTexts';
import CustomButton from '../../../../Components/Buttons/CustomButton';
import AuthHeaders from '../../../../Components/Headers/AuthHeaders';

const Summary = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { formData } = route.params || {}; // Default to an empty object if formData is undefined

  // Function to format the keys
  const formatKey = (key) => {
    return key
      ?.replace(/_/g, ' ') // Replace underscores with spaces
      ?.replace(/\b\w/g, (char) => char?.toUpperCase()) // Capitalize the first letter of each word
      ?.replace(/^\w/, (char) => char?.toUpperCase()); // Ensure the first letter of the first word is capitalized
  };

  // Function to display Yes/No for boolean values
  const formatValue = (value) => {
    if (typeof value === 'boolean') {
      return value === true ? 'Yes' : 'No';
    }
    if (typeof value === 'object' && value !== null) {
      // If it's an object, stringify it for display
      return JSON.stringify(value);
    }
    return value;
  };

  const handleConfirm = () => {
    console.log('Form Data confirmed', formData);
    navigation.navigate('Confirmation');
  };

  // If formData is not available, show a loading or error message
  if (!formData) {
    return (
      <View style={styles.container}>
        <Text>No form data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AuthHeaders />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <BoldText style={styles.title}>Summary</BoldText>
          <RegularText style={styles.description}>
            Please review the information below before confirming.
          </RegularText>
        </View>

        <View style={styles.summaryContainer}>
          {Object?.keys(formData)?.map((key) => {
            if (key === 'option') return null;

            return (
              <View key={key} style={styles.entryContainer}>
                <BoldText style={styles.key}>{formatKey(key)}</BoldText>
                <RegularText style={styles.value}>
                  {formatValue(formData[key])}
                </RegularText>
              </View>
            );
          })}
        </View>

        <CustomButton title="Confirm" onPress={handleConfirm} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
  scrollContainer: {
    paddingBottom: 64,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  entryContainer: {
    marginBottom: 24,
  },
  key: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
});

export default Summary;