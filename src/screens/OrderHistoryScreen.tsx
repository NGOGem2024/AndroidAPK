import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { API_ENDPOINTS, DEFAULT_HEADERS } from '../config/api.config';

interface OrderHistoryItem {
  ORDER_ID: number;
  CUSTOMERID: string;
  ITEM_ID: number;
  ITEM_NAME: string;
  ORDER_DATE: string;
  QUANTITY: number;
  LOT_NO: string;
}

interface GroupedOrder {
  ORDER_ID: number;
  ORDER_DATE: string;
  items: OrderHistoryItem[];
}

 
const CUSTOMER_ID = "1279";

const OrderHistoryScreen: React.FC = () => {
  const [orderHistory, setOrderHistory] = useState<GroupedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const groupOrdersByOrderId = (orders: OrderHistoryItem[]): GroupedOrder[] => {
    const groupedOrders = orders.reduce((acc: { [key: number]: GroupedOrder }, curr) => {
      if (!acc[curr.ORDER_ID]) {
        acc[curr.ORDER_ID] = {
          ORDER_ID: curr.ORDER_ID,
          ORDER_DATE: curr.ORDER_DATE,
          items: [],
        };
      }
      acc[curr.ORDER_ID].items.push(curr);
      return acc;
    }, {});

    return Object.values(groupedOrders).sort((a, b) =>
      new Date(b.ORDER_DATE).getTime() - new Date(a.ORDER_DATE).getTime()
    );
  };

  const fetchOrderHistory = async () => {
    try {
      setIsLoading(true);
      const url = API_ENDPOINTS.GET_ORDER_HISTORY;
      const token = 'your-auth-token';

      const response = await axios.get(url, {
        timeout: 10000,
        headers:DEFAULT_HEADERS         
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        const groupedOrders = groupOrdersByOrderId(response.data.data);
        setOrderHistory(groupedOrders);
      } else {
        Alert.alert('No Orders', 'No order history found.');
        setOrderHistory([]);
      }
    } catch (error: any) {
      console.error('Error fetching order history:', error);
      Alert.alert('Error', 'Failed to fetch order history.');
      setOrderHistory([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return `${formattedDate} at ${formattedTime}`;
    } catch {
      return dateString;
    }
  };

  const toggleExpand = (orderId: number) => {
    setExpandedId(expandedId === orderId ? null : orderId);
  };

  const renderOrderItem = ({ item }: { item: GroupedOrder }) => {
    const isExpanded = expandedId === item.ORDER_ID;

    return (
      <View style={styles.card}>
        <View style={styles.mainContent}>
          <View style={styles.orderHeader}>
            <View style={styles.orderTitleContainer}>
              <Text style={styles.orderIdText}>Order #{item.ORDER_ID}</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Processing</Text>
              </View>
            </View>
            <Text style={styles.dateText}>{formatDate(item.ORDER_DATE)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleExpand(item.ORDER_ID)}
            style={styles.menuButton}
          >
            <Text style={styles.menuIcon}>{isExpanded ? '▼' : '▶'}</Text>
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            <View style={styles.detailsContainer}>
              {item.items.map((orderItem, index) => (
                <View key={orderItem.ITEM_ID} style={styles.itemContainer}>
                  {index > 0 && <View style={styles.itemDivider} />}
                  <Text style={styles.itemTitle}>ITEM {index + 1}</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Item Name:</Text>
                    <Text style={styles.value}>{orderItem.ITEM_NAME}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Ordered Quantity:</Text>
                    <Text style={styles.value}>{orderItem.QUANTITY}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Lot No:</Text>
                    <Text style={[styles.value, styles.highlightedValue]}>{orderItem.LOT_NO}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0284C7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
        <Text style={styles.subtitle}>View your orders</Text>
      </View>
      <FlatList
        data={orderHistory}
        keyExtractor={item => `order-${item.ORDER_ID}`}
        renderItem={renderOrderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchOrderHistory();
            }}
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#663399',
    textAlign:'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
    textAlign:'center',
    fontWeight:'500'
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderHeader: {
    flex: 1,
  },
  orderTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight:'500'
  },
  menuButton: {
    padding: 4,
    marginLeft: 8,
  },
  menuIcon: {
    fontSize: 16,
    color: '#663399',
  },
  expandedContent: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
  },
  itemDivider: {
    height: 2,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  itemContainer: {
    gap: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#663399',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
    width:'50%',
    flex: 1,
    fontWeight:'500'
  },
  value: {
    fontSize: 13,
    color: '#1f2937',
    flex: 2,
    fontWeight:'bold',
    textAlign: 'right',
  },
  highlightedValue: {
    color: '#F28C28',
    fontWeight: '700',
  },
});

export default OrderHistoryScreen;
