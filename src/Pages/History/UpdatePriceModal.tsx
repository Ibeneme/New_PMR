import React, {useState} from 'react';
import {View, Text, Modal, Alert, StyleSheet} from 'react-native';
import CustomTextInput from '../../Components/TextInputs/CustomTextInputs';
import CustomButton from '../../Components/Buttons/CustomButton';
import {Colors} from '../../Components/Colors/Colors';
import {
  BoldText,
  RegularText,
} from '../../Components/Texts/CustomTexts/BaseTexts';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../Redux/Store';
import {setPriceForRequest} from '../../Redux/PairedDrivers/pairedDriverSlice';

const UpdatePriceModal = ({visible, onClose, _id, onUpdate}: any) => {
  const [price, setPrice] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  console.log(_id);

  const handleUpdate = () => {
    if (!price.trim()) {
      Alert.alert('Error', 'Please enter a valid price.');
      return;
    }

    const newPrice = parseFloat(price);
    if (isNaN(newPrice) || newPrice <= 0) {
      Alert.alert('Error', 'Price must be a positive number.');
      return;
    }

    const payload = {_id, price: newPrice};

    // Dispatch the Redux action
    dispatch(setPriceForRequest({id: _id, price: newPrice}))
      .then(response => {
        // Success callback
        console.log(response, 'Price updated successfully!');
        if (response?.payload.success === true) {
          Alert.alert('Success', `Price updated successfully! NGN${price}`);
          onClose();
        }
        // Alert.alert('Success', 'Price updated successfully!');
        // onClose();
      })
      .catch(error => {
        // Error callback
        console.log('Error:', error);
        Alert.alert('Error', 'Failed to update price.');
      });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <BoldText style={styles.header}>Update Price</BoldText>
          <RegularText style={styles.description}>
            Enter the new price for the item.
          </RegularText>
          <CustomTextInput
            label="Enter price"
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
            numeric
          />
          <CustomButton title="Update Price" onPress={handleUpdate} />
          <CustomButton
            title="Cancel"
            onPress={onClose}
            backgroundColors={Colors.primaryColorChatFaded}
            textColor={Colors.primaryColor}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: 'gray',
  },
});

export default UpdatePriceModal;
