import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ParamListBase } from '@react-navigation/native';

// Import your screens
import HomeScreen from '../screens/HomeScreen';
import AnnouncementScreen from '../screens/AnnouncementScreen';
// import ReportScreen from './ReportScreen';
import AlertScreen from '../screens/AlertScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';

// Define the param list for type safety
type TabParamList = {
  Home: undefined;
  Announcement: undefined;
  Report: undefined;
  Alert: undefined;
  OrderHistory: undefined;
} & ParamListBase;

const Tab = createBottomTabNavigator<TabParamList>();

const BottomTabNavigator: React.FC = () => {
  // Helper function to get icon name
  const getIconName = (routeName: string, focused: boolean): string => {
    switch (routeName) {
      case 'Home':
        return 'home';
      case 'Announcement':
        return 'campaign';
      case 'Report':
        return 'assessment';
      case 'Alert':
        return focused ? 'notifications' : 'notifications-none';
      case 'OrderHistory':
        return 'history';
      default:
        return 'circle';
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getIconName(route.name, focused);
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F48221',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
      />
      <Tab.Screen 
        name="Announcement" 
        component={AnnouncementScreen}
        options={{
          headerShown: true
        }}
      />
      {/* <Tab.Screen 
        name="Report" 
        component={ReportScreen} 
      /> */}
      <Tab.Screen 
        name="Alert" 
        component={AlertScreen} 
      />
      <Tab.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{
          title: 'Order History',
          headerStyle: { backgroundColor: '#f5f5f5' },
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      /> 
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    elevation: 8, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

export default BottomTabNavigator;