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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '../../../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function EditFieldExpert() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const expertId = params.id as string;
  const [expert, setExpert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadExpert();
  }, [expertId]);

  const loadExpert = async () => {
    setLoading(true);
    try {
      const data = await api.getFieldExpert(expertId);
      setExpert(data);
    } catch (error) {
      console.error('Error loading field expert:', error);
      Alert.alert('Error', 'Failed to load field expert');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!expert.name?.trim() || !expert.phone?.trim() || !expert.email?.trim()) {
      Alert.alert('Error', 'Please fill in name, phone and email');
      return;
    }

    setSaving(true);
    try {
      await api.updateFieldExpert(expertId, {
        name: expert.name,
        phone: expert.phone,
        email: expert.email,
        address: expert.address,
      });
      Alert.alert('Success', 'Field expert updated successfully');
      loadExpert();
    } catch (error) {
      console.error('Error updating field expert:', error);
      Alert.alert('Error', 'Failed to update field expert');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async () => {
    try {
      if (expert.is_active) {
        await api.deactivateFieldExpert(expertId);
      } else {
        await api.activateFieldExpert(expertId);
      }
      loadExpert();
    } catch (error) {
      console.error('Error updating expert status:', error);
      Alert.alert('Error', 'Failed to update expert status');
    }
  };

  const confirmDelete = () => {
    Alert.alert('Delete Expert', 'Are you sure you want to delete this expert?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteFieldExpert(expertId);
            router.replace('/admin/field-experts');
          } catch (error) {
            console.error('Error deleting field expert:', error);
            Alert.alert('Error', 'Failed to delete field expert');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!expert) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Field expert not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Field Expert</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={expert.name}
              onChangeText={(value) => setExpert({ ...expert, name: value })}
              placeholder="Enter name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone *</Text>
            <TextInput
              style={styles.input}
              value={expert.phone}
              onChangeText={(value) => setExpert({ ...expert, phone: value })}
              keyboardType="phone-pad"
              placeholder="Enter phone"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={expert.email}
              onChangeText={(value) => setExpert({ ...expert, email: value })}
              keyboardType="email-address"
              placeholder="Enter email"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={expert.address}
              onChangeText={(value) => setExpert({ ...expert, address: value })}
              placeholder="Enter address"
              placeholderTextColor="#9ca3af"
              multiline
            />
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Status</Text>
            <Text style={styles.metaValue}>{expert.is_active ? 'Active' : 'Inactive'}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Total Estimates</Text>
            <Text style={styles.metaValue}>{expert.total_estimates}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, saving && styles.submitButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.submitButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.statusButton} onPress={toggleActive}>
              <Text style={styles.statusButtonText}>
                {expert.is_active ? 'Deactivate' : 'Activate'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
              <Text style={styles.deleteButtonText}>Delete Expert</Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaLabel: {
    color: '#6b7280',
  },
  metaValue: {
    fontWeight: '600',
    color: '#1f2937',
  },
  buttonContainer: {
    paddingTop: 8,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statusButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  statusButtonText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
