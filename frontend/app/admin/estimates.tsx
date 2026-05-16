import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function AdminEstimates() {
  const router = useRouter();
  const [estimates, setEstimates] = useState([]);
  const [filteredEstimates, setFilteredEstimates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentCount, setRecentCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'daily' | 'monthly'>('all');

  useEffect(() => {
    loadEstimates();
    loadRecentEstimates();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      const filtered = estimates.filter((e: any) => {
        const customerName = e.customer_name?.toLowerCase() || '';
        const address = e.site_address?.toLowerCase() || '';
        const phone = e.mobile_number || '';
        const orderId = e.id?.toLowerCase() || '';
        const fieldExpert = e.field_expert_name?.toLowerCase() || '';
        const createdDate = e.created_at
          ? new Date(e.created_at).toLocaleDateString().toLowerCase()
          : '';
        const createdMonth = e.created_at
          ? new Date(e.created_at)
              .toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
              .toLowerCase()
          : '';

        return (
          customerName.includes(query) ||
          address.includes(query) ||
          phone.includes(query) ||
          orderId.includes(query) ||
          fieldExpert.includes(query) ||
          createdDate.includes(query) ||
          createdMonth.includes(query)
        );
      });
      setFilteredEstimates(filtered);
    } else {
      setFilteredEstimates(estimates);
    }
  }, [searchQuery, estimates]);

  const loadEstimates = async () => {
    setLoading(true);
    try {
      const data = await api.getEstimates();
      setEstimates(data);
      setFilteredEstimates(data);
    } catch (error) {
      console.error('Error loading estimates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentEstimates = async () => {
    try {
      const recent = await api.getRecentEstimates(24);
      setRecentCount(recent.length);
    } catch (error) {
      console.error('Error loading recent estimates:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'full':
        return '#d1fae5';
      case 'partial':
        return '#fed7aa';
      default:
        return '#fef3c7';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'full':
        return '#065f46';
      case 'partial':
        return '#9a3412';
      default:
        return '#92400e';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Estimates</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by customer, phone, address..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadEstimates} />
        }
      >
        {filteredEstimates.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No estimates found' : 'No estimates yet'}
            </Text>
          </View>
        ) : (
          filteredEstimates.map((estimate: any) => (
            <TouchableOpacity
              key={estimate.id}
              style={styles.estimateCard}
              onPress={() =>
                router.push({
                  pathname: '/admin/edit-estimate',
                  params: { id: estimate.id },
                })
              }
            >
              <View style={styles.estimateHeader}>
                <View style={styles.estimateHeaderLeft}>
                  <Text style={styles.customerName}>
                    {estimate.customer_name}
                  </Text>
                  <Text style={styles.fieldExpert}>
                    By: {estimate.field_expert_name}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(estimate.payment_status) },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusTextColor(estimate.payment_status) },
                    ]}
                  >
                    {estimate.payment_status === 'full'
                      ? 'Paid'
                      : estimate.payment_status === 'partial'
                      ? 'Partial'
                      : 'Pending'}
                  </Text>
                </View>
              </View>

              <Text style={styles.address}>{estimate.site_address}</Text>
              <Text style={styles.phone}>{estimate.mobile_number}</Text>

              <View style={styles.estimateFooter}>
                <View>
                  <Text style={styles.footerLabel}>Windows</Text>
                  <Text style={styles.footerValue}>
                    {estimate.measurements.length}
                  </Text>
                </View>
                <View>
                  <Text style={styles.footerLabel}>Total</Text>
                  <Text style={styles.footerValue}>
                    ₹{estimate.total.toFixed(2)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.footerLabel}>Date</Text>
                  <Text style={styles.footerValue}>
                    {new Date(estimate.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))
        )}
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  estimateCard: {
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
  estimateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  estimateHeaderLeft: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  fieldExpert: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  phone: {
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
  footerLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  arrowContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
  },
});
