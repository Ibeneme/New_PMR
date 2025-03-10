// App.tsx
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import PagesNavigator from './src/PagesNavigator';

import {LocationProvider} from './src/Context/LocationContext';
import {TokenProvider} from './src/Context/TokenProvider';
import {SocketProvider} from './src/Context/useSocket';
import {ToastProvider} from './src/Context/useToast';
import store from './src/Redux/Store';
import {ServerStatusProvider} from './src/Context/useServerStatus';

export default function App() {
  return (
    <SocketProvider>
      {/* <LocationProvider> */}
      <TokenProvider>
        <ToastProvider>
          <Provider store={store}>
            {/* <ServerStatusProvider> */}
            <PagesNavigator />
            {/* </ServerStatusProvider> */}
          </Provider>
        </ToastProvider>
      </TokenProvider>
      {/* </LocationProvider> */}
    </SocketProvider>
  );
}
