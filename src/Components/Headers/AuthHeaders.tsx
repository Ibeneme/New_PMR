import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Pressable,
  View,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import {Colors} from '../Colors/Colors';
import ArrowLeftIcon from '../Icons/Arrows/ArrowLeftIcon';
import {useNavigation} from '@react-navigation/native';

interface AuthHeadersProps {
  navigation?: {goBack: () => void};
  title?: string;
  modal?: boolean;
  onClick?: () => void;
  route?: string; // Optional route prop
  params?: any; // Optional params prop to pass to the navigation
}

const AuthHeaders: React.FC<AuthHeadersProps> = ({
  modal,
  navigation,
  title = 'Create an Account',
  onClick,
  route, // Destructure route
  params, // Destructure params
}) => {
  const [isInfoVisible, setInfoVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const navigationFunction = useNavigation();

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: isInfoVisible ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isInfoVisible]);

  const handleGoBack = () => {
    if (route) {
      // Navigate to the provided route with optional params
      navigationFunction.navigate(route, params);
    } else if (navigation?.goBack) {
      navigation.goBack();
    } else if (modal) {
      onClick?.();
    } else {
      navigationFunction.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {!modal ? (
          <Pressable onPress={handleGoBack}>
            <ArrowLeftIcon width={30} height={30} color={Colors.grayColor} />
          </Pressable>
        ) : (
          <Pressable onPress={() => onClick?.()}>
            <ArrowLeftIcon width={30} height={30} color={Colors.grayColor} />
          </Pressable>
        )}
        {/* Other content like title and info button can be added here */}
      </View>
    </SafeAreaView>
  );
};

export default AuthHeaders;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'android' ? 6 : 12,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
});
