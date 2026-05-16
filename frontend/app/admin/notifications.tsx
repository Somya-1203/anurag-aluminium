import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function AdminNotifications() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isFocused = useIsFocused();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isFocused) {
      loadNotifications();
    }
  }, [user, isFocused]);

  const loadNotifications = async () => {
    if (!user) return;
    if (!refreshing) {
      setLoading(true);
    }
    try {
      const data = await api.getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification read:', error);
      Alert.alert('Error', 'Failed to update notification');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadNotifications();
              }}
            />
          }
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          ) : (
            notifications.map((item) => (
              <View key={item.id} style={styles.notificationCard}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  {!item.is_read && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>New</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationMeta}>
                  {new Date(item.created_at).toLocaleString()}
                </Text>
                <View style={styles.notificationActions}>
                  {!item.is_read && (
                    <TouchableOpacity
                      style={styles.markButton}
                      onPress={() => markAsRead(item.id)}
                    >
                      <Text style={styles.markButtonText}>Mark as read</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => router.push(`/admin/estimates`)}
                  >
                    <Text style={styles.viewButtonText}>View estimates</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#fde68a',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e',
  },
  notificationMessage: {
    color: '#4b5563',
    marginBottom: 10,
  },
  notificationMeta: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 12,
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  markButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  markButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    borderColor: '#2563eb',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
});
