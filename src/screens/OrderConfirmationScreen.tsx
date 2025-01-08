import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../src/type/type';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';

interface OrderItem {
    ITEM_ID: number;
    ITEM_NAME: string;
    LOT_NO: string;
    VAKAL_NO: string;
    ITEM_MARKS: string;
    UNIT_NAME: string;
    AVAILABLE_QTY: number;
    NET_QUANTITY: number;
    ORDERED_QUANTITY: number;
}

type OrderConfirmationScreenRouteProp = RouteProp<MainStackParamList, 'OrderConfirmationScreen'>;
type OrderConfirmationScreenNavigationProp = StackNavigationProp<MainStackParamList, 'OrderConfirmationScreen'>;

interface OrderConfirmationScreenProps {
  route: OrderConfirmationScreenRouteProp;
  navigation: OrderConfirmationScreenNavigationProp;
}

const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({ route, navigation }) => {
    const { orderItems, customerID } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date().toISOString().split('T')[0],
      transporterName: "",
      remarks: ""
    });

  const handleSubmitOrder = async () => {
    if (!orderDetails.deliveryDate || !orderDetails.transporterName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const orderPayload = {
        CustomerID: customerID, // Using customer_id instead of ORDER_BY
        items: orderItems.map((item: OrderItem) => ({
          ItemID: item.ITEM_ID,
          LotNo: item.LOT_NO,
          Quantity: item.ORDERED_QUANTITY
        })),
        orderDate: orderDetails.orderDate,
        deliveryDate: orderDetails.deliveryDate,
        transporterName: orderDetails.transporterName,
        remarks: orderDetails.remarks,
      };

      const response = await axios.post(
        API_ENDPOINTS.GET_PLACEORDER_DETAILS,
        orderPayload
      );

      if (response.data.success) {
        Alert.alert(
          'Success',
          `Order ${response.data.orderNo} placed successfully! You will receive an email confirmation shortly.`,
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'BottomTabNavigator',
                      params: {
                        screen: 'Home',
                        params: {
                          shouldRefresh: true,
                          customerID: String(customerID),
                        },
                      },
                    },
                  ],
                });
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', response.data.message || 'Failed to place order');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      Alert.alert('Error', `Failed to place order: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.headerText}>Order Confirmation</Text>
          
          <View style={styles.cardContainer}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Order Date</Text>
              <TextInput
                style={[styles.fieldInput, styles.disabledInput]}
                value={orderDetails.orderDate}
                editable={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Delivery Date *</Text>
              <TextInput
                style={styles.fieldInput}
                value={orderDetails.deliveryDate}
                onChangeText={(text) => setOrderDetails(prev => ({ ...prev, deliveryDate: text }))}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Transporter Name *</Text>
              <TextInput
                style={styles.fieldInput}
                value={orderDetails.transporterName}
                onChangeText={(text) => setOrderDetails(prev => ({ ...prev, transporterName: text }))}
                placeholder="Enter transporter name"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Remarks</Text>
              <TextInput
                style={[styles.fieldInput, styles.remarksInput]}
                value={orderDetails.remarks}
                onChangeText={(text) => setOrderDetails(prev => ({ ...prev, remarks: text }))}
                placeholder="Add any special instructions"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <View style={styles.itemsSummary}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            {orderItems.map((item: OrderItem, index: number) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.ITEM_NAME || `Item ${item.ITEM_ID}`}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.ORDERED_QUANTITY}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmitOrder}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" />
                <Text style={styles.buttonText}>Processing...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.buttonText}>Confirm Order</Text>
                <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 24,
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 8,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
    backgroundColor: '#F8FAFC',
  },
  disabledInput: {
    backgroundColor: '#EDF2F7',
    color: '#718096',
  },
  remarksInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  itemsSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  itemName: {
    fontSize: 14,
    color: '#2C3E50',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  footerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default OrderConfirmationScreen;