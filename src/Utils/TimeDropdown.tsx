import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { BoldText, RegularText } from '../Components/Texts/CustomTexts/BaseTexts';

// Hour Dropdown Component
export const HourDropdown = ({ selectedHour, onHourChange }: any) => {
  const hours = [];
  for (let hour = 1; hour <= 12; hour++) {
    hours.push({ label: hour.toString().padStart(2, '0'), value: hour.toString() });
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <BoldText>Hour</BoldText>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(!isOpen)}>
        <RegularText fontSize={14}>{selectedHour || 'Choose'}</RegularText>
      </TouchableOpacity>
      {isOpen && (
        <Modal transparent={true} animationType="fade" visible={isOpen}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setIsOpen(false)}>
            <View style={styles.modalContainer}>
              <FlatList
                data={hours}
                keyExtractor={item => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      onHourChange(item.value);
                      setIsOpen(false);
                    }}>
                    <RegularText>{item.label}</RegularText>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

// Minute Dropdown Component
export const MinuteDropdown = ({ selectedMinute, onMinuteChange }: any) => {
  const minutes = [];
  for (let minute = 0; minute < 60; minute++) {
    minutes.push({ label: minute.toString().padStart(2, '0'), value: minute.toString() });
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <BoldText>Minute</BoldText>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(!isOpen)}>
        <RegularText fontSize={14}>{selectedMinute || 'Choose'}</RegularText>
      </TouchableOpacity>
      {isOpen && (
        <Modal transparent={true} animationType="fade" visible={isOpen}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setIsOpen(false)}>
            <View style={styles.modalContainer}>
              <FlatList
                data={minutes}
                keyExtractor={item => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      onMinuteChange(item.value);
                      setIsOpen(false);
                    }}>
                    <RegularText>{item.label}</RegularText>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

// AM/PM Dropdown Component
export const AmPmDropdown = ({ selectedAmPm, onAmPmChange }: any) => {
  const options = ['AM', 'PM'];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <BoldText>AM/PM</BoldText>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(!isOpen)}>
        <RegularText fontSize={14}>{selectedAmPm || 'Choose'}</RegularText>
      </TouchableOpacity>
      {isOpen && (
        <Modal transparent={true} animationType="fade" visible={isOpen}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setIsOpen(false)}>
            <View style={styles.modalContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    onAmPmChange(option);
                    setIsOpen(false);
                  }}>
                  <RegularText>{option}</RegularText>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

// Combined Time Dropdown (for hour, minute, and AM/PM)
export const TimeDropdown = ({
  onHourChange,
  onMinuteChange,
  onAmPmChange,
  selectedHour,
  selectedMinute,
  selectedAmPm
}: any) => {
  return (
    <View style={styles.container}>
      <HourDropdown selectedHour={selectedHour} onHourChange={onHourChange} />
      <MinuteDropdown selectedMinute={selectedMinute} onMinuteChange={onMinuteChange} />
      <AmPmDropdown selectedAmPm={selectedAmPm} onAmPmChange={onAmPmChange} />
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dropdownContainer: {
    width: '30%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    fontFamily: 'Regular',
    borderWidth: 0.7,
    borderColor: '#808080',
  },
  dropdown: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    height: '60%',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

export default TimeDropdown;