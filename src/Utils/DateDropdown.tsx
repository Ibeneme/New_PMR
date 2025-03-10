import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import {BoldText, RegularText} from '../Components/Texts/CustomTexts/BaseTexts';

export const YearDropdown = ({selectedYear, onYearChange}: any) => {
  const years = [];
  for (let year = 1960; year <= 2006; year++) {
    years.push({label: year.toString(), value: year.toString()});
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <BoldText>Year</BoldText>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(!isOpen)}>
        <RegularText fontSize={14}>{selectedYear || 'Choose'}</RegularText>
      </TouchableOpacity>
      {isOpen && (
        <Modal transparent={true} animationType="fade" visible={isOpen}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setIsOpen(false)}>
            <View style={styles.modalContainer}>
              <FlatList
                data={years}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      onYearChange(item.value);
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

export const MonthDropdown = ({selectedMonth, onMonthChange}: any) => {
  const months = [
    {label: 'January', value: '1'},
    {label: 'February', value: '2'},
    {label: 'March', value: '3'},
    {label: 'April', value: '4'},
    {label: 'May', value: '5'},
    {label: 'June', value: '6'},
    {label: 'July', value: '7'},
    {label: 'August', value: '8'},
    {label: 'September', value: '9'},
    {label: 'October', value: '10'},
    {label: 'November', value: '11'},
    {label: 'December', value: '12'},
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <BoldText>Month</BoldText>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(!isOpen)}>
        <RegularText fontSize={14}>
          {selectedMonth || 'Choose'}
        </RegularText>
      </TouchableOpacity>
      {isOpen && (
        <Modal transparent={true} animationType="fade" visible={isOpen}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setIsOpen(false)}>
            <View style={styles.modalContainer}>
              <FlatList
                data={months}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      onMonthChange(item.value);
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

export const DayDropdown = ({
  selectedMonth,
  selectedYear,
  selectedDay,
  onDayChange,
}: any) => {
  const [days, setDays] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateDays = () => {
      let maxDay;
      if (selectedMonth === '2' && selectedYear) {
        const isLeapYear =
          (selectedYear % 4 === 0 && selectedYear % 100 !== 0) ||
          selectedYear % 400 === 0;
        maxDay = isLeapYear ? 29 : 28;
      } else if (['4', '6', '9', '11'].includes(selectedMonth)) {
        maxDay = 30;
      } else {
        maxDay = 31;
      }
      const newDays = Array.from({length: maxDay}, (_, i) => ({
        label: (i + 1).toString(),
        value: (i + 1).toString(),
      }));
      setDays(newDays as any);
    };

    updateDays();
  }, [selectedMonth, selectedYear]);

  
  return (
    <View style={styles.dropdownContainer}>
      <BoldText>Day</BoldText>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(!isOpen)}>
        <RegularText fontSize={14}>{selectedDay || 'Choose'}</RegularText>
      </TouchableOpacity>
      {isOpen && (
        <Modal transparent={true} animationType="fade" visible={isOpen}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setIsOpen(false)}>
            <View style={styles.modalContainer}>
              <FlatList
                data={days}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      onDayChange(item.value);
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

export const ThreeDropdowns = ({
  onYearChange,
  onMonthChange,
  onDayChange,
}: any) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const handleYearChange = (value: any) => {
    setSelectedYear(value);
    onYearChange(value);
  };

  const handleMonthChange = (value: any) => {
    setSelectedMonth(value);
    onMonthChange(value);
  };

  const handleDayChange = (value: any) => {
    setSelectedDay(value);
    onDayChange(value);
  };

  const formatDate = () => {
    const year = selectedYear;
    const month = selectedMonth;
    const day = selectedDay;
    return `${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`;
  };

  const formattedDate = formatDate();

  return (
    <View style={styles.container}>
      <YearDropdown
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />
      <MonthDropdown
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
      />
      <DayDropdown
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        selectedDay={selectedDay}
        onDayChange={handleDayChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dropdownContainer: {
    width: '32%',
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
    height: '60%'
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

export default ThreeDropdowns;
