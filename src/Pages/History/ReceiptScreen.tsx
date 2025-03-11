import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useRoute} from '@react-navigation/native';
import AuthHeaders from '../../Components/Headers/AuthHeaders';
import {
  BoldText,
  ExtraBoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts';
import {Colors} from '../../Components/Colors/Colors';

interface ReceiptData {}

const ReceiptScreen = () => {
  const route = useRoute();
  //const {receiptsData, rideData} = route.params as {receiptsData: ReceiptData};
  const {paid, customer} = route.params;
  console.log(paid, 'rideDatarideDatarideData');
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    const day = date.getDate();
    const suffix = getDaySuffix(day);
    const formattedDate = `${day}${suffix} ${
      date.toLocaleString('en-GB', options).split(',')[0]
    } ${date.getFullYear()} at ${date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })}`;

    return formattedDate;
  };

  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string
      ? string?.charAt(0)?.toUpperCase() + string?.slice(1)?.toLowerCase()
      : '';
  };

  return (
    <View style={styles.container}>
      <AuthHeaders
        title="Payment Receipts"
      />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.section}>
          <BoldText style={styles.amountText}>
            {paid?.details?.status === 'success' ? (
              <>
                <ExtraBoldText style={styles.currencyText}>₦</ExtraBoldText>
                {paid?.details?.amount
                  ?.toLocaleString('en-NG', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                  .split('.')
                  .map((part, index) => (
                    <React.Fragment key={index}>
                      {index === 0 ? (
                        part
                      ) : (
                        <>
                          <ExtraBoldText style={styles.currencyText}>
                            .
                          </ExtraBoldText>
                          {part}
                        </>
                      )}
                    </React.Fragment>
                  ))}
              </>
            ) : (
              <>
                <ExtraBoldText style={styles.currencyText}>₦</ExtraBoldText>
                {paid?.details?.amount?.totalPrice
                  ?.toLocaleString('en-NG', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                  .split('.')
                  .map((part, index) => (
                    <React.Fragment key={index}>
                      {index === 0 ? (
                        part
                      ) : (
                        <>
                          <ExtraBoldText style={styles.currencyText}>
                            .
                          </ExtraBoldText>
                          {part}
                        </>
                      )}
                    </React.Fragment>
                  ))}
              </>
            )}
          </BoldText>
          <View style={styles.paymentStatus}>
            <BoldText style={styles.paymentStatusText}>
              Payment {capitalizeFirstLetter(paid?.details?.status)}
            </BoldText>
          </View>

          {paid?.details?.status === 'success' && (
            <View>
              <RegularText style={styles.subSectionTitle}>
                Payment Details
              </RegularText>
              <RegularText style={styles.text}>
                Paid at: {formatDate(paid?.details?.paid_at)}
              </RegularText>
              <RegularText style={styles.text}>
                Reference: {paid?.details?.reference}
              </RegularText>
              <RegularText style={styles.text}>
                Currency: {paid?.details?.currency}
              </RegularText>

              <RegularText style={styles.subSectionTitle}>
                Payment From
              </RegularText>
              <RegularText style={styles.text}>
                Name:{' '}
                {`${capitalizeFirstLetter(
                  customer?.first_name,
                )} ${capitalizeFirstLetter(customer?.last_name)}`}
              </RegularText>
              <RegularText style={styles.text}>
                Email: {paid?.details?.customer?.email}
              </RegularText>
              <RegularText style={styles.text}>
                Phone: {customer.phone_number}
              </RegularText>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollView: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    // elevation: 3,
    padding: 15,
    marginBottom: 12,
  },
  amountText: {
    fontSize: 32,
    color: Colors.primaryColor,
    paddingVertical: 16,
  },
  currencyText: {
    fontSize: 24,
    color: Colors.primaryColor,
    paddingVertical: 16,
  },
  paymentStatus: {
    backgroundColor: Colors.primaryColorFaded,
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  paymentStatusText: {
    fontSize: 16,
    color: Colors.primaryColor,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    color: Colors.headerColor,
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
});

export default ReceiptScreen;
