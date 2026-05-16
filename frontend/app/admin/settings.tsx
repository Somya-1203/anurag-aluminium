import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const router = useRouter();
  const [defaultRate, setDefaultRate] = useState('100');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyContacts, setCompanyContacts] = useState('');
  const [companyOwners, setCompanyOwners] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api.getSettings();
      setDefaultRate((data.default_rate ?? 100).toString());
      setCompanyName(data.company_name || 'Anurag Aluminium & Glass House');
      setCompanyAddress(data.company_address || '55, Sainath Colony, Alakhdham Nagar\nIndore Road, Ujjain');
      setCompanyContacts(data.company_contact_numbers || '9827086001\n9131001671');
      setCompanyOwners(data.company_owners || 'Sandeep Jain\nMehul Jain');
      setCompanyLogoUrl(data.company_logo_url || '');
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const rate = parseFloat(defaultRate);
    if (isNaN(rate) || rate <= 0) {
      Alert.alert('Error', 'Please enter a valid rate');
      return;
    }

    setSaving(true);
    try {
      await api.updateSettings({
        default_rate: rate,
        company_name: companyName,
        company_address: companyAddress,
        company_contact_numbers: companyContacts,
        company_owners: companyOwners,
        company_logo_url: companyLogoUrl,
      });
      Alert.alert('Success', 'Settings updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Default Rate */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cash-outline" size={24} color="#2563eb" />
            <Text style={styles.cardTitle}>Default Rate per Sq Ft</Text>
          </View>

          <Text style={styles.description}>
            This rate will be used as the default when calculating estimates. You
            can override it for individual measurements.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rate (₹ per square feet)</Text>
            <TextInput
              style={styles.input}
              value={defaultRate}
              onChangeText={setDefaultRate}
              placeholder="Enter default rate"
              keyboardType="decimal-pad"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Company Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="business-outline" size={24} color="#059669" />
            <Text style={styles.cardTitle}>Company Information</Text>
          </View>

          <Text style={styles.description}>
            Update the business name, address, contact numbers, owners, and logo used in estimates and PDF documents.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={styles.input}
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Company name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={companyAddress}
              onChangeText={setCompanyAddress}
              placeholder="Company address"
              placeholderTextColor="#9ca3af"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Numbers</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={companyContacts}
              onChangeText={setCompanyContacts}
              placeholder="Enter one number per line"
              placeholderTextColor="#9ca3af"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Owners</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={companyOwners}
              onChangeText={setCompanyOwners}
              placeholder="Enter owner names"
              placeholderTextColor="#9ca3af"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Logo URL</Text>
            <TextInput
              style={styles.input}
              value={companyLogoUrl}
              onChangeText={setCompanyLogoUrl}
              placeholder="Optional logo image URL"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={24} color="#7c3aed" />
            <Text style={styles.cardTitle}>App Information</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Purpose:</Text>
              <Text style={styles.infoValue}>
                On-site window measurement and instant estimation
              </Text>
            </View>
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
  card: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 12,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    marginTop: 8,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 22,
  },
});