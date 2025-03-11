import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import AuthHeaders from '../../Components/Headers/AuthHeaders';
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts';

// Function to format date
const formatDate = dateString => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date)) return dateString; // Return original if it's not a valid date

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const DetailsScreen = () => {
  const route = useRoute();
  const {item, activeTab} = route.params;

  // Keys to exclude
  const excludeKeys = [
    '_id',
    '__v',
    'createdAt',
    'updatedAt',
    'userId',
    'user_first_name',
    'user_last_name',
    'users_phone_number',
    'driver',
    'driver_first_name',
    'driver_last_name',
    'driver_phone_number',
    'cancelRide',
    'confirmRide',
    'endRide',
    'paid',
    'rateRide',
    'refundRide',
    'reportRide',
    'time_paid',
    'reportRideReason',
    'startRide',
    'average_driver_rating',
  ];

  // Filter item data (exclude keys & remove null values)
  const filteredData = Object.entries(item).filter(
    ([key, value]) => !excludeKeys.includes(key) && value !== null,
  );

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
      <AuthHeaders
        route="History"
        params={{
          activeTab:
            activeTab === 'Join a Ride Request'
              ? 'joinRide'
              : activeTab === 'Offer a Ride Request'
              ? 'offerRide'
              : activeTab === 'Send a Parcel Request'
              ? 'sendParcel'
              : activeTab === 'Deliver a Parcel Request'
              ? 'deliveryParcel'
              : '', // Default value if none of the conditions match
        }}
      />
      <ScrollView style={styles.container}>
        <BoldText style={styles.header}>{activeTab}</BoldText>
        <RegularText style={styles.description}>
          This is the detailed view of your selected item.
        </RegularText>

        <View style={styles.content}>
          {filteredData.map(([key, value]) => (
            <View key={key} style={styles.item}>
              <RegularText style={styles.key}>
                {key.replace(/_/g, ' ')}:
              </RegularText>
              <RegularText style={styles.value}>
                {key.toLowerCase().includes('date')
                  ? formatDate(value)
                  : String(value)}
              </RegularText>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 20,
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 24,
  },
  content: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  key: {
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
});
