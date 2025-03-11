import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Pressable,
  View,
  Animated,
  Easing,
  Text,
  Image,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import {Colors} from '../Colors/Colors';
import InfoIcon from '../Icons/Info/InfoIcon';
import ArrowLeftIcon from '../Icons/Arrows/ArrowLeftIcon';
import {BoldText, RegularText} from '../Texts/CustomTexts/BaseTexts';
import {useNavigation} from '@react-navigation/native';
import VerifiedBadge from '../Icons/VerifiedBadge/VerifiedBadge';
import PhoneCallIcon from '../Icons/PhoneCall/PhoneCallIcon';
import MailIcon from '../Icons/MailIcon/MailIcon';

interface MessageHeadersProps {
  navigation?: {goBack: () => void};
  fullName?: string;
  infoText?: string;
  badgeColor?: string;
  onPress?: () => void;
  driver?: boolean;
  callBackgroundIconColor?: string;
  callIconColor?: string;
  imageUrl?: any;
  support?: boolean;
  plateNumber?: string;
  phoneNumber?: any;
}

const MessageHeaders: React.FC<MessageHeadersProps> = ({
  navigation,
  badgeColor,
  support,
  onPress,
  driver,
  callIconColor,
  callBackgroundIconColor,
  imageUrl,
  plateNumber,
  phoneNumber = null,
  fullName = '',
  infoText = 'This is some sample info displayed below the header. Click the icon again to hide.',
}) => {
  const [isInfoVisible, setInfoVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const toggleInfo = () => {
    setInfoVisible(!isInfoVisible);
  };

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: isInfoVisible ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isInfoVisible, scaleAnim]);

  const navigationFunction = useNavigation();

  const handleGoBack = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      navigationFunction.goBack();
    }
  };

  // Function to format names
  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split(/[\s_]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailPress = async () => {
    const email = 'support@hastepickers.com';
    const subject = 'Support Inquiry';
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    const supported = await Linking.canOpenURL(mailto);

    if (supported) {
      await Linking.openURL(mailto);
    } else {
      Alert.alert(
        'Email Client Not Found',
        'It seems there is no email client installed on your device.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeftIcon width={16} height={16} color={Colors.grayColor} />
          </Pressable>

          <Pressable onPress={onPress} style={styles.infoButton}>
            <BoldText fontSize={16} color={Colors.headerColor}>
              {driver ? formatName(fullName) : formatName(fullName)}

              {support && ' Papi'}
            </BoldText>
            {/* <View style={styles.subTextContainer}>
              <RegularText fontSize={14} color={Colors.grayColor}>
                {driver ? plateNumber : 'Support Center'}
              </RegularText>
              {support && <VerifiedBadge width={16} height={16} color={badgeColor} />}
            </View> */}
          </Pressable>
        </View>

        {support && (
          <Pressable
            onPress={handleEmailPress}
            style={styles.iconButton(callBackgroundIconColor)}>
            <MailIcon size={24} color={callIconColor} />
          </Pressable>
        )}

        {driver && phoneNumber !== null && (
          <Pressable
            onPress={() => handleCall(phoneNumber)}
            style={styles.iconButton(callBackgroundIconColor)}>
            <PhoneCallIcon width={24} height={24} fill={callIconColor} />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MessageHeaders;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
  },
  header: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayColorFaded,
    justifyContent: 'space-between',

    paddingBottom: Platform.OS === 'android' ? 16 : 12,

    paddingTop: Platform.OS === 'android' ? 16 : 0,

    // height: 50,
  },
  fullName: {
    flex: 1,
    textAlign: 'center',
  },
  infoButton: {
    alignItems: 'flex-start',
    borderRadius: 12,
    marginLeft: 16,
  },
  infoButtonActive: {
    borderRadius: 14,
    backgroundColor: Colors.primaryColor,
  },
  infoContainer: {
    backgroundColor: Colors.fadedPrimaryColor,
    overflow: 'hidden',
    padding: 16,
  },
});
