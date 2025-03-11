import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts'; // Assuming these components are defined
import { Colors } from '../../Components/Colors/Colors';
import AuthHeaders from '../../Components/Headers/AuthHeaders';

const WithdrawalsPage = () => {
  const route = useRoute();
  const { withdrawals } = route.params;

  const totalWithdrawals = withdrawals?.reduce(
    (acc, item) => acc + (item.amount || 0),
    0,
  ); // Sum of all withdrawals

  // Function to format the date with suffix (st, nd, rd, th)
  const formatDate = (dateString) => {
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

  const renderItem = ({ item }) => (
    <View style={styles.withdrawalItem}>
      <BoldText color="#ff0000" style={[styles.text]}>
        ₦{item.amount || 0}
      </BoldText>
      <RegularText style={styles.text}>{formatDate(item.date)}</RegularText>
      <RegularText style={styles.text}>Status: {item.status}</RegularText>
      <RegularText style={styles.text}>Bank: {item.bank}</RegularText>
      <RegularText style={styles.text}>Account Number: {item.accountNumber}</RegularText>
      {item.accountName && (
        <RegularText style={styles.text}>Account Name: {item.accountName}</RegularText>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <AuthHeaders />
      <View style={{ padding: 16, marginBottom: 120 }}>
        <BoldText style={styles.header}>Withdrawals</BoldText>
        <RegularText style={styles.total}>
          Total Withdrawals: ₦{totalWithdrawals || 0}
        </RegularText>

        {/* Conditionally render "No items available" if withdrawals array is empty */}
        {withdrawals?.length === 0 ? (
          <RegularText style={styles.noItemsText}>No items available</RegularText>
        ) : (
          <FlatList
            data={withdrawals}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
      <View style={{ height: 48 }}></View>
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
  withdrawalItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
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

export default WithdrawalsPage;