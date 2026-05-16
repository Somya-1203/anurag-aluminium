import React, { useState, useEffect } from 'react';
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
  const [estimates, setEstimates] = useState<any[]>([]);
  const [filteredEstimates, setFilteredEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expertFilter, setExpertFilter] = useState('');
  const [groupBy, setGroupBy] = useState<'none' | 'daily' | 'monthly'>('none');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'totalAsc' | 'totalDesc'>('newest');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const parseFilterDate = (value: string) => {
    const parts = value.split('-').map((part) => Number(part));
    if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
      return null;
    }
    const [year, month, day] = parts;
    return new Date(year, month - 1, day);
  };

  const endOfDay = (date: Date) => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  const applyDatePreset = (days: number) => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - (days - 1));
    setDateStart(start.toISOString().slice(0, 10));
    setDateEnd(today.toISOString().slice(0, 10));
  };

  useEffect(() => {
    loadEstimates();
  }, []);

  useEffect(() => {
    const filtered = estimates.filter((estimate) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = !query ||
        estimate.customer_name?.toLowerCase().includes(query) ||
        estimate.mobile_number?.includes(query) ||
        estimate.site_address?.toLowerCase().includes(query) ||
        estimate.field_expert_name?.toLowerCase().includes(query) ||
        estimate.order_id?.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'all' || estimate.payment_status === statusFilter;
      const matchesExpert = !expertFilter || estimate.field_expert_name?.toLowerCase().includes(expertFilter.trim().toLowerCase());

      const createdAt = new Date(estimate.created_at);
      const startDate = parseFilterDate(dateStart);
      const endDate = parseFilterDate(dateEnd);
      const matchesDate = (!startDate || createdAt >= startDate) && (!endDate || createdAt <= endOfDay(endDate));

      return matchesQuery && matchesStatus && matchesExpert && matchesDate;
    });

    filtered.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortOption === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortOption === 'totalAsc') {
        return a.total - b.total;
      }
      return b.total - a.total;
    });

    setFilteredEstimates(filtered);
  }, [estimates, searchQuery, statusFilter, expertFilter, groupBy, sortOption, dateStart, dateEnd]);

  const loadEstimates = async () => {
    setLoading(true);
    try {
      const data = await api.getEstimates();
      setEstimates(data);
    } catch (error) {
      console.error('Error loading estimates:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedEstimates = groupBy !== 'none'
    ? filteredEstimates.reduce((groups: Record<string, any[]>, estimate) => {
        const createdAt = new Date(estimate.created_at);
        const key = groupBy === 'daily'
          ? createdAt.toLocaleDateString()
          : `${createdAt.toLocaleString('default', { month: 'long' })} ${createdAt.getFullYear()}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(estimate);
        return groups;
      }, {})
    : null;

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

  const renderEstimateCard = (estimate: any) => (
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
          <Text style={styles.customerName}>{estimate.customer_name}</Text>
          <Text style={styles.fieldExpert}>By: {estimate.field_expert_name || 'No expert'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(estimate.payment_status) }]}> 
          <Text style={[styles.statusText, { color: getStatusTextColor(estimate.payment_status) }]}> 
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
          <Text style={styles.footerValue}>{estimate.measurements?.length || 0}</Text>
        </View>
        <View>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerValue}>₹{estimate.total?.toFixed(2) || '0.00'}</Text>
        </View>
        <View>
          <Text style={styles.footerLabel}>Date</Text>
          <Text style={styles.footerValue}>{new Date(estimate.created_at).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Estimates</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/admin/create-estimate')}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search order, customer, expert or phone"
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

      <View style={styles.filterBar}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Status</Text>
          <View style={styles.chipRow}>
            {['all', 'pending', 'partial', 'full'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterChip,
                  statusFilter === status && styles.filterChipActive,
                ]}
                onPress={() => setStatusFilter(status)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    statusFilter === status && styles.filterChipTextActive,
                  ]}
                >
                  {status === 'all'
                    ? 'All'
                    : status === 'partial'
                    ? 'Partial'
                    : status === 'full'
                    ? 'Paid'
                    : 'Pending'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Group</Text>
          <View style={styles.chipRow}>
            {['none', 'daily', 'monthly'].map((group) => (
              <TouchableOpacity
                key={group}
                style={[
                  styles.filterChip,
                  groupBy === group && styles.filterChipActive,
                ]}
                onPress={() => setGroupBy(group as any)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    groupBy === group && styles.filterChipTextActive,
                  ]}
                >
                  {group === 'none' ? 'None' : group.charAt(0).toUpperCase() + group.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.datePresetRow}>
        {[
          { label: 'Today', days: 1 },
          { label: 'Last 2 days', days: 2 },
          { label: 'Last 7 days', days: 7 },
          { label: 'Last month', days: 30 },
        ].map((preset) => (
          <TouchableOpacity
            key={preset.label}
            style={styles.presetChip}
            onPress={() => applyDatePreset(preset.days)}
          >
            <Text style={styles.filterChipText}>{preset.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.presetChip, styles.clearChip]}
          onPress={() => {
            setDateStart('');
            setDateEnd('');
          }}
        >
          <Text style={[styles.filterChipText, styles.clearChipText]}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <TextInput
          style={[styles.searchInput, styles.smallInput]}
          placeholder="Expert name"
          value={expertFilter}
          onChangeText={setExpertFilter}
          placeholderTextColor="#9ca3af"
        />
        <TextInput
          style={[styles.searchInput, styles.smallInput]}
          placeholder="From (YYYY-MM-DD)"
          value={dateStart}
          onChangeText={setDateStart}
          placeholderTextColor="#9ca3af"
        />
        <TextInput
          style={[styles.searchInput, styles.smallInput]}
          placeholder="To (YYYY-MM-DD)"
          value={dateEnd}
          onChangeText={setDateEnd}
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.sortBar}>
        <Text style={styles.filterLabel}>Sort</Text>
        <View style={styles.chipRow}>
          {[
            { key: 'newest', label: 'Newest' },
            { key: 'oldest', label: 'Oldest' },
            { key: 'totalDesc', label: 'Total ↓' },
            { key: 'totalAsc', label: 'Total ↑' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterChip,
                sortOption === option.key && styles.filterChipActive,
              ]}
              onPress={() => setSortOption(option.key as any)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  sortOption === option.key && styles.filterChipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
              {searchQuery || expertFilter || dateStart || dateEnd
                ? 'No estimates match the current filters'
                : 'No estimates yet'}
            </Text>
          </View>
        ) : groupBy === 'none' ? (
          filteredEstimates.map(renderEstimateCard)
        ) : (
          Object.entries(groupedEstimates || {}).map(([groupKey, estimates]) => (
            <View key={groupKey} style={styles.groupSection}>
              <Text style={styles.groupTitle}>{groupKey}</Text>
              {estimates.map(renderEstimateCard)}
            </View>
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
  createButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterGroup: {
    marginBottom: 12,
  },
  datePresetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  filterLabel: {
    color: '#4b5563',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  presetChip: {
    backgroundColor: '#eef2ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  clearChip: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  clearChipText: {
    color: '#374151',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
  },
  filterChipText: {
    color: '#374151',
    fontSize: 13,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  smallInput: {
    flex: 1,
    marginRight: 8,
  },
  sortBar: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  groupSection: {
    marginBottom: 18,
  },
  groupTitle: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
});
