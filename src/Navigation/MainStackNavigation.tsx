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
import EarningsPage from '../Pages/Profile/EarningsPage';
import WithdrawalsPage from '../Pages/Profile/WithdrawalsPage';
import EditProfileScreen from '../Pages/Profile/EditProfile';
import DetailsScreen from '../Pages/History/Details';
import AutoCompletePlaces from '../Pages/Home/AutoCompletePlaces';
import ChatPage from '../Pages/Messages/ChatPage';
import ReceiptScreen from '../Pages/History/ReceiptScreen';

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
  Withdrawals: undefined;
  Earnings: undefined;
  EditProfileScreen: undefined;
  DetailsScreen: undefined;
  AutoCompletePlaces: undefined;
  ChatPage: undefined;
  ReceiptScreen: undefined;
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
          name="ChatPage"
          component={ChatPage}
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
        <MainStack.Screen
          name="Earnings"
          component={EarningsPage}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Withdrawals"
          component={WithdrawalsPage}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="DetailsScreen"
          component={DetailsScreen}
          options={{headerShown: false}}
        />

        <MainStack.Screen
          name="AutoCompletePlaces"
          component={AutoCompletePlaces}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="ReceiptScreen"
          component={ReceiptScreen}
          options={{headerShown: false}}
        />
      </MainStack.Navigator>
    </GestureHandlerRootView>
  );
};

export default MainStackNavigator;
