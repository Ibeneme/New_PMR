import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {getUser} from '../../Redux/Auth/Auth'; // Make sure the import path is correct
import {AppDispatch} from '../../Redux/Store';
import Clipboard from '@react-native-clipboard/clipboard'; // Import Clipboard module
import CopyToClipBoard from '../../Components/Icons/CopyToClipBoard/CopyToClipBoard';
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts';
import AuthHeaders from '../../Components/Headers/AuthHeaders';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Colors} from '../../Components/Colors/Colors';
import ModalComponent from '../../Components/Modal/ModalComponent';
import {useTokens} from '../../Context/TokenProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // New state for refresh control
  const navigation = useNavigation();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const {clearTokens, tokens} = useTokens(); // Destructure tokens for logging

  const confirmLogout = () => {
    AsyncStorage.removeItem('accessToken') // Remove accessToken from AsyncStorage
      .then(() => {
        return AsyncStorage.removeItem('refreshToken'); // Chain to remove refreshToken
      })
      .then(() => {
        return AsyncStorage.removeItem('userData'); // Remove user data from AsyncStorage
      })
      .then(() => {
        clearTokens();
        console.log('Tokens cleared from storage and context.');
      })
      .catch(error => {
        console.error('Error during logout:', error);
      })
      .finally(() => {
        setIsLogoutModalVisible(false);
      });
  };

  const confirmDeleteAccount = () => {
    console.log('Account deleted'); // Add account deletion logic here
    setIsDeleteModalVisible(false);
  };

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

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const handleCopyReferralCode = () => {
    Clipboard.setString(user?.referral_code); // Copy the referral code to clipboard
    Alert.alert('Success', 'Referral Code copied to clipboard!'); // Show success alert
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <AuthHeaders />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {error ? (
          <RegularText style={styles.errorText}>{error}</RegularText>
        ) : user ? (
          <View
            style={{
              padding: 12,
              backgroundColor: '#Fff',
              borderRadius: 24,
              marginBottom: 12,
            }}>
            <BoldText style={styles.title}>User Profile</BoldText>
            <Image
              source={{uri: user?.profile_img_url}}
              style={styles.profileImage}
            />
            <RegularText style={styles.text}>
              Name: {user?.first_name} {user?.last_name}
            </RegularText>
            <RegularText style={styles.text}>Email: {user?.email}</RegularText>
            <RegularText style={styles.text}>
              Phone: {user?.phone_number}
            </RegularText>
            <RegularText style={styles.text}>
              Balance: ₦{user?.totalBalance}
            </RegularText>
            <RegularText style={styles.text}>
              Total Earnings: ₦{user?.totalEarnings}
            </RegularText>
            <TouchableOpacity
              onPress={handleCopyReferralCode}
              style={{flexDirection: 'row', gap: 4}}>
              <RegularText style={styles.text}>
                Referral Code: {user?.referral_code}
              </RegularText>
              <CopyToClipBoard width={16} />
            </TouchableOpacity>
            {/* Add more user details if available */}
          </View>
        ) : (
          <RegularText style={styles.text}>No user data available.</RegularText>
        )}
        <View>
          <TouchableOpacity
            style={[styles.button]} //Ibeneme_
            onPress={() => navigation.navigate('EditProfileScreen', {user})}>
            <RegularText fontSize={16}>Edit Profile</RegularText>
            {/* <ArrowRightIcon color={Colors?.grayColor} /> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button]}
            onPress={() =>
              navigation.navigate('Earnings', {
                earnings: user?.earnings,
                totalEarnings: user?.totalEarnings,
              })
            }>
            <RegularText fontSize={16}>Earnings</RegularText>
          </TouchableOpacity>

          {/* Withdrawals Button */}
          <TouchableOpacity
            style={[styles.button]}
            onPress={() =>
              navigation.navigate('Withdrawals', {
                withdrawals: user?.withdrawals,
                totalWithdrawals: user?.totalWithdrawals,
              })
            }>
            <RegularText fontSize={16}>Withdrawals</RegularText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => setIsLogoutModalVisible(true)}>
            <RegularText fontSize={16}>Logout</RegularText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => setIsDeleteModalVisible(true)}>
            <RegularText fontSize={16} color={Colors?.errorColor}>
              Delete Account
            </RegularText>
          </TouchableOpacity>
        </View>

        <ModalComponent
          visible={isLogoutModalVisible}
          onClose={() => setIsLogoutModalVisible(false)}
          onConfirm={confirmLogout}
          title="Confirm you want to Logout"
          message="Are you sure you want to log out?"
          cancelText="No, Cancel"
          confirmText="Log Out"
        />

        {/* Delete Account Modal */}

        <ModalComponent
          visible={isDeleteModalVisible}
          onClose={() => setIsDeleteModalVisible(false)}
          onConfirm={confirmLogout}
          title="Confirm you want to Delete your Account"
          message="Are you sure you want to Delete your Account?"
          cancelText="No, Cancel"
          confirmText="Delete"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    backgroundColor: Colors.whiteColor,
    borderRadius: 24,
  },
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Profile;
