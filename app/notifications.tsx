import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from './config';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'course' | 'quiz' | 'achievement' | 'system';
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // In a real app, you'd fetch from the API
      // const token = await AsyncStorage.getItem('userToken');
      // const response = await fetch(config.NOTIFICATION_API, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();
      // if (!data.success) throw new Error('Failed to fetch notifications');
      
      // Mock data for now
      setTimeout(() => {
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'New Course Available',
            message: 'Check out our new course on Advanced Mathematics!',
            type: 'course',
            isRead: false,
            createdAt: '2023-05-15T10:30:00Z'
          },
          {
            id: '2',
            title: 'Quiz Results',
            message: 'You scored 85% on the History Quiz. Great job!',
            type: 'quiz',
            isRead: true,
            createdAt: '2023-05-14T15:45:00Z'
          },
          {
            id: '3',
            title: 'Achievement Unlocked',
            message: 'Congratulations! You\'ve earned the "Quiz Master" badge.',
            type: 'achievement',
            isRead: false,
            createdAt: '2023-05-13T09:20:00Z'
          },
          {
            id: '4',
            title: 'System Update',
            message: 'We\'ve added new features to enhance your learning experience.',
            type: 'system',
            isRead: true,
            createdAt: '2023-05-12T18:10:00Z'
          },
          {
            id: '5',
            title: 'Limited Time Offer',
            message: 'Get 50% off on premium courses until May 31st!',
            type: 'course',
            isRead: false,
            createdAt: '2023-05-11T11:05:00Z'
          },
        ];
        
        setNotifications(mockNotifications);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };
  
  const markAsRead = async (notificationId: string) => {
    try {
      // In a real app, you'd call the API to mark as read
      // const token = await AsyncStorage.getItem('userToken');
      // await fetch(`${config.NOTIFICATION_API}/${notificationId}/read`, {
      //   method: 'PUT',
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const markAllAsRead = async () => {
    try {
      // In a real app, you'd call the API to mark all as read
      // const token = await AsyncStorage.getItem('userToken');
      // await fetch(`${config.NOTIFICATION_API}/read-all`, {
      //   method: 'PUT',
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <Ionicons name="book" size={24} color="#4169E1" />;
      case 'quiz':
        return <Ionicons name="document-text" size={24} color="#28a745" />;
      case 'achievement':
        return <Ionicons name="trophy" size={24} color="#FFD700" />;
      case 'system':
        return <Ionicons name="cog" size={24} color="#6c757d" />;
      default:
        return <Ionicons name="notifications" size={24} color="#4169E1" />;
    }
  };
  
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationIconContainer}>
        {getNotificationIcon(item.type)}
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{formatDate(item.createdAt)}</Text>
        </View>
        
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      
      {!item.isRead && (
        <View style={styles.unreadIndicator} />
      )}
    </TouchableOpacity>
  );
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169E1" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>
            We'll notify you when there's something new
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 14,
    color: '#4169E1',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    position: 'relative',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  unreadNotification: {
    backgroundColor: '#EFF6FF',
  },
  notificationIconContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4169E1',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
}); 