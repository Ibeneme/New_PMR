import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {Colors} from '../Components/Colors/Colors';
import WelcomeScreen from '../Pages/Auth/WelcomeScreen';
import {RegularText} from '../Components/Texts/CustomTexts/BaseTexts';
import Home from '../Pages/Home/Home';
import StepA from '../Pages/Home/SendParcel/Steps/StepA';
import HomeIcon from '../Components/Icons/HomeIcon/HomeIcon';
import UserIcon from '../Components/Icons/UserIcon/UserIcon';
import Profile from '../Pages/Profile/Profile';
import History from '../Pages/History/History';
import IoTHistoryIcon from '../Components/Icons/HistoryIcon/IoTHistoryIcon';

const Tab = createBottomTabNavigator();

const tabBarLabelStyle = {
  fontSize: 12,
};

function BottomTabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'white',
          paddingTop: 12,
        },
        headerStyle: {
          borderBottomWidth: 3,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <HomeIcon
              width={18}
              height={18}
              color={focused ? Colors.primaryColor : Colors.grayColor}
            />
          ),
          tabBarLabel: ({focused}: any) => (
            <RegularText
              style={[
                tabBarLabelStyle,
                {
                  color: focused ? Colors.primaryColor : Colors.grayColor,
                  fontSize: 12,
                },
              ]}>
              Home
            </RegularText>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <IoTHistoryIcon
              width={18}
              height={18}
              color={focused ? Colors.primaryColor : Colors.grayColor}
            />
          ),
          tabBarLabel: ({focused}: any) => (
            <RegularText
              style={[
                tabBarLabelStyle,
                {
                  color: focused ? Colors.primaryColor : Colors.grayColor,
                  fontSize: 12,
                },
              ]}>
              History
            </RegularText>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <UserIcon
              width={18}
              height={18}
              color={focused ? Colors.primaryColor : Colors.grayColor}
            />
          ),
          tabBarLabel: ({focused}: any) => (
            <RegularText
              style={[
                tabBarLabelStyle,
                {
                  color: focused ? Colors.primaryColor : Colors.grayColor,
                  fontSize: 12,
                },
              ]}>
              Profile
            </RegularText>
          ),
        }}
      />
      {/* <Tab.Screen
        name="StepA"
        component={StepA}
        options={{
          headerShown: false,
          tabBarLabel: ({focused}: any) => (
            <RegularText
              style={[
                tabBarLabelStyle,
                {
                  color: focused ? Colors.primaryColor : Colors.grayColor,
                  fontSize: 12,
                },
              ]}>
              StepA
            </RegularText>
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}

export default BottomTabNavigation;
