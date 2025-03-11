import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AuthHeaders from '../../Components/Headers/AuthHeaders';
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts';
import {findNearestDriver} from '../../Redux/SendParcel/SendParcelSlice';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../Redux/Store';
import {useMemo} from 'react';
import CustomButton from '../../Components/Buttons/CustomButton';
import {Colors} from '../../Components/Colors/Colors';
import UpdatePriceModal from './UpdatePriceModal';
import {BaseUrl} from '../../Redux/baseurl';
import WebView from 'react-native-webview';
import axios from 'axios';
import {getUser} from '../../Redux/Auth/Auth';
import {updateRideStatus} from '../../Redux/PairedDrivers/pairedDriverSlice';
import ModalComponent from '../../Components/Modal/ModalComponent';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [pairedDriver, setPairedDriver] = useState({});
  const [closestRider, setClosestRider] = useState({});
  const [opacity, setOpacity] = useState(1); // Track screen opacity
  const [noRider, setNoRider] = useState(true);
  const [price, setPrice] = useState(1000); // Default price
  const [modalVisible, setModalVisible] = useState(false);
  const [payDetails, setPayDetails] = useState(null); // For payment details

  const formattedTab = useMemo(() => {
    switch (activeTab) {
      case 'Join a Ride Request':
        return 'joinRide';
      case 'Offer a Ride Request':
        return 'offerRide';
      case 'Send a Parcel Request':
        return 'sendParcel';
      case 'Deliver a Parcel Request':
        return 'deliverParcel';
      default:
        return '';
    }
  }, [activeTab]);
  const sender =
    formattedTab === 'offerRide' || formattedTab === 'deliverParcel'
      ? 'driver'
      : formattedTab === 'joinRide' || formattedTab === 'sendParcel'
      ? 'customer'
      : '';

  const fetchNearestRider = useCallback(
    async (newDriver = false) => {
      setModalVisibles(false);
      setLoading(true);
      setError(null);
      setOpacity(0.5); // Set opacity to 50% when loading
      setClosestRider([]);
      setNoRider(false);
      try {
        const response = await dispatch(
          findNearestDriver({
            id: item._id,
            activeTab: formattedTab,
            new: newDriver,
            // isDriver: false,
          }),
        );
        console.log('Find Nearest Rider Response:', response);

        if (response.payload?.success === true) {
          setNoRider(false);
          setPairedDriver(response.payload?.pairedDriver);
          setClosestRider(response.payload?.closestDriver);
          setPayDetails(response.payload?.pairedDriver?.payments);
        } else if (response.payload === 'Request failed with status code 404') {
          setNoRider(true);
        }
      } catch (err) {
        setError(err?.message || 'Something went wrong');
        console.log('Find Nearest Rider Error:', err);
      } finally {
        setLoading(false);
        setOpacity(1); // Reset opacity when loading is done
      }
    },
    [dispatch, item._id, formattedTab],
  );

  useEffect(() => {
    fetchNearestRider();
    fetchUserData();
  }, [fetchNearestRider]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNearestRider().finally(() => setRefreshing(false));
  };
  const formatDate = date => {
    if (!date) return '';
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(date).toLocaleDateString('en-GB', options);
  };

  const formatLabel = label => {
    return label
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters in camelCase
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
  };

  // Function to handle the dispatch
  const handleUpdateStatus = (id: string, status: string) => {
    dispatch(updateRideStatus({id, status}))
      .then(responseAction => {
        if (responseAction.payload.success) {
          onRefresh();
          setIsLogoutModalVisible(false);
          setIsDeleteModalVisible(false);
          console.log(
            'Ride Status Updated Successfully:',
            responseAction.payload,
          );
        } else {
          console.log('Failed to Update Ride Status:', responseAction.payload);
        }
      })
      .catch(error => {
        // Handle any errors during the dispatch
        console.error('Error in updating ride status:', error);
      });
  };

  const [ref, setRef] = useState(null); //
  const [checkoutUrl, setCheckoutUrl] = useState(null); // Store the URL for WebView
  const [modalVisibles, setModalVisibles] = useState(false); // Control modal visibility
  const [user, setUser] = useState(null);
  const [isReFetch, setReFetch] = useState(false);
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

  const handlePaystackPayment = async () => {
    //console.log(rideDetailsData?.ride?._id, 'referencereference');
    try {
      const response = await axios.post(
        `${BaseUrl}/api/auth/create-paystack-payment`,
        {
          email: user?.email, // Replace with actual customer email
          amount: pairedDriver?.price * 100, // Amount in Naira
          callback_url: `${BaseUrl}/api/auth/verify-payment/${pairedDriver?._id}`, // Replace with your callback URL
          orderID: pairedDriver?._id,
        },
      );
      console.log(response, 'responsepaidtrnansns');

      if (response?.status === 200) {
        const {checkout_url, reference} = response.data;
        setCheckoutUrl(checkout_url);
        setRef(reference); // Set the checkout URL
        setModalVisibles(true); // Show the modal with WebView
      }
    } catch (error) {
      console.log(
        'Error creating Paystack payment:',
        error.response?.data || error.message,
      );
    }
  };

  const handleWebViewNavigation = async navState => {
    const verificationUrl = `${BaseUrl}/api/auth/verify-payment/${pairedDriver?._id}?trxref=${ref}&reference=${ref}`;

    if (navState.url.includes(verificationUrl)) {
      //   setReFetch(false);
      //   setModalVisibles(false);
      setReFetch(false);
      setModalVisibles(false);
      try {
        const response = await fetch(verificationUrl);
        const data = await response.json();
        console.log(data, 'Payment successful!');

        if (data.success) {
          onRefresh();
          setPayDetails(data?.pay);
          setModalVisibles(false);
          fetchNearestRider();
          setModalVisibles(false);
          console.log('Payment successful!');
        } else {
          console.log('Payment verification failed:', data.message);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      }
    }
  };

  const driverInfo = Object.keys(closestRider) // Iterate over keys of the closestRider object
    .filter(
      key =>
        ![
          '_id',
          '__v',
          'createdAt',
          'updatedAt',
          'userId',
          'users_phone_number',
          'reportRide',
          'location_lat',
          'location_lng',
          'location_name',
          'user_first_name',
          'user_last_name',
          'cancelRide',
          'confirmRide',
          'endRide',
          'rateRide',
          'refundRide',
          'reportRideReason',
          'startRide',
        ].includes(key), // Exclude unwanted fields
    )
    .map(key => {
      let value = closestRider[key];

      // Format booleans to "Yes"/"No"
      if (typeof value === 'boolean') {
        value = value ? 'Yes' : 'No';
      }

      // Format dates
      if (key.includes('date') && value) {
        value = formatDate(value);
      }

      // Return label and value only if the value is not null or undefined
      if (value != null) {
        return {
          label: formatLabel(key),
          value: value,
        };
      }
      return null;
    })
    .filter(item => item !== null); // Remove null items from the array

  // Merging user_first_name and user_last_name into Driver Name
  const driverName = {
    label: 'Driver Name',
    value: `${closestRider?.user_first_name} ${closestRider?.user_last_name}`,
  };

  // Change location_name to Driver Location and add it first in the array
  const driverLocation = {
    label: 'Driver Location',
    value: closestRider?.location_name || 'Not Available',
  };

  // Add the modified driver info and prepend Driver Name and Driver Location
  const finalDriverInfo = [driverLocation, driverName, ...driverInfo];
  const navigation = useNavigation();
  console.log(user?.email, 'ss');

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  return (
    <View style={{flex: 1, backgroundColor: '#f4f4f4', opacity: opacity}}>
      <AuthHeaders
        route="History"
        params={{
          activeTab: formattedTab,
        }}
      />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {pairedDriver?.startRide && (
          <View
            style={{
              backgroundColor: Colors.errorColor,
              padding: 20,
              borderRadius: 12,
              marginVertical: 16,
              marginBottom: 0,
            }}>
            <BoldText
              style={[styles.header, {fontSize: 18, marginBottom: 8}]}
              color={Colors.whiteColor}>
              {pairedDriver?.endRide
                ? `Ride Ended`
                : pairedDriver?.startRide
                ? `Ride Started`
                : `We'll notify you once the user starts the ride`}
            </BoldText>
          </View>
        )}
        {checkoutUrl && (
          <Modal
            visible={modalVisibles}
            animationType="slide"
            transparent={false}>
            <SafeAreaView style={{flex: 1}}>
              <AuthHeaders
                title="Pay for Ride"
                onClick={() => setModalVisibles(false)}
                modal
              />
              <WebView
                source={{uri: checkoutUrl}}
                onNavigationStateChange={handleWebViewNavigation}
              />
            </SafeAreaView>
          </Modal>
        )}

        <ModalComponent
          visible={isLogoutModalVisible}
          onClose={() => setIsLogoutModalVisible(false)}
          onConfirm={() => handleUpdateStatus(pairedDriver?._id, 'startRide')}
          title="Confirm you want to Start Ride"
          message="Are you sure you want to start ride?"
          cancelText="No, Cancel"
          confirmText="Start"
        />
        <ModalComponent
          visible={isDeleteModalVisible}
          onClose={() => setIsDeleteModalVisible(false)}
          onConfirm={() => handleUpdateStatus(pairedDriver?._id, 'endRide')}
          title="Confirm you want to End Ride"
          message="Are you sure you want to end ride?"
          cancelText="No, Cancel"
          confirmText="End"
        />

        {!(
          activeTab === 'Send a Parcel Request' ||
          activeTab === 'Join a Ride Request' ||
          activeTab === 'send_parcel' ||
          activeTab === 'join_ride'
        ) && pairedDriver.paid === true ? (
          <View
            style={{
              backgroundColor: Colors.whiteColor,
              padding: 20,
              borderRadius: 12,
              marginVertical: 16,
              marginBottom: 48,
            }}>
            <BoldText style={[styles.header, {fontSize: 18, marginBottom: 8}]}>
              {pairedDriver?.paid
                ? `User paid ₦${pairedDriver?.price}`
                : `We'll notify you once the user pays for the ride`}
            </BoldText>
            <RegularText
              style={[styles.description, {fontSize: 14, color: '#666'}]}>
              You'll be able to start the ride once the user pays
            </RegularText>

            {!pairedDriver?.startRide && (
              <CustomButton
                title="Start Ride"
                marginTop={0}
                onPress={() => setIsLogoutModalVisible(true)}
              />
            )}

            {pairedDriver?.startRide && !pairedDriver?.endRide && (
              <CustomButton
                title="End Ride"
                marginTop={0}
                onPress={() => setIsDeleteModalVisible(true)}
              />
            )}
          </View>
        ) : (
          <></>
        )}

        {(activeTab === 'Send a Parcel Request' ||
          activeTab === 'Join a Ride Request' ||
          activeTab === 'send_parcel' ||
          activeTab === 'join_ride') &&
        pairedDriver?.priceSet ? (
          <View
            style={{
              backgroundColor: Colors.whiteColor,
              padding: 20,
              borderRadius: 12,
              marginVertical: 16,
              marginBottom: 48,
            }}>
            <BoldText style={[styles.header, {fontSize: 18, marginBottom: 8}]}>
              Pay ₦{pairedDriver?.price} for this ride
            </BoldText>

            <RegularText
              style={[styles.description, {fontSize: 14, color: '#666'}]}>
              Click on the price to proceed to the payment button and begin the
              payment process.
            </RegularText>

            {!pairedDriver?.paid ? (
              <CustomButton
                title="Proceed to Pay"
                marginTop={0}
                onPress={handlePaystackPayment}
              />
            ) : (
              <CustomButton
                onPress={() => {
                  navigation.navigate('ReceiptScreen', {
                    paid: payDetails,
                    customer: user,
                  });
                }}
                marginTop={12}
                textColor={Colors.grayColor}
                backgroundColors={Colors.grayColorFaded}
                title={`View Receipt`}
              />
            )}
          </View>
        ) : (
          pairedDriver?.setPriceCounts > 0 && <></>
        )}

        {
          // (
          //     activeTab === 'Send a Parcel Request' ||
          //   activeTab === 'Join a Ride Request' ||
          //   activeTab === 'send_parcel' ||
          //   activeTab === 'join_ride') &&

          !noRider && (
            <View>
              <BoldText style={[styles.header]}>Paired With</BoldText>
              <RegularText style={styles.description}>
                Reach out to your driver, negotiate the fare, and finalize the
                details.
              </RegularText>

              <View style={styles.content}>
                {finalDriverInfo.map(({label, value}) => (
                  <View key={label} style={styles.item}>
                    <RegularText style={styles.key}>{label}:</RegularText>
                    <RegularText style={styles.value}>{value}</RegularText>
                  </View>
                ))}
                <CustomButton
                  title="Send a Message"
                  onPress={() =>
                    navigation.navigate('ChatPage', {
                      item,
                      _id: pairedDriver?._id,
                      sender,
                    })
                  }
                />

                <UpdatePriceModal
                  visible={modalVisible}
                  _id={pairedDriver?._id}
                  onClose={() => {
                    fetchNearestRider();
                    setModalVisible(false);
                  }}
                  onUpdate={(newPrice: any) => setPrice(newPrice)}
                />

                {activeTab === 'Send a Parcel Request' ||
                activeTab === 'Join a Ride Request' ||
                activeTab === 'send_parcel' ||
                activeTab === 'join_ride' ? (
                  <CustomButton
                    title="Find Another Driver"
                    backgroundColors={Colors.primaryColorFaded}
                    textColor={Colors.primaryColor}
                    onPress={() => fetchNearestRider(true)} //67d02af3b898be45bc30bb18 Trigger fetch with "new: true"
                    disabled={loading} // Disable the button while loading
                  />
                ) : (
                  !pairedDriver?.priceSet && (
                    <CustomButton
                      title="Set Price"
                      backgroundColors={Colors.primaryColorFaded}
                      textColor={Colors.primaryColor}
                      onPress={() => setModalVisible(true)} // Trigger fetch with "new: true"
                      disabled={loading} // Disable the button while loading
                    />
                  )
                )}
              </View>
            </View>
          )
        }

        <BoldText style={styles.header}>{activeTab}</BoldText>
        <RegularText style={styles.description}>
          This is the detailed view of your selected item.
        </RegularText>

        <View style={styles.content}>
          {Object.entries(item).map(
            ([key, value]) =>
              ![
                '_id',
                '__v',
                'createdAt',
                'updatedAt',
                'userId',
                '_id',
                '__v',
                'createdAt',
                'updatedAt',
                'userId',
                'users_phone_number',
                'reportRide',
                'location_lat',
                'location_lng',
                'location_name',
                'user_first_name',
                'user_last_name',
                'cancelRide',
                'confirmRide',
                'endRide',
                'rateRide',
                'refundRide',
                'reportRideReason',
                'startRide',
              ].includes(key) &&
              value !== null && (
                <View key={key} style={styles.item}>
                  <RegularText style={styles.key}>
                    {key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ')}
                    :
                  </RegularText>
                  <RegularText style={styles.value}>
                    {key.toLowerCase().includes('date')
                      ? formatDate(value)
                      : String(value)}
                  </RegularText>
                </View>
              ),
          )}
        </View>
      </ScrollView>
      {(loading || isReFetch || refreshing) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 20,
    marginBottom: 6,
    textAlign: 'left',
  },
  description: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'left',
    marginBottom: 24,
  },
  content: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 48,
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DetailsScreen;
