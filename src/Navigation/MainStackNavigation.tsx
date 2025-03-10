import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomTabNavigation from './BottomTabNavigation';
import StepA from '../Pages/Home/SendParcel/Steps/StepA';
import StepB from '../Pages/Home/SendParcel/Steps/StepB';
import StepC from '../Pages/Home/SendParcel/Steps/StepC';
import Summary from '../Pages/Home/SendParcel/Steps/Summary';
import DeliverParcelStepA from '../Pages/Home/DeliverParcel/DeliverParcelStepA';
import DeliverParcelStepB from '../Pages/Home/DeliverParcel/DeliverParcelStepB';
import OrderRide from '../Pages/Home/OfferRide/OrderRide';
import Join from '../Pages/Home/JoinRide/JoinRide';

export type MainStackParamList = {
  Home: undefined;
  LoginScreen: undefined;
  StepA: undefined;
  StepB: undefined;
  StepC: undefined;
  Summary: undefined;
  DeliverParcelStepA: undefined;
  DeliverParcelStepB: undefined;
  OrderRide: undefined;
  Join: undefined;
};

const MainStack = createStackNavigator<MainStackParamList>();

const MainStackNavigator: React.FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <MainStack.Navigator initialRouteName="Home">
        <MainStack.Screen
          name="Home"
          component={BottomTabNavigation}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="StepA"
          component={StepA}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="StepB"
          component={StepB}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="StepC"
          component={StepC}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Summary"
          component={Summary}
          options={{headerShown: false}}
        />

        <MainStack.Screen
          name="DeliverParcelStepA"
          component={DeliverParcelStepA}
          options={{headerShown: false}}
        />

        <MainStack.Screen
          name="DeliverParcelStepB"
          component={DeliverParcelStepB}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="OrderRide"
          component={OrderRide}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Join"
          component={Join}
          options={{headerShown: false}}
        />
      </MainStack.Navigator>
    </GestureHandlerRootView>
  );
};

export default MainStackNavigator;
