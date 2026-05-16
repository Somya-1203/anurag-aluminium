import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function FieldExpertHome() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEstimates();
  }, []);

  const loadEstimates = async () => {
    setLoading(true);
    try {
      const data = await api.getEstimates();
      // Filter only estimates created by this field expert
      const myEstimates = data.filter(
        (e: any) => e.field_expert_name === user?.name
      );
      setEstimates(myEstimates);
    } catch (error) {
      console.error('Error loading estimates:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Field Expert</Text>
          <Text style={styles.headerSubtitle}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#dc2626" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadEstimates} />
        }
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/field-expert/new-estimate')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="add-circle" size={32} color="#2563eb" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>New Measurement</Text>
              <Text style={styles.actionDescription}>
                Add measurements for a new customer
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Recent Estimates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Measurements</Text>
          {estimates.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No measurements yet</Text>
              <Text style={styles.emptySubtext}>
                Start by adding your first measurement
              </Text>
            </View>
          ) : (
            estimates.map((estimate: any) => (
              <TouchableOpacity
                key={estimate.id}
                style={styles.estimateCard}
                onPress={() =>
                  router.push({
                    pathname: '/field-expert/edit-estimate',
                    params: { id: estimate.id },
                  })
                }
              >
                <View style={styles.estimateHeader}>
                  <Text style={styles.estimateName}>
                    {estimate.customer_name}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      estimate.payment_status === 'full' && styles.statusPaid,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {estimate.payment_status === 'pending'
                        ? 'Pending'
                        : estimate.payment_status === 'partial'
                        ? 'Partial'
                        : 'Paid'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.estimateAddress}>
                  {estimate.site_address}
                </Text>
                <Text style={styles.estimatePhone}>{estimate.mobile_number}</Text>
                <View style={styles.estimateFooter}>
                  <Text style={styles.estimateDate}>
                    {new Date(estimate.created_at).toLocaleDateString()}
                  </Text>
                  <Text style={styles.estimateWindows}>
                    {estimate.measurements.length} window(s)
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
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
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  estimateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  estimateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  estimateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPaid: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  estimateAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  estimatePhone: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  estimateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  estimateDate: {
    fontSize: 13,
    color: '#9ca3af',
  },
  estimateWindows: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
});