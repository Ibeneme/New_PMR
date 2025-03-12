import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../Redux/Store';
import {
  fetchBanks,
  requestWithdrawal,
  resolveAccount,
} from '../../Redux/WithdrawalSlice.tsx/WithdrawalSlice';
import {useRoute} from '@react-navigation/native';
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts';
import CustomTextInput from '../../Components/TextInputs/CustomTextInputs';
import AuthHeaders from '../../Components/Headers/AuthHeaders';
import CustomButton from '../../Components/Buttons/CustomButton';
import {Colors} from '../../Components/Colors/Colors';

const ChooseBankScreen = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const {totalBalance, userID}: any = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [bankCode, setBankCode] = useState<{name: string; code: string}[]>([]);
  const [selectedBank, setSelectedBank] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [accountError, setAccountError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success modal state
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successModalVisibleLoading, setSuccessModalVisibleLoading] =
    useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchBanks())
      .then(response => {
        if (response.payload?.status === true) {
          const filteredBanks = response.payload?.data.map((bank: any) => ({
            name: bank.name,
            code: bank.code,
          }));
          setBankCode(filteredBanks || []);
        } else {
          setBankCode([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Error fetching banks');
        setLoading(false);
      });
  }, [dispatch]);

  const validateAccountNumber = (value: string) => {
    if (!/^\d{10}$/.test(value)) {
      setAccountError('Account number must be exactly 10 digits.');
    } else {
      setAccountError(null);
    }
    setAccountNumber(value);
  };

  const validateAmount = (value: string) => {
    const numericValue = parseFloat(value);

    if (isNaN(numericValue) || numericValue <= 0) {
      setAmountError('Please enter a valid amount.');
    } else if (numericValue < 500) {
      setAmountError('Amount must be at least ₦500.');
    } else if (numericValue > totalBalance) {
      setAmountError(`Amount cannot exceed Total balance of ₦${totalBalance}`);
    } else {
      setAmountError(null);
    }
    setAmount(value);
  };

  const filteredBanks = bankCode.filter(bank =>
    bank.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleProceed = () => {
    setLoading(true);
    setError('');
    // Log the selected data when proceed button is pressed
    const payload = {
      selectedBank: selectedBank?.name,
      amount,
      account_number: accountNumber,
      bank_code: selectedBank?.code,
    };

    console.log('Proceed Button Pressed:', payload);

    dispatch(
      resolveAccount({
        account_number: accountNumber,
        bank_code: selectedBank?.code,
      }),
    )
      .then(response => {
        console.log('API Response:', response);

        if (response.payload?.status) {
          setAccountData(response.payload?.data);
          setIsModalVisible(true);
        } else {
          // If status is not true, show an error
          setError(
            'Bank details may be incorrect or network issue. Please re-check the details and try again.',
          );
        }
      })
      .catch(error => {
        console.log('API Error:', error);
        setError(error.message || 'An error occurred');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleConfirm = () => {
    setSuccessModalVisibleLoading(true);
    console.log('Proceed with withdrawal...');

    const withdrawalID = `${userID}-${Date.now()}`;

    // Prepare the payload to be dispatched
    const payload = {
      accountNumber,
      accountName: accountData?.account_name,
      bank: selectedBank?.name,
      bankCode: selectedBank?.code,
      requestedAmount: amount,
      userId: userID, // Provide the correct userId
      withdrawalID: withdrawalID, // Provide the correct withdrawal ID
    };

    // Dispatch the requestWithdrawal action and handle the response with .then() and .catch()
    dispatch(requestWithdrawal(payload))
      .then(response => {
        if (response.payload.success === true) {
          setSuccessModalVisible(true); // Show success modal on success
          setIsModalVisible(false);
          setSuccessModalVisibleLoading(false);
        }
        // Handle the success response here
        console.log('Withdrawal successful:', response);
      })
      .catch(error => {
        setSuccessModalVisibleLoading(false);
        // Handle the error here
        console.log('Error during withdrawal request:', error);
        // Optionally, show an error message
      });
  };

  const isProceedDisabled =
    !selectedBank || !accountNumber || !amount || accountError || amountError;

  return (
    <View style={{flex: 1}}>
      <AuthHeaders />
      <View style={{padding: 16, paddingTop: 36}}>
        <BoldText fontSize={20}>Withdrawal Page</BoldText>
        <View style={{gap: 4, marginTop: 36}}>
          <RegularText style={{color: '#666', fontSize: 14}}>
            Choose a Bank{' '}
          </RegularText>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              padding: 15,
              borderRadius: 10,
              borderWidth: 0.6,
              borderColor: '#66666666',
            }}>
            <RegularText style={{color: '#666', fontSize: 16}}>
              {selectedBank ? selectedBank.name : 'Choose Bank'}
            </RegularText>
          </TouchableOpacity>
        </View>
        {isModalVisible && accountData && (
          <Modal transparent={true} visible={isModalVisible}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <View
                style={{
                  width: '90%',
                  padding: 20,
                  backgroundColor: 'white',
                  borderRadius: 10,
                }}>
                <BoldText style={{fontSize: 18}}>Confirm Withdrawal</BoldText>

                <View
                  style={{
                    gap: 0,
                    padding: 12,
                    backgroundColor: '#66666615',
                    borderRadius: 12,
                    marginTop: 24,
                  }}>
                  <RegularText style={{marginVertical: 0}}>
                    {selectedBank?.name}
                  </RegularText>
                  <BoldText style={{marginVertical: 0}} fontSize={32}>
                    {accountData?.account_number}
                  </BoldText>
                  <RegularText style={{marginVertical: 10}}>
                    {accountData?.account_name}
                  </RegularText>
                </View>
                <BoldText
                  style={{marginVertical: 10, alignSelf: 'flex-end'}}
                  fontSize={24}>
                  ₦{amount}
                </BoldText>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                  <CustomButton
                    title="Proceed"
                    onPress={handleConfirm}
                    loading={successModalVisibleLoading}
                  />
                  <CustomButton
                    title="Cancel"
                    onPress={handleCancel}
                    marginTop={12}
                    backgroundColors={Colors.primaryColorFaded}
                    textColor={Colors.primaryColor}
                  />
                </View>
              </View>
            </View>
          </Modal>
        )}
        {/* Account Number Input */}
        <CustomTextInput
          placeholder="Enter Account Number"
          label="Enter Account Number"
          value={accountNumber}
          onChangeText={validateAccountNumber}
          numeric
        />
        {accountError && (
          <RegularText fontSize={14} style={{color: 'red'}}>
            {accountError}
          </RegularText>
        )}

        {/* Amount Input */}
        <CustomTextInput
          placeholder="Enter Amount"
          label="Enter Amount"
          value={amount}
          onChangeText={validateAmount}
          numeric
        />
        {amountError && (
          <RegularText fontSize={14} style={{color: 'red'}}>
            {amountError}
          </RegularText>
        )}

        {error && (
          <RegularText fontSize={14} style={{color: 'red'}}>
            {error}
          </RegularText>
        )}

        <CustomButton
          disabled={isProceedDisabled}
          loading={loading}
          marginTop={48}
          onPress={handleProceed}
          title="Proceed"
        />
      </View>

      <Modal visible={successModalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '90%',
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <BoldText style={{fontSize: 24}}>Withdrawal Successful</BoldText>
            <RegularText
              style={{
                marginVertical: 20,
                textAlign: 'center',
              }}>
              Your withdrawal request has been successfully processed.
            </RegularText>
            <CustomButton
              title="Go Back"
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.goBack();
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '90%',
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              height: '75%',
            }}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{alignSelf: 'flex-end'}}>
              <RegularText style={{color: 'red'}}>Close</RegularText>
            </TouchableOpacity>

            {/* Search Input */}
            <CustomTextInput
              placeholder="Search bank..."
              label="Search bank..."
              value={searchText}
              onChangeText={setSearchText}
            />

            {/* Bank List */}
            {loading ? (
              <ActivityIndicator size="large" color="#515FDF" />
            ) : error ? (
              <RegularText style={{color: 'red'}}>{error}</RegularText>
            ) : (
              <FlatList
                data={filteredBanks}
                keyExtractor={item => item.code}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{
                      paddingVertical: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: '#eee',
                    }}
                    onPress={() => {
                      setSelectedBank(item);
                      setModalVisible(false);
                    }}>
                    <RegularText fontSize={14}>
                      {item.name} ({item.code})
                    </RegularText>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<RegularText>No banks found</RegularText>}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
    </View>
  );
};

export default ChooseBankScreen;
