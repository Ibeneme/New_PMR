import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {BoldText, RegularText} from '../Components/Texts/CustomTexts/BaseTexts';

interface ToastProps {
  title: string;
  description: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({title, description, onClose}) => {
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onClose());
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.toastContainer, {opacity: fadeAnim}]}>
      <BoldText style={styles.title}>{title}</BoldText>
      <RegularText style={styles.description}>{description}</RegularText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 99999999999999,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#ddd',
  },
});

export default Toast;
