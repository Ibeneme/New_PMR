import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import MapView, {UrlTile} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../Components/Colors/Colors';
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts';
import image from '../../../assets/images/map.png';

const {width, height} = Dimensions.get('window');

const Home = () => {
  const options = [
    {
      title: 'Send a Parcel',
      description: 'Fast & Secure',
      image: require('../../../assets/images/send.png'),
    },
    {
      title: 'Join a Ride',
      description: 'Safe & Quick',
      image: require('../../../assets/images/ride.png'),
    },
    {
      title: 'Deliver a Parcel',
      description: 'Earn Money',
      image: require('../../../assets/images/deliver.png'),
    },
    {
      title: 'Offer a Ride',
      description: 'Drive & Earn',
      image: require('../../../assets/images/offer.png'),
    },
  ];

  const navigation = useNavigation();

  const handlePress = (title: string) => {
    // Check if the user pressed the "Send a Parcel" option and navigate to StepA
    if (title === 'Send a Parcel') {
      navigation.navigate('StepA' as never); //DeliverParcelStepA  Navigate to StepA screen
    } else if (title === 'Deliver a Parcel') {
      navigation.navigate('DeliverParcelStepA' as never);
    } else if (title === 'Offer a Ride') {
      navigation.navigate('OrderRide' as never);
    } else {
      navigation.navigate('Join' as never);
    }
  };

  return (
    <View style={styles.container}>
      {/* OpenStreetMap View */}
      <View style={styles.mapContainer}>
        <Image source={image} style={{width: width, height: height}} />
      </View>

      {/* Grid Layout */}
      <View style={styles.gridContainer}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionCard}
            onPress={() => handlePress(item.title)}>
            <Image source={item.image} style={styles.optionImage} />
            <BoldText style={styles.optionTitle}>{item.title}</BoldText>
            <RegularText style={styles.optionDescription}>
              {item.description}
            </RegularText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  gridContainer: {
    flex: 1.6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.whiteColor,
  },
  optionCard: {
    width: '49%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#66666645',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
  },
  optionImage: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 18,
  },
  optionDescription: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 12,
  },
});
