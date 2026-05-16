import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function AdminHome() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.id) return;
      try {
        const count = await api.getUnreadNotificationCount(user.id);
        setUnreadCount(count.unread_count || 0);
      } catch (error) {
        console.error('Error loading unread notifications:', error);
      }
    };
    loadNotifications();
  }, [user]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: 'document-text',
      title: 'All Estimates',
      description: 'View and manage all estimates',
      route: '/admin/estimates',
      color: '#2563eb',
    },
    {
      icon: 'people',
      title: 'Field Experts',
      description: 'Manage field experts and assignments',
      route: '/admin/field-experts',
      color: '#f59e0b',
    },
    {
      icon: 'add-circle',
      title: 'Create Estimate',
      description: 'Create a new estimate manually',
      route: '/admin/create-estimate',
      color: '#10b981',
    },
    {
      icon: 'notifications',
      title: 'Notifications',
      description: `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`,
      route: '/admin/notifications',
      color: '#ef4444',
    },
    {
      icon: 'albums',
      title: 'Window Types',
      description: 'Manage window types (SOPs)',
      route: '/admin/window-types',
      color: '#7c3aed',
    },
    {
      icon: 'settings',
      title: 'Settings',
      description: 'Default rate and app settings',
      route: '/admin/settings',
      color: '#059669',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerSubtitle}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#dc2626" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Company Info */}
        <View style={styles.companyCard}>
          <Text style={styles.companyName}>Anurag Aluminium</Text>
          <Text style={styles.companySubName}>& Glass House</Text>
          <View style={styles.companyDivider} />
          <Text style={styles.companyAddress}>
            55, Sainath Colony, Alakhdham Nagar{' \n'}Indore Road, Ujjain
          </Text>
          <View style={styles.companyContacts}>
            <Text style={styles.companyContact}>9827086001</Text>
            <Text style={styles.companyContact}>9131001671</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={28} color="#ffffff" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  companyCard: {
    backgroundColor: '#ffffff',
    margin: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  companySubName: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 4,
  },
  companyDivider: {
    width: 60,
    height: 3,
    backgroundColor: '#2563eb',
    marginVertical: 16,
    borderRadius: 2,
  },
  companyAddress: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  companyContacts: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  companyContact: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  menuDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});