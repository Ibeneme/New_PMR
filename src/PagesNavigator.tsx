// AppContent.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainStackNavigator from './Navigation/MainStackNavigation';
import AuthStackNavigator from './Navigation/AuthStackNavigation';
import {useTokens} from './Context/TokenProvider';

const PagesNavigator = () => {
  const {tokens} = useTokens(); // Access tokens from context

  return (
    <NavigationContainer>
      {tokens.refreshToken ? <MainStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default PagesNavigator;
