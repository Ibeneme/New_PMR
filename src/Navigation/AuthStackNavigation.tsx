import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import WelcomeScreen from '../Pages/Auth/WelcomeScreen';
import LoginScreen from '../Pages/Auth/LoginScreen';
import CreateAccountScreen from '../Pages/Auth/CreateAccountScreen';
import OTPScreen from '../Pages/Auth/OTPScreen';
import ForgotPasswordScreen from '../Pages/Auth/ForgotPasswordScreen';
import ChangePasswordScreen from '../Pages/Auth/ChangePasswordScreen';

export type AuthStackParamList = {
  WelcomeScreen: undefined;
  LoginScreen: undefined;
  CreateAccountScreen: undefined;
  OTPScreen: undefined;
  ForgotPasswordScreen: undefined;
  ChangePasswordScreen: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthStackNavigator: React.FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthStack.Navigator initialRouteName="WelcomeScreen">
        <AuthStack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{headerShown: false}}
        />
        <AuthStack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <AuthStack.Screen
          name="CreateAccountScreen"
          component={CreateAccountScreen}
          options={{headerShown: false}}
        />
        <AuthStack.Screen
          name="OTPScreen"
          component={OTPScreen}
          options={{headerShown: false}}
        />

        <AuthStack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{headerShown: false}}
        />
        <AuthStack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
          options={{headerShown: false}}
        />
      </AuthStack.Navigator>
    </GestureHandlerRootView>
  );
};

export default AuthStackNavigator;
