import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import {
  BoldText,
  RegularText,
} from '../../../../Components/Texts/CustomTexts/BaseTexts';
import CustomButton from '../../../../Components/Buttons/CustomButton';
import AuthHeaders from '../../../../Components/Headers/AuthHeaders';
import {useDispatch} from 'react-redux';
import {createParcel} from '../../../../Redux/SendParcel/SendParcelSlice';
import {AppDispatch} from '../../../../Redux/Store';
import {getUser} from '../../../../Redux/Auth/Auth';
import Toast from '../../../../Utils/ToastUtils';
import {createDeliveryParcel} from '../../../../Redux/DeliverParcel/DeliverParcelSlice';
import {createPassengerRequest} from '../../../../Redux/JoinRide/JoinRideSlice';
import {createOfferRide} from '../../../../Redux/OfferRide/OfferRideSlice';

const Summary = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {formData} = route.params || {}; // Default to an empty object if formData is undefined
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // New state for refresh control
  const [showToast, setShowToast] = useState(false);

  const fetchUserData = () => {
    setLoading(true);
    dispatch(getUser())
      .then(response => {
        console.log('User data:', response); // Log user data
        setUser(response.payload); // Assuming the response is nested inside 'payload'
        setLoading(false); // Set loading to false once data is fetched
        setRefreshing(false); // Stop refreshing
      })
      .catch(err => {
        console.log('Error:', err); // Log error
        setError(err.message || 'Error fetching user data');
        setLoading(false); // Set loading to false on error
        setRefreshing(false); // Stop refreshing
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, []),
  );

  useEffect(() => {
    fetchUserData();
  }, [dispatch]);

  // Function to format the keys
  const formatKey = key => {
    return key
      ?.replace(/_/g, ' ') // Replace underscores with spaces
      ?.replace(/\b\w/g, char => char?.toUpperCase()) // Capitalize the first letter of each word
      ?.replace(/^\w/, char => char?.toUpperCase()); // Ensure the first letter of the first word is capitalized
  };

  // Function to display Yes/No for boolean values
  const formatValue = value => {
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
    if (!user) {
      console.error('User data is not available');
      return;
    }

    // Append user details to formData
    const updatedFormData = {
      ...formData,
      userId: user?._id,
      user_first_name: user?.first_name,
      user_last_name: user?.last_name,
      users_phone_number: user?.phone_number,
    };

    console.log('Updated Form Data:', updatedFormData);

    if (formData?.option === 'send_parcel') {
      dispatch(createParcel(updatedFormData))
        .then(response => {
          if (response?.payload?.success === true) {
            console.log('Parcel created successfully:', response.payload);
            setShowToast(true);
            navigation.navigate('DetailsScreen', {
              item: response.payload?.data,
              activeTab: 'Send a Parcel Request',
            });
          } else {
            console.error('Parcel creation failed:', response.payload);
          }
        })
        .catch(error => {
          console.error('Error dispatching createParcel:', error);
        });
    } else if (formData?.option === 'deliver_parcel') {
      dispatch(createDeliveryParcel(updatedFormData))
        .then(response => {
          if (response?.payload?.success === true) {
            console.log('Parcel created successfully:', response.payload);
            setShowToast(true);
            navigation.navigate('DetailsScreen', {
              item: response.payload?.data,
              activeTab: 'Deliver a Parcel Request',
            });
          } else {
            console.error('Parcel creation failed:', response.payload);
          }
        })
        .catch(error => {
          console.error('Error dispatching createParcel:', error);
        });
    } else if (formData?.option === 'join_ride') {
      dispatch(createPassengerRequest(updatedFormData))
        .then(response => {
          if (response?.payload?.success === true) {
            console.log('Parcel created successfully:', response.payload);
            setShowToast(true);
            navigation.navigate('DetailsScreen', {
              item: response.payload?.data,
              activeTab: 'Join a Ride Request',
            });
          } else {
            console.error('Parcel creation failed:', response.payload);
          }
        })
        .catch(error => {
          console.error('Error dispatching createParcel:', error);
        });
    } else if (formData?.option === 'offer_ride') {
      dispatch(createOfferRide(updatedFormData))
        .then(response => {
          if (response?.payload?.success === true) {
            console.log('Parcel created successfully:', response.payload);
            setShowToast(true);
            navigation.navigate('DetailsScreen', {
              item: response.payload?.data,
              activeTab: 'Offer a Ride Request',
            });
          } else {
            console.error('Parcel creation failed:', response.payload);
          }
        })
        .catch(error => {
          console.error('Error dispatching createParcel:', error);
        });
    }
  };

  if (!formData) {
    return (
      <View style={styles.container}>
        <Text>No form data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showToast && (
        <Toast
          title="Success!"
          description="Your request is created successfully."
          onClose={() => setShowToast(false)}
        />
      )}
      <AuthHeaders />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <BoldText style={styles.title}>Summary</BoldText>
          <RegularText style={styles.description}>
            Please review the information below before confirming.
          </RegularText>
        </View>

        <View style={styles.summaryContainer}>
          {Object?.keys(formData)?.map(key => {
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
