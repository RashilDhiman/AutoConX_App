import { useCallback, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/app/AppNavigator';
import { SplashScreen } from './src/components/SplashScreen';

function App() {
  const [showApp, setShowApp] = useState(false);
  const showMainApp = useCallback(() => {
    setShowApp(true);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {showApp ? <AppNavigator /> : <SplashScreen onFinish={showMainApp} />}
    </SafeAreaProvider>
  );
}

export default App;
