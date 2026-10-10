import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppTopBar } from '../components/AppTopBar';
import { BottomNav, MainTab } from '../components/BottomNav';
import { SideDrawer } from '../components/SideDrawer';
import { BookingsScreen } from '../features/bookings/screens/BookingsScreen';
import { LegalPage } from '../features/legal/content';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { MyVehicleScreen } from '../features/vehicle/screens/MyVehicleScreen';
import { unreadCount, useAppStore } from '../state/appStore';
import { colors } from '../theme/colors';
import { RootStackParamList } from './navigationTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

export function MainShell({ navigation }: Props) {
  const [tab, setTab] = useState<MainTab>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const notifications = useAppStore(state => state.notifications);

  const openPage = (page: LegalPage) => {
    setMenuOpen(false);
    navigation.navigate('Legal', { page });
  };

  return (
    <View style={styles.shell}>
      <AppTopBar
        unreadCount={unreadCount(notifications)}
        onMenu={() => setMenuOpen(true)}
        onNotifications={() => navigation.navigate('Notifications')}
        onProfile={() => setTab('profile')}
      />
      <View style={styles.body}>
        <View style={tab === 'home' ? styles.visible : styles.hidden}>
          <MyVehicleScreen navigation={navigation} />
        </View>
        <View style={tab === 'bookings' ? styles.visible : styles.hidden}>
          <BookingsScreen
            onOpenBooking={booking =>
              navigation.push('Confirmation', { booking })
            }
          />
        </View>
        <View style={tab === 'profile' ? styles.visible : styles.hidden}>
          <ProfileScreen navigation={navigation} />
        </View>
      </View>
      <BottomNav tab={tab} onChange={setTab} />
      <SideDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenPage={openPage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    minHeight: 0,
  },
  visible: {
    flex: 1,
    minHeight: 0,
  },
  hidden: {
    display: 'none',
  },
});
