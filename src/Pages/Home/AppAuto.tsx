import React from "react";
import { View, Text } from "react-native";
import AutoCompletePlaces from "./AutoCompletePlaces";

const App = () => {
  const handlePlaceSelect = (place: any) => {
    console.log("Selected Place:", place);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>Select a Location:</Text>
      <AutoCompletePlaces onSelectPlace={handlePlaceSelect} />
    </View>
  );
};

export default App;