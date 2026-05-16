import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function FieldExpertList() {
  const router = useRouter();
  const [experts, setExperts] = useState<any[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = experts.filter((expert) =>
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.phone.includes(searchQuery) ||
        expert.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExperts(filtered);
    } else {
      setFilteredExperts(experts);
    }
  }, [searchQuery, experts]);

  const loadExperts = async () => {
    setLoading(true);
    try {
      const data = await api.getFieldExperts();
      setExperts(data);
      setFilteredExperts(data);
    } catch (error) {
      console.error('Error loading field experts:', error);
      Alert.alert('Error', 'Failed to load field experts');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Expert', 'Are you sure you want to delete this expert?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
    ]);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteFieldExpert(id);
      loadExperts();
    } catch (error) {
      console.error('Error deleting expert:', error);
      Alert.alert('Error', 'Failed to delete field expert');
    }
  };

  const handleToggleActive = async (expert: any) => {
    try {
      if (expert.is_active) {
        await api.deactivateFieldExpert(expert.id);
      } else {
        await api.activateFieldExpert(expert.id);
      }
      loadExperts();
    } catch (error) {
      console.error('Error updating expert status:', error);
      Alert.alert('Error', 'Failed to update expert status');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Field Experts</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/admin/field-experts/create')}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, phone, email"
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : filteredExperts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>No field experts found</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {filteredExperts.map((expert) => (
            <View key={expert.id} style={styles.expertCard}>
              <View style={styles.expertHeader}>
                <View style={styles.expertInfo}>
                  <Text style={styles.expertName}>{expert.name}</Text>
                  <Text style={styles.expertMeta}>{expert.email}</Text>
                  <Text style={styles.expertMeta}>{expert.phone}</Text>
                  <Text style={styles.expertMeta}>
                    {expert.is_active ? 'Active' : 'Inactive'} • Estimates: {expert.total_estimates}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push(`/admin/field-experts/${expert.id}`)}>
                  <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
                </TouchableOpacity>
              </View>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.statusButton}
                  onPress={() => handleToggleActive(expert)}
                >
                  <Text style={styles.statusButtonText}>
                    {expert.is_active ? 'Deactivate' : 'Activate'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDelete(expert.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  createButton: {
    backgroundColor: '#2563eb',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 16,
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
  expertCard: {
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
  expertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expertInfo: {
    flex: 1,
  },
  expertName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  expertMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statusButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  statusButtonText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
