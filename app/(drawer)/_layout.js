import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerStyle: {
            backgroundColor: Colors.surface,
            width: 240,
          },
          drawerActiveTintColor: Colors.text,
          drawerInactiveTintColor: Colors.textSecondary,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'Expense Tracker',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="expenses"
          options={{
            drawerLabel: 'All Expenses',
            title: 'All Expenses',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size} color={color} />
            ),
          }}
        />

      </Drawer>
    </GestureHandlerRootView>
  );
}
