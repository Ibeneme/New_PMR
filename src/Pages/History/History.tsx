import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AuthHeaders from '../../Components/Headers/AuthHeaders';
import {Colors} from '../../Components/Colors/Colors';
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts';
import {fetchParcelsByUser} from '../../Redux/SendParcel/SendParcelSlice';
import {fetchDeliveryParcelsByUser} from '../../Redux/DeliverParcel/DeliverParcelSlice';
import {fetchPassengerRequestsByUser} from '../../Redux/JoinRide/JoinRideSlice';
import {fetchOfferRidesByUserId} from '../../Redux/OfferRide/OfferRideSlice';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../Redux/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {formatDate} from '../Profile/EarningsPage';
import {useNavigation, useRoute} from '@react-navigation/native';

interface HistoryItem {
  id: number;
  description: string;
  date: string;
}

const HistoryPage: React.FC = () => {
  const route = useRoute();

  // Destructure activeTab from route params
  const {activeTab: routeActiveTab} = route.params || {}; // Ensure you handle the case where route.params may be undefined

  const [activeTab, setActiveTab] = useState<string>(
    routeActiveTab || 'sendParcel', // Use routeActiveTab if it exists, otherwise default to 'sendParcel'
  );

  useEffect(() => {
    // No need to set state here since it's already set during initial render.
  }, [route.params]);

  const [sendParcelData, setSendParcelData] = useState<HistoryItem[]>([]);
  const [deliveryParcelData, setDeliveryParcelData] = useState<HistoryItem[]>(
    [],
  );
  const [joinRideData, setJoinRideData] = useState<HistoryItem[]>([]);
  const [offerRideData, setOfferRideData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = await AsyncStorage.getItem('temp_id'); // Retrieve the userId from AsyncStorage

      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      // Create a mapping of activeTab to corresponding fetch function and state setter
      const fetchMap: Record<string, any> = {
        sendParcel: {
          fetchAction: fetchParcelsByUser,
          setter: setSendParcelData,
          errorMessage: 'Failed to fetch Send Parcel data',
        },
        deliveryParcel: {
          fetchAction: fetchDeliveryParcelsByUser,
          setter: setDeliveryParcelData,
          errorMessage: 'Failed to fetch Delivery Parcel data',
        },
        joinRide: {
          fetchAction: fetchPassengerRequestsByUser,
          setter: setJoinRideData,
          errorMessage: 'Failed to fetch Join Ride data',
        },
        offerRide: {
          fetchAction: fetchOfferRidesByUserId,
          setter: setOfferRideData,
          errorMessage: 'Failed to fetch Offer Ride data',
        },
      };

      const currentTab = fetchMap[activeTab];

      if (currentTab) {
        try {
          const response = await dispatch(currentTab.fetchAction(userId));
          currentTab.setter(response.payload || response.payload?.data);
          console.log(response.payload, 'response.payloads');
        } catch (err) {
          setError(currentTab.errorMessage);
          console.error('Error:', err);
        }
      }
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHistoryData = () => {
    let dataToRender: HistoryItem[] = [];

    if (activeTab === 'sendParcel') dataToRender = sendParcelData?.data;
    else if (activeTab === 'deliveryParcel') dataToRender = deliveryParcelData;
    else if (activeTab === 'joinRide') dataToRender = joinRideData;
    else if (activeTab === 'offerRide') dataToRender = offerRideData;

    // Ensure dataToRender is an array before calling .map
    if (Array.isArray(dataToRender)) {
      return dataToRender.map(item => {
        if (activeTab === 'joinRide') {
          return (
            <TouchableOpacity
              key={item?._id}
              style={styles.historyItem}
              onPress={() =>
                navigation.navigate('DetailsScreen', {
                  item,
                  activeTab: 'Join a Ride Request',
                })
              }>
              <BoldText>Destination: {item?.destination}</BoldText>
              <RegularText fontSize={14}>
                Current City: {item?.current_city}
              </RegularText>

              <RegularText fontSize={14}>
                Travelling Date: {formatDate(item?.travelling_date)}
              </RegularText>
            </TouchableOpacity>
          );
        } else if (activeTab === 'offerRide') {
          return (
            <TouchableOpacity
              key={item?._id}
              style={styles.historyItem}
              onPress={() =>
                navigation.navigate('DetailsScreen', {
                  item,
                  activeTab: 'Offer a Ride Request',
                })
              }>
              <BoldText>Destination: {item?.destination}</BoldText>
              <RegularText fontSize={14}>
                Drop - Off: {item?.drop_off}
              </RegularText>
              <RegularText fontSize={14}>
                Current City: {item?.current_city}
              </RegularText>
              <RegularText fontSize={14}>
                Preferred Take Off: {item?.preferred_take_off}
              </RegularText>
              {/* <RegularText style={styles.date}>
                Take Off Time: {formatDate(item?.time_of_take_off)}
              </RegularText> */}
              <RegularText style={styles.date}>
                Travelling Date: {formatDate(item?.travelling_date)}
              </RegularText>
            </TouchableOpacity>
          );
        } else if (activeTab === 'sendParcel') {
          return (
            <TouchableOpacity
              key={item?._id}
              style={styles.historyItem}
              onPress={() =>
                navigation.navigate('DetailsScreen', {
                  item,
                  activeTab: 'Send a Parcel Request',
                })
              }>
              <BoldText>Sender City {item?.sender_city}</BoldText>
              <RegularText fontSize={14}>State: {item?.state}</RegularText>
              <RegularText fontSize={14}>
                Receiver City: {item?.receiver_city}
              </RegularText>
              <RegularText fontSize={14}>
                Receiver: {item?.receiver_name} | {item?.receiver_email} |{' '}
                {item?.receiver_gender}
              </RegularText>
              <RegularText fontSize={14}>
                Travelling Date: {formatDate(item?.delivery_date)}
              </RegularText>
            </TouchableOpacity>
          );
        } else if (activeTab === 'deliveryParcel') {
          return (
            <TouchableOpacity
              key={item?._id}
              style={styles.historyItem}
              onPress={() =>
                navigation.navigate('DetailsScreen', {
                  item,
                  activeTab: 'Deliver a Parcel Request',
                })
              }>
              <BoldText fontSize={14}>State: {item?.state}</BoldText>
              <RegularText fontSize={14}>
                Travelling Date: {formatDate(item?.travel_date)}
              </RegularText>
              <RegularText fontSize={14}>
                Arrival Date: {formatDate(item?.arrival_date)}
              </RegularText>
              <RegularText fontSize={14}>
                Bus Stop: {item?.bus_stop}
              </RegularText>
              <RegularText fontSize={14}>
                Can Carry Light: {item?.can_carry_light ? 'Yes' : 'No'}
              </RegularText>
              <RegularText fontSize={14}>
                Can Carry Heavy: {item?.can_carry_heavy ? 'Yes' : 'No'}
              </RegularText>
              <RegularText fontSize={14}>City: {item?.city}</RegularText>
              <RegularText fontSize={14}>
                Min Price: ₦{item?.min_price}
              </RegularText>
              <RegularText fontSize={14}>
                Max Price: ₦{item?.max_price}
              </RegularText>
            </TouchableOpacity>
          );
        }
        return null;
      });
    } else {
      return null; // Optionally handle the case when data is not an array
    }
  };
  return (
    <View style={styles.container}>
      <AuthHeaders />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Toggles */}
        <ScrollView contentContainerStyle={styles.toggleContainer} horizontal>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === 'sendParcel' && styles.activeButton,
            ]}
            onPress={() => setActiveTab('sendParcel')}>
            <RegularText
              style={[
                styles.toggleText,
                activeTab === 'sendParcel' && styles.activeButtonText,
              ]}>
              Send Parcel
            </RegularText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === 'deliveryParcel' && styles.activeButton,
            ]}
            onPress={() => setActiveTab('deliveryParcel')}>
            <RegularText
              style={[
                styles.toggleText,
                activeTab === 'deliveryParcel' && styles.activeButtonText,
              ]}>
              Delivery Parcel
            </RegularText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === 'joinRide' && styles.activeButton,
            ]}
            onPress={() => setActiveTab('joinRide')}>
            <RegularText
              style={[
                styles.toggleText,
                activeTab === 'joinRide' && styles.activeButtonText,
              ]}>
              Join a Ride
            </RegularText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === 'offerRide' && styles.activeButton,
            ]}
            onPress={() => setActiveTab('offerRide')}>
            <RegularText
              style={[
                styles.toggleText,
                activeTab === 'offerRide' && styles.activeButtonText,
              ]}>
              Offer a Ride
            </RegularText>
          </TouchableOpacity>
        </ScrollView>

        {/* Loading Indicator */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <RegularText style={styles.errorText}>{error}</RegularText>
        ) : (
          renderHistoryData()
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollContainer: {
    paddingBottom: 20,
    padding: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 12,
  },
  toggleButton: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: Colors.primaryColor,
  },
  toggleText: {
    fontSize: 14,
    color: '#333',
  },
  activeButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  historyItem: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 12,
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HistoryPage;
