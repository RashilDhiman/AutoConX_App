import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';

import { AppHeader } from '../components/AppHeader';
import { colors } from '../theme/colors';
import { BookInspectionScreen } from '../features/booking/screens/BookInspectionScreen';
import { ConfirmationScreen } from '../features/booking/screens/ConfirmationScreen.tsx';
import { LEGAL_DOCUMENTS } from '../features/legal/content';
import { LegalScreen } from '../features/legal/screens/LegalScreen';
import { NotificationsScreen } from '../features/notifications/screens/NotificationsScreen';
import { MainShell } from './MainShell';
import { RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

function renderHeader(props: NativeStackHeaderProps) {
  return <AppHeader {...props} />;
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: renderHeader,
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen
          name="Main"
          component={MainShell}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookInspection"
          component={BookInspectionScreen}
          options={{ title: 'Book Inspection' }}
        />
        <Stack.Screen
          name="Confirmation"
          component={ConfirmationScreen}
          getId={({ params }) => params.booking.reference}
          options={{ title: 'Confirmation', freezeOnBlur: false }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ title: 'Notifications' }}
        />
        <Stack.Screen
          name="Legal"
          component={LegalScreen}
          options={({ route }) => ({
            title: LEGAL_DOCUMENTS[route.params.page].title,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
