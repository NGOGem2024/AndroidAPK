//  // src/screens/OtpVerificationScreen.tsx

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RouteProp, useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';

// import React, { useState } from 'react';
// import {
//   Alert,
//   Dimensions,
//   Image,
//   ImageBackground,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
//   ActivityIndicator
// } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { RootStackParamList , MainStackParamList} from '../type/type';
// import axios from 'axios';
// import { API_ENDPOINTS, DEFAULT_HEADERS } from '../config/api.config';

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// type OtpVerificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;
// type OtpVerificationScreenRouteProp = RouteProp<RootStackParamList, 'OtpVerificationScreen'>;

// const OtpVerificationScreen: React.FC<{ route: OtpVerificationScreenRouteProp }> = ({ route }) => {
   
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigation = useNavigation<OtpVerificationScreenNavigationProp>();

//   const loginWithUsernameAndPassword = async () => {
//     if (!username || !password) {
//       Alert.alert('Error', 'Please enter both username and password');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       console.log('Making API request to:', API_ENDPOINTS.LOGIN); // Debug log
      
//       const response = await axios({
//         method: 'post',
//         url: API_ENDPOINTS.LOGIN,
        
//         data: {
//           sf_userName: username,
//           sf_userPwd: password
//         },
//         headers: DEFAULT_HEADERS,
//       });

//       console.log('Response received:', response.data); // Debug log

//       if (response.data?.output) {
//         const { token, CustomerID, DisplayName, CustomerGroupID } = response.data.output;
        
//         await Promise.all([
//           AsyncStorage.setItem('userToken', token),
//           AsyncStorage.setItem('customerID', CustomerID.toString()),
//           AsyncStorage.setItem('Disp_name', DisplayName),
//           AsyncStorage.setItem('FK_CUST_GROUP_ID', CustomerGroupID.toString())
//         ]);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//         navigation.navigate('Main', {
//           screen: 'HomeScreen',
//           params: {
//             initialLogin: true,
//             customerID: CustomerID.toString(),          
//           }
//         });
//         // navigation.navigate('HomeScreen');
//       } else {
//         Alert.alert('Error', 'Invalid response from server');
//       }
//     } catch (error: any) {
//       console.error('Login error:', error); // Debug log
      
//       let errorMessage = 'An unexpected error occurred';
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message.includes('Network Error')) {
//         errorMessage = 'Network error. Please check your internet connection and make sure the server IP is correct.';
//       }
//       Alert.alert('Error', errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={styles.container}>
//         <ImageBackground
//           source={require('../assets/wish/bgimg.png')}
//           style={styles.backgroundImage}
//           resizeMode="cover"
//         >
//           <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//             style={styles.keyboardAvoidView}
//           >
//             <ScrollView
//               contentContainerStyle={styles.scrollViewContent}
//               keyboardShouldPersistTaps="handled"
//             >
//               <View style={styles.contentContainer}>
//                 <View style={styles.header}>
//                   <Image
//                     source={require('../assets/SavlaLogo.jpg')}
//                     style={styles.logo}
//                   />
//                   <Text style={styles.title}>LOGIN</Text>
//                   <Text style={styles.subtitle}>Sign in with your credentials</Text>
//                 </View>

//                 <View style={styles.formContainer}>
//                   <View style={styles.inputContainer}>
//                   {/* <MaterialIcons name="email" size={24} color="#000" />  */}
//                     <MaterialIcons name="person" size={24} color="#999" style={styles.icon} />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Username"
//                       value={username}
//                       onChangeText={setUsername}
//                       placeholderTextColor="#999"
//                       autoCapitalize="none"
//                       editable={!isLoading}
//                     />
//                   </View>

//                   <View style={styles.inputContainer}>
//                     <MaterialIcons name="lock" size={24} color="#999" style={styles.icon} />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Password"
//                       value={password}
//                       onChangeText={setPassword}
//                       secureTextEntry={!showPassword}
//                       placeholderTextColor="#999"
//                       autoCapitalize="none"
//                       editable={!isLoading}
//                     />
//                     <TouchableOpacity 
//                       onPress={() => setShowPassword(!showPassword)} 
//                       style={styles.eyeIcon}
//                     >
//                       <MaterialIcons
//                         name={showPassword ? 'visibility-off' : 'visibility'}
//                         size={24}
//                         color="#999"
//                       />
//                     </TouchableOpacity>
//                   </View>

//                   <TouchableOpacity 
//                     style={[styles.button, isLoading && styles.buttonLoading]}
//                     onPress={loginWithUsernameAndPassword}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <ActivityIndicator color="#fff" />
//                     ) : (
//                       <Text style={styles.buttonText}>Login</Text>
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </ScrollView>
//           </KeyboardAvoidingView>
//         </ImageBackground>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   backgroundImage: {
//     flex: 1,
//     width: '100%',
//   },
//   keyboardAvoidView: {
//     flex: 1,
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//   },
//   contentContainer: {
//     flex: 1,
//     alignItems: 'center',
//     paddingTop: Platform.OS === 'ios' ? 60 : 40,
//     paddingBottom: 20,
//   },
//   header: {
//     alignItems: 'center',
//     width: '100%',
//     paddingHorizontal: 20,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     marginTop: 120,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#473c3c',
//     marginTop: 25,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#6b6464',
//     marginTop: 8,
//   },
//   formContainer: {
//     width: '90%',
//     borderRadius: 20,
//     padding: 20,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   inputContainer: {
//     width: '100%',
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#fff',
//     marginBottom: 15,
//     paddingHorizontal: 15,
//     shadowColor: '#fb932c',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   input: {
//     flex: 1,
//     height: '100%',
//     fontSize: 16,
//     color: '#333',
//   },
//   icon: {
//     marginRight: 10,
//   },
//   eyeIcon: {
//     padding: 5,
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#F48221',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 25,
//     marginTop: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   buttonLoading: {
//     backgroundColor: '#ffa559',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });

// export default OtpVerificationScreen;

 
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RootStackParamList, MainStackParamList} from '../type/type';
import axios from 'axios';
import {API_ENDPOINTS, DEFAULT_HEADERS} from '../config/api.config';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

type OtpVerificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;
type OtpVerificationScreenRouteProp = RouteProp<
  RootStackParamList,
  'OtpVerificationScreen'
>;

const OtpVerificationScreen: React.FC<{
  route: OtpVerificationScreenRouteProp;
}> = ({route}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<OtpVerificationScreenNavigationProp>();

  // const loginWithUsernameAndPassword = async () => {
  //   if (!username || !password) {
  //     Alert.alert('Error', 'Please enter both username and password');
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     console.log('Making login request to:', API_ENDPOINTS.LOGIN);
  //     console.log('With data:', {sf_userName: username, sf_userPwd: password});
  //     const response = await axios({
  //       method: 'post',
  //       url: API_ENDPOINTS.LOGIN,
  //       data: {
  //         sf_userName: username,
  //         sf_userPwd: password,
  //       },
  //       headers: DEFAULT_HEADERS,
  //     });

  //     console.log('Full response:', response);
  //     console.log('Response headers:', response.headers);
  //     console.log('Response status:', response.status);
  //     console.log('Response received:', response.data);
  //     if (response.data?.output) {
  //       const {token, CustomerID, DisplayName, CustomerGroupID} =
  //         response.data.output;

  //       await Promise.all([
  //         AsyncStorage.setItem('userToken', token),
  //         AsyncStorage.setItem('customerID', CustomerID.toString()),
  //         AsyncStorage.setItem('Disp_name', DisplayName),
  //         AsyncStorage.setItem('FK_CUST_GROUP_ID', CustomerGroupID.toString()),
  //       ]);
  //       axios.defaults.headers.common['Authorization'] = Bearer ${token};
  //       navigation.navigate('Main', {
  //         screen: 'HomeScreen',
  //         params: {
  //           initialLogin: true,
  //           customerID: CustomerID.toString(),
  //         },
  //       });
  //     } else {
  //       Alert.alert('Error', 'Invalid response from server');
  //     }
  //   } catch (error: any) {
  //     let errorMessage = 'An unexpected error occurred';
  //     if (error.response?.data?.message) {
  //       errorMessage = error.response.data.message;
  //     } else if (error.message.includes('Network Error')) {
  //       errorMessage =
  //         'Network error. Please check your internet connection and make sure the server IP is correct.';
  //     }
  //     Alert.alert('Error', errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const loginWithUsernameAndPassword = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🟢 Making login request to:', API_ENDPOINTS.LOGIN);
      console.log('🔹 With data:', {
        sf_userName: username,
        sf_userPwd: password,
      });

      const response = await axios({
        method: 'post',
        url: API_ENDPOINTS.LOGIN,
        data: {
          sf_userName: username,
          sf_userPwd: password,
        },
        headers: DEFAULT_HEADERS,
      });

      console.log('✅ Full response:', response);
      console.log('📩 Response headers:', response.headers);
      console.log('📌 Response status:', response.status);
      console.log('📤 Response received:', response.data);

      if (response.data?.output) {
        const {token, CustomerID, DisplayName, CustomerGroupID} =
          response.data.output;

        console.log('🟢 Received Token:', token);
        if (!token) {
          console.error('❌ Token is undefined or empty!');
          Alert.alert('Error', 'Authentication failed. No token received.');
          return;
        }

        // Store Token in AsyncStorage
        await Promise.all([
          AsyncStorage.setItem('userToken', token),
          AsyncStorage.setItem('customerID', CustomerID.toString()),
          AsyncStorage.setItem('Disp_name', DisplayName),
          AsyncStorage.setItem('FK_CUST_GROUP_ID', CustomerGroupID.toString()),
        ]);

        // Verify Token Storage
        const storedToken = await AsyncStorage.getItem('userToken');
        console.log('📌 Token Stored in AsyncStorage:', storedToken);

        // Set Authorization Header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Navigate to Home
        navigation.navigate('Main', {
          screen: 'HomeScreen',
          params: {
            initialLogin: true,
            customerID: CustomerID.toString(),
          },
        });
      } else {
        console.error('❌ Invalid response format:', response.data);
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error: any) {
      console.error('❌ Login Error:', error);
      let errorMessage = 'An unexpected error occurred';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes('Network Error')) {
        errorMessage =
          'Network error. Please check your internet connection and make sure the server IP is correct.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Background Image */}
      <View style={styles.fixedBackground}>
        <Image
          source={require('../assets/wish/bgimg.png')}
          style={styles.backgroundImage}
        />
      </View>

      {/* Scrollable Content */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Image
                source={require('../assets/SavlaLogo.jpg')}
                style={styles.logo}
              />
              <Text style={styles.title}>LOGIN</Text>
              <Text style={styles.subtitle}>Sign in with your credentials</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="person"
                  size={24}
                  color="#999"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="lock"
                  size={24}
                  color="#999"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}>
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={24}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonLoading]}
                onPress={loginWithUsernameAndPassword}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fixedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 120,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#473c3c',
    marginTop: 25,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b6464',
    marginTop: 8,
  },
  formContainer: {
    width: '90%',
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  inputContainer: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowColor: '#fb932c',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
  eyeIcon: {
    padding: 5,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#F48221',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonLoading: {
    backgroundColor: '#ffa559',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OtpVerificationScreen;