import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';

interface MeasurementItem {
  window_type: string;
  width_inches: string;
  height_inches: string;
  quantity: number;
  rate: string;
}

export default function AdminCreateEstimate() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [fieldExpert, setFieldExpert] = useState('');
  const [fieldExperts, setFieldExperts] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [measurements, setMeasurements] = useState<MeasurementItem[]>([
    { window_type: '', width_inches: '', height_inches: '', quantity: 1, rate: '' },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFieldExperts();
  }, []);

  const loadFieldExperts = async () => {
    try {
      const experts = await api.getActiveFieldExperts();
      setFieldExperts(experts);
    } catch (error) {
      console.error('Error loading field experts:', error);
    }
  };

  const addMeasurement = () => {
    setMeasurements([
      ...measurements,
      { window_type: '', width_inches: '', height_inches: '', quantity: 1, rate: '' },
    ]);
  };

  const removeMeasurement = (index: number) => {
    if (measurements.length === 1) {
      Alert.alert('Error', 'At least one measurement is required');
      return;
    }
    const updated = measurements.filter((_, i) => i !== index);
    setMeasurements(updated);
  };

  const updateMeasurement = (index: number, field: string, value: any) => {
    const updated = [...measurements];
    updated[index] = { ...updated[index], [field]: value };
    setMeasurements(updated);
  };

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      Alert.alert('Error', 'Please enter customer name');
      return;
    }
    if (!siteAddress.trim()) {
      Alert.alert('Error', 'Please enter site address');
      return;
    }
    if (!mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter mobile number');
      return;
    }

    const invalidMeasurement = measurements.find(
      (m) => !m.window_type.trim() || !m.width_inches.trim() || !m.height_inches.trim()
    );

    if (invalidMeasurement) {
      Alert.alert('Error', 'Please complete all measurement fields');
      return;
    }

    setLoading(true);
    try {
      const data = {
        field_expert_name: fieldExpert.trim() || '',
        customer_name: customerName,
        site_address: siteAddress,
        mobile_number: mobileNumber,
        created_by: 'admin',
        created_by_name: user?.name || 'Admin',
        measurements: measurements.map((m) => ({
          window_type: m.window_type,
          width_inches: parseFloat(m.width_inches) || 0,
          height_inches: parseFloat(m.height_inches) || 0,
          quantity: m.quantity,
          rate: m.rate.trim() ? parseFloat(m.rate) : undefined,
        })),
      };

      await api.createEstimate(data);
      Alert.alert('Success', 'Estimate created successfully', [
        { text: 'OK', onPress: () => router.replace('/admin/estimates') },
      ]);
    } catch (error) {
      console.error('Error creating estimate:', error);
      Alert.alert('Error', 'Failed to create estimate');
    } finally {
      setLoading(false);
    }
  };

  const selectFieldExpert = (name: string) => {
    setFieldExpert(name);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Estimate</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimate Details</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Field Expert (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Type or select field expert"
              value={fieldExpert}
              onChangeText={setFieldExpert}
              placeholderTextColor="#9ca3af"
            />
          </View>
          <View style={styles.suggestContainer}>
            {fieldExperts.slice(0, 5).map((expert) => (
              <TouchableOpacity
                key={expert.id}
                style={styles.suggestChip}
                onPress={() => selectFieldExpert(expert.name)}
              >
                <Text style={styles.suggestText}>{expert.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Name *</Text>
            <TextInput
              style={styles.input}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Enter customer name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Site Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={siteAddress}
              onChangeText={setSiteAddress}
              placeholder="Enter site address"
              placeholderTextColor="#9ca3af"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
              style={styles.input}
              value={mobileNumber}
              onChangeText={setMobileNumber}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Measurements</Text>
            <TouchableOpacity style={styles.addButton} onPress={addMeasurement}>
              <Ionicons name="add" size={20} color="#ffffff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {measurements.map((measurement, index) => (
            <View key={index} style={styles.measurementCard}>
              <View style={styles.measurementHeader}>
                <Text style={styles.measurementTitle}>Window {index + 1}</Text>
                {measurements.length > 1 && (
                  <TouchableOpacity onPress={() => removeMeasurement(index)}>
                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Window Type *</Text>
                <TextInput
                  style={styles.input}
                  value={measurement.window_type}
                  onChangeText={(text) => updateMeasurement(index, 'window_type', text)}
                  placeholder="Enter window type"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.row}> 
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Width (inches) *</Text>
                  <TextInput
                    style={styles.input}
                    value={measurement.width_inches}
                    onChangeText={(value) => updateMeasurement(index, 'width_inches', value)}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Height (inches) *</Text>
                  <TextInput
                    style={styles.input}
                    value={measurement.height_inches}
                    onChangeText={(value) => updateMeasurement(index, 'height_inches', value)}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={styles.row}> 
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Quantity</Text>
                  <TextInput
                    style={styles.input}
                    value={measurement.quantity.toString()}
                    onChangeText={(value) => updateMeasurement(index, 'quantity', parseInt(value) || 1)}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Rate ₹/sq ft</Text>
                  <TextInput
                    style={styles.input}
                    value={measurement.rate}
                    onChangeText={(value) => updateMeasurement(index, 'rate', value)}
                    keyboardType="decimal-pad"
                    placeholder="Optional"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating...' : 'Create Estimate'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
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
  addButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  measurementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  measurementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 0,
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
  suggestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  suggestChip: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestText: {
    color: '#1d4ed8',
    fontSize: 14,
  },
});
