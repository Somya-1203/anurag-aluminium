import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { FRACTIONS, convertToInches } from '../../utils/measurements';

interface MeasurementItem {
  window_type: string;
  width_whole: number;
  width_fraction: number;
  height_whole: number;
  height_fraction: number;
  width_inches: number;
  height_inches: number;
  quantity: number;
}

export default function NewEstimate() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [windowTypes, setWindowTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [measurements, setMeasurements] = useState<MeasurementItem[]>([]);

  // Modal states
  const [showWindowTypeModal, setShowWindowTypeModal] = useState(false);
  const [showFractionModal, setShowFractionModal] = useState(false);
  const [currentMeasurementIndex, setCurrentMeasurementIndex] = useState<number>(-1);
  const [fractionField, setFractionField] = useState<string>('');

  useEffect(() => {
    loadWindowTypes();
    addMeasurement();
  }, []);

  const loadWindowTypes = async () => {
    try {
      const types = await api.getWindowTypes();
      setWindowTypes(types);
    } catch (error) {
      console.error('Error loading window types:', error);
    }
  };

  const addMeasurement = () => {
    setMeasurements([
      ...measurements,
      {
        window_type: '',
        width_whole: 0,
        width_fraction: 0,
        height_whole: 0,
        height_fraction: 0,
        width_inches: 0,
        height_inches: 0,
        quantity: 1,
      },
    ]);
  };

  const removeMeasurement = (index: number) => {
    if (measurements.length === 1) {
      Alert.alert('Error', 'At least one measurement is required');
      return;
    }
    const newMeasurements = measurements.filter((_, i) => i !== index);
    setMeasurements(newMeasurements);
  };

  const updateMeasurement = (index: number, field: string, value: any) => {
    const newMeasurements = [...measurements];
    newMeasurements[index] = { ...newMeasurements[index], [field]: value };

    // Recalculate total inches when whole or fraction changes
    if (field.includes('whole') || field.includes('fraction')) {
      const measurement = newMeasurements[index];
      measurement.width_inches = convertToInches(
        measurement.width_whole,
        measurement.width_fraction
      );
      measurement.height_inches = convertToInches(
        measurement.height_whole,
        measurement.height_fraction
      );
    }

    setMeasurements(newMeasurements);
  };

  const openFractionModal = (index: number, field: string) => {
    setCurrentMeasurementIndex(index);
    setFractionField(field);
    setShowFractionModal(true);
  };

  const selectFraction = (value: number) => {
    if (currentMeasurementIndex >= 0) {
      updateMeasurement(currentMeasurementIndex, fractionField, value);
    }
    setShowFractionModal(false);
  };

  const handleSubmit = async () => {
    // Validation
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
      (m) => !m.window_type || m.width_inches === 0 || m.height_inches === 0
    );
    if (invalidMeasurement) {
      Alert.alert('Error', 'Please complete all measurements');
      return;
    }

    setLoading(true);
    try {
      const data = {
        field_expert_name: user?.name || '',
        customer_name: customerName,
        site_address: siteAddress,
        mobile_number: mobileNumber,
        measurements: measurements.map((m) => ({
          window_type: m.window_type,
          width_inches: m.width_inches,
          height_inches: m.height_inches,
          quantity: m.quantity,
        })),
      };

      await api.createEstimate(data);
      Alert.alert('Success', 'Measurement saved successfully', [
        { text: 'OK', onPress: () => router.replace('/field-expert') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save measurement');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Measurement</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>

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
              numberOfLines={3}
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

        {/* Measurements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Measurements</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={addMeasurement}
            >
              <Ionicons name="add" size={20} color="#ffffff" />
              <Text style={styles.addButtonText}>Add Window</Text>
            </TouchableOpacity>
          </View>

          {measurements.map((measurement, index) => (
            <View key={index} style={styles.measurementCard}>
              <View style={styles.measurementHeader}>
                <Text style={styles.measurementTitle}>
                  Window {index + 1}
                </Text>
                {measurements.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeMeasurement(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Window Type */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Window Type *</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => {
                    setCurrentMeasurementIndex(index);
                    setShowWindowTypeModal(true);
                  }}
                >
                  <Text
                    style={[
                      styles.selectButtonText,
                      !measurement.window_type && styles.placeholder,
                    ]}
                  >
                    {measurement.window_type || 'Select window type'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Width */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Width (Inches) *</Text>
                <View style={styles.measurementRow}>
                  <TextInput
                    style={[styles.input, styles.measurementInput]}
                    value={measurement.width_whole.toString()}
                    onChangeText={(text) =>
                      updateMeasurement(
                        index,
                        'width_whole',
                        parseInt(text) || 0
                      )
                    }
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#9ca3af"
                  />
                  <Text style={styles.measurementSeparator}>+</Text>
                  <TouchableOpacity
                    style={[styles.input, styles.fractionButton]}
                    onPress={() => openFractionModal(index, 'width_fraction')}
                  >
                    <Text style={styles.fractionText}>
                      {FRACTIONS.find((f) => f.value === measurement.width_fraction)
                        ?.label || '0'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.totalInches}>
                    = {measurement.width_inches.toFixed(2)}"
                  </Text>
                </View>
              </View>

              {/* Height */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Height (Inches) *</Text>
                <View style={styles.measurementRow}>
                  <TextInput
                    style={[styles.input, styles.measurementInput]}
                    value={measurement.height_whole.toString()}
                    onChangeText={(text) =>
                      updateMeasurement(
                        index,
                        'height_whole',
                        parseInt(text) || 0
                      )
                    }
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#9ca3af"
                  />
                  <Text style={styles.measurementSeparator}>+</Text>
                  <TouchableOpacity
                    style={[styles.input, styles.fractionButton]}
                    onPress={() =>
                      openFractionModal(index, 'height_fraction')
                    }
                  >
                    <Text style={styles.fractionText}>
                      {FRACTIONS.find(
                        (f) => f.value === measurement.height_fraction
                      )?.label || '0'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.totalInches}>
                    = {measurement.height_inches.toFixed(2)}"
                  </Text>
                </View>
              </View>

              {/* Quantity */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Quantity</Text>
                <View style={styles.quantityRow}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() =>
                      updateMeasurement(
                        index,
                        'quantity',
                        Math.max(1, measurement.quantity - 1)
                      )
                    }
                  >
                    <Ionicons name="remove" size={20} color="#ffffff" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{measurement.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() =>
                      updateMeasurement(
                        index,
                        'quantity',
                        measurement.quantity + 1
                      )
                    }
                  >
                    <Ionicons name="add" size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Area Display */}
              {measurement.width_inches > 0 && measurement.height_inches > 0 && (
                <View style={styles.areaDisplay}>
                  <Text style={styles.areaLabel}>Area:</Text>
                  <Text style={styles.areaValue}>
                    {((measurement.width_inches * measurement.height_inches) / 144).toFixed(3)} sq ft
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Saving...' : 'Save Measurement'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Window Type Modal */}
      <Modal
        visible={showWindowTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWindowTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Window Type</Text>
              <TouchableOpacity
                onPress={() => setShowWindowTypeModal(false)}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {windowTypes.map((type: any) => (
                <TouchableOpacity
                  key={type.id}
                  style={styles.modalItem}
                  onPress={() => {
                    updateMeasurement(
                      currentMeasurementIndex,
                      'window_type',
                      type.name
                    );
                    setShowWindowTypeModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{type.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Fraction Modal */}
      <Modal
        visible={showFractionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFractionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Fraction</Text>
              <TouchableOpacity
                onPress={() => setShowFractionModal(false)}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {FRACTIONS.map((fraction) => (
                <TouchableOpacity
                  key={fraction.label}
                  style={styles.modalItem}
                  onPress={() => selectFraction(fraction.value)}
                >
                  <Text style={styles.modalItemText}>{fraction.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  measurementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  selectButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#1f2937',
  },
  placeholder: {
    color: '#9ca3af',
  },
  measurementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementInput: {
    flex: 1,
  },
  measurementSeparator: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginHorizontal: 8,
  },
  fractionButton: {
    flex: 1,
    justifyContent: 'center',
  },
  fractionText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  totalInches: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    marginLeft: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    backgroundColor: '#2563eb',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginHorizontal: 24,
    minWidth: 40,
    textAlign: 'center',
  },
  areaDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  areaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  areaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalList: {
    padding: 16,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1f2937',
  },
});
