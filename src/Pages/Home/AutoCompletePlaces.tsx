import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity, SafeAreaView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  SemiBoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts';
import CustomTextInput from '../../Components/TextInputs/CustomTextInputs';
import AuthHeaders from '../../Components/Headers/AuthHeaders';

const FOURSQUARE_API_KEY = 'fsq3cJJsPkGHRGA+KdN9aoz01z5RnRu0CuF3GcfmY+LLNhc='; // Replace with your API Key

const AutoCompletePlaces = () => {
  const route = useRoute();
  const {passed} = route.params;
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const fetchPlaces = async text => {
    setQuery(text);
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.foursquare.com/v3/places/search?query=${text}&near=Nigeria&limit=5`,
        {
          headers: {
            Authorization: FOURSQUARE_API_KEY,
            Accept: 'application/json',
          },
        },
      );
      const data = await response.json();

      if (data.results) {
        setSuggestions(data.results);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const handleSelectLocation = item => {
    const locationData = {
      name: item.name,
      lat: item?.geocodes?.main?.latitude,
      lon: item?.geocodes?.main?.longitude,
      address: item?.location?.formatted_address || item?.location?.country,
    };

    setSelectedLocation(locationData);
    setQuery(item.name);
    setSuggestions([]);

    // Navigate to the next screen with the selected location
    navigation.navigate(passed, {location: locationData});
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <AuthHeaders />
      <View style={{paddingHorizontal: 16}}>
        <CustomTextInput
          label="What's your current location"
          placeholder="Search for current location..."
          value={query}
          onChangeText={fetchPlaces}
        />
        <FlatList
          data={suggestions}
          keyExtractor={item => item.fsq_id}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => handleSelectLocation(item)}
              style={{
                padding: 10,
                backgroundColor: '#fff',
              }}>
              <SemiBoldText fontSize={14}>{item.name}</SemiBoldText>
              <RegularText fontSize={14}>
                {item?.location?.formatted_address || item?.location?.country}
              </RegularText>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default AutoCompletePlaces;
