import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {Colors} from '../Components/Colors/Colors';
import WelcomeScreen from '../Pages/Auth/WelcomeScreen';
import {RegularText} from '../Components/Texts/CustomTexts/BaseTexts';
import Home from '../Pages/Home/Home';
import StepA from '../Pages/Home/SendParcel/Steps/StepA';

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
          tabBarLabel: ({focused}: any) => (
            <RegularText
              style={[
                tabBarLabelStyle,
                {
                  color: focused ? Colors.primaryColor : Colors.grayColor65,
                  fontSize: 12,
                },
              ]}>
              Home
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
                  color: focused ? Colors.primaryColor : Colors.grayColor65,
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
