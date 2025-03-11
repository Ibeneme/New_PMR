import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts'; // Assuming these components are defined
import { Colors } from '../../Components/Colors/Colors';
import AuthHeaders from '../../Components/Headers/AuthHeaders';

export const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  // Determine suffix
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) {
    suffix = 'st';
  } else if (day === 2 || day === 22) {
    suffix = 'nd';
  } else if (day === 3 || day === 23) {
    suffix = 'rd';
  }

  return `${day}${suffix} ${month} ${year}`;
};

const EarningsPage = () => {
  const route = useRoute();
  const { earnings } = route.params; // Access earnings from route.params

  const totalEarnings = earnings?.reduce(
    (acc, item) => acc + (item.amount || 0),
    0,
  ); // Sum of all earnings

  // Function to format the date with suffix (st, nd, rd, th)
  const renderItem = ({ item }) => (
    <View style={styles.earningsItem}>
      <BoldText style={styles.text} color={Colors.primaryColor}>
        ₦{item.amount || 0}+
      </BoldText>
      <RegularText style={styles.text}>{formatDate(item.date)}</RegularText>
    </View>
  );

  return (
    <View style={styles.container}>
      <AuthHeaders />
      <View style={{ padding: 16 }}>
        <BoldText style={styles.header}>Earnings</BoldText>
        <RegularText style={styles.total}>
          Total Earnings: ₦{totalEarnings}
        </RegularText>

        {/* Conditionally render "No items" if the earnings list is empty */}
        {earnings?.length === 0 ? (
          <RegularText style={styles.noItemsText}>No items available</RegularText>
        ) : (
          <FlatList
          data={[...earnings]?.reverse()} // Make a copy of the earnings array and reverse it
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        )}
      </View>
      <View style={{ marginTop: 48 }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 4,
  },
  total: {
    fontSize: 16,
    marginBottom: 16,
  },
  earningsItem: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 5,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
  },
  text: {
    fontSize: 14,
  },
  noItemsText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
});

export default EarningsPage;