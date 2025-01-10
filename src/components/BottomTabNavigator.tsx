import React, { createContext, useContext } from 'react';
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
  OrderHistoryScreen: undefined;
} & ParamListBase;

// Define the context type
interface OrderContextType {
  orderDetails: any;
  setOrderDetails: (details: any) => void;
}

// Create context
export const OrderContext = createContext<OrderContextType>({
  orderDetails: null,
  setOrderDetails: () => {},
});

const Tab = createBottomTabNavigator<TabParamList>();

// Create a wrapper component for OrderHistoryScreen
const OrderHistoryWrapper: React.FC = () => {
  const { orderDetails } = useContext(OrderContext);
  return <OrderHistoryScreen {...orderDetails} />;
};

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
      case 'OrderHistoryScreen':
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
        name="OrderHistoryScreen"
        component={OrderHistoryWrapper}
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