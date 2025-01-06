// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// import SplashScreen from './src/screens/SplashScreen';
// import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
// import HomeScreen from './src/screens/HomeScreen';
// import { DisplayNameProvider } from './src/contexts/DisplayNameContext';
// import { CartProvider } from './src/contexts/CartContext';
 

// const Stack = createStackNavigator();

// function App(): JSX.Element {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaProvider>
//         <DisplayNameProvider>
//            <CartProvider>
//             <NavigationContainer>
//               <Stack.Navigator
//                 initialRouteName="SplashScreen"
//                 screenOptions={{
//                   headerShown: false,
//                   gestureEnabled: false
//                 }}
//               >
//                 <Stack.Screen name="SplashScreen" component={SplashScreen} />
//                 <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
//                 <Stack.Screen name="HomeScreen" component={HomeScreen} />
//               </Stack.Navigator>
//             </NavigationContainer>
//             </CartProvider>
//         </DisplayNameProvider>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }

// export default App;


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import HomeScreen from './src/screens/HomeScreen';  
import PlaceOrderScreen from './src/screens/PlaceOrderScreen';
import SubCategory from './src/screens/SubCategory';
import ItemDetailScreen from './src/screens/ItemDetailScreen';
 import ItemDetailsExpanded from './src/screens/ItemDetailsExpanded';
import LotReportScreen from './src/screens/LotReportScreen';
import QuantitySelectorModal from './src/components/QuantitySelectorModal';
 

// Contexts
import { DisplayNameProvider } from './src/contexts/DisplayNameContext';
import { CartProvider } from './src/contexts/CartContext';
import { NotificationProvider } from './src/contexts/NotificationContext';

// Types
import { RootStackParamList, MainStackParamList } from './src/type/type';
import BottomTabNavigator from './src/components/BottomTabNavigator';
 

const RootStack = createStackNavigator<RootStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

const MainStackNavigator: React.FC = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      
       
      <MainStack.Screen 
        name="PlaceOrderScreen" 
        component={PlaceOrderScreen}
        options={{ title: "My Orders" }}
      /> 
      <MainStack.Screen
        name="SubCategory"
        component={SubCategory}
        options={({ route }) => ({
          title: route.params.category,
        })}
      />
       <MainStack.Screen
        name="ItemDetailScreen"
        component={ItemDetailScreen}
        options={({ route }) => ({
          title: route.params.subcategoryName,
        })}
      />
      <MainStack.Screen
        name="ItemDetailsExpanded"
        component={ItemDetailsExpanded}
        options={({ route }) => ({
          title: route.params.itemName,
        })}
      />
      <MainStack.Screen
        name="LotReportScreen"
        component={LotReportScreen}
        options={{ title: "Lot Report" }}
      />
      <MainStack.Screen
        name="QuantitySelectorModal"
        component={QuantitySelectorModal}
        options={{
          presentation: 'modal',
          title: 'Select Quantity'
        }}
      /> 
    </MainStack.Navigator> 
  );
};

function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <DisplayNameProvider>
          <NotificationProvider>
            <CartProvider>
              <NavigationContainer>
                <RootStack.Navigator
                  initialRouteName="SplashScreen"
                  screenOptions={{
                    headerShown: false,
                    gestureEnabled: false
                  }}
                >
                  <RootStack.Screen 
                    name="SplashScreen" 
                    component={SplashScreen} 
                  />
                  <RootStack.Screen 
                    name="OtpVerificationScreen" 
                    component={OtpVerificationScreen} 
                  />
                  <RootStack.Screen
                    name="Main"
                    component={MainStackNavigator}
                  />
                  <RootStack.Screen
                    name="HomeScreen"
                    component={MainStackNavigator}
                  />
                </RootStack.Navigator>
                 
              </NavigationContainer>
            </CartProvider>
          </NotificationProvider>
        </DisplayNameProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;