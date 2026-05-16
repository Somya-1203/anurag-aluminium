import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { generateEstimatePDF } from '../../utils/pdfGenerator';

export default function EditEstimate() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const estimateId = params.id as string;

  const [estimate, setEstimate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [defaultRate, setDefaultRate] = useState(100);
  const [companySettings, setCompanySettings] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadEstimate();
    loadSettings();
  }, []);

  const loadEstimate = async () => {
    try {
      const data = await api.getEstimate(estimateId);
      setEstimate(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load estimate');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await api.getSettings();
      setDefaultRate(settings.default_rate ?? 100);
      setCompanySettings(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateMeasurementRate = (index: number, rate: string) => {
    const rateNum = parseFloat(rate) || 0;
    const newMeasurements = [...estimate.measurements];
    newMeasurements[index].rate = rateNum;
    setEstimate({ ...estimate, measurements: newMeasurements });
  };

  const applyDefaultRateToAll = () => {
    const newMeasurements = estimate.measurements.map((m: any) => ({
      ...m,
      rate: defaultRate,
    }));
    setEstimate({ ...estimate, measurements: newMeasurements });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        measurements: estimate.measurements,
        discount: parseFloat(estimate.discount) || 0,
        advance_received: parseFloat(estimate.advance_received) || 0,
        cartage: parseFloat(estimate.cartage) || 0,
        payment_status: estimate.payment_status,
      };

      await api.updateEstimate(estimateId, data);
      Alert.alert('Success', 'Estimate updated successfully');
      await loadEstimate();
    } catch (error) {
      Alert.alert('Error', 'Failed to update estimate');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const generateAndSharePDF = async () => {
    if (!estimate) return;

    setGeneratingPDF(true);
    try {
      // Generate HTML
      const htmlContent = generateEstimatePDF(estimate, companySettings);

      // Create PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      if (Platform.OS === 'web') {
        // On web, just download the PDF
        Alert.alert('Success', 'PDF generated successfully. Check your downloads folder.');
      } else {
        // On mobile, use sharing
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share Estimate PDF',
            UTI: 'com.adobe.pdf',
          });
        } else {
          Alert.alert('Error', 'Sharing is not available on this device');
        }
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!estimate) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Estimate not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Estimate</Text>
        <TouchableOpacity
          onPress={generateAndSharePDF}
          disabled={generatingPDF}
        >
          {generatingPDF ? (
            <ActivityIndicator size="small" color="#2563eb" />
          ) : (
            <Ionicons name="share-outline" size={24} color="#2563eb" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Customer Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{estimate.customer_name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{estimate.site_address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mobile:</Text>
            <Text style={styles.infoValue}>{estimate.mobile_number}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Field Expert:</Text>
            <Text style={styles.infoValue}>{estimate.field_expert_name}</Text>
          </View>
        </View>

        {/* Rate Management */}
        <View style={styles.card}>
          <View style={styles.rateHeader}>
            <Text style={styles.cardTitle}>Set Rates</Text>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyDefaultRateToAll}
            >
              <Text style={styles.applyButtonText}>
                Apply ₹{defaultRate}/sq ft to All
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Measurements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Measurements</Text>
          {estimate.measurements.map((m: any, index: number) => (
            <View key={index} style={styles.measurementItem}>
              <View style={styles.measurementHeader}>
                <Text style={styles.measurementTitle}>
                  {index + 1}. {m.window_type}
                </Text>
              </View>
              <View style={styles.measurementDetails}>
                <Text style={styles.measurementText}>
                  Width: {m.width_inches.toFixed(2)}" × Height:{' '}
                  {m.height_inches.toFixed(2)}"
                </Text>
                <Text style={styles.measurementText}>
                  Area: {m.area_sqft.toFixed(3)} sq ft × Qty: {m.quantity}
                </Text>
              </View>
              <View style={styles.rateInput}>
                <Text style={styles.rateLabel}>Rate per sq ft (₹):</Text>
                <TextInput
                  style={styles.input}
                  value={m.rate?.toString() || ''}
                  onChangeText={(text) => updateMeasurementRate(index, text)}
                  placeholder="Enter rate"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              {m.rate && (
                <View style={styles.amountDisplay}>
                  <Text style={styles.amountLabel}>Amount:</Text>
                  <Text style={styles.amountValue}>
                    ₹ {(m.area_sqft * m.rate * m.quantity).toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Additional Charges */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Additional Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Discount (₹)</Text>
            <TextInput
              style={styles.input}
              value={estimate.discount != null && estimate.discount !== 0 ? estimate.discount.toString() : ''}
              onChangeText={(text) =>
                setEstimate({ ...estimate, discount: text })
              }
              placeholder="Enter discount"
              keyboardType="decimal-pad"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cartage (₹)</Text>
            <TextInput
              style={styles.input}
              value={estimate.cartage != null && estimate.cartage !== 0 ? estimate.cartage.toString() : ''}
              onChangeText={(text) =>
                setEstimate({ ...estimate, cartage: text })
              }
              placeholder="Enter cartage"
              keyboardType="decimal-pad"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Advance Received (₹)</Text>
            <TextInput
              style={styles.input}
              value={estimate.advance_received != null && estimate.advance_received !== 0 ? estimate.advance_received.toString() : ''}
              onChangeText={(text) =>
                setEstimate({ ...estimate, advance_received: text })
              }
              placeholder="Enter advance amount"
              keyboardType="decimal-pad"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Payment Status</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text style={styles.selectButtonText}>
                {estimate.payment_status === 'full'
                  ? 'Paid'
                  : estimate.payment_status === 'partial'
                  ? 'Partial'
                  : 'Pending'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pdfButton, generatingPDF && styles.pdfButtonDisabled]}
            onPress={generateAndSharePDF}
            disabled={generatingPDF}
          >
            <Ionicons name="document-text" size={20} color="#ffffff" />
            <Text style={styles.pdfButtonText}>
              {generatingPDF ? 'Generating...' : 'Generate & Share PDF'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Payment Status Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment Status</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalList}>
              {['pending', 'partial', 'full'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={styles.modalItem}
                  onPress={() => {
                    setEstimate({ ...estimate, payment_status: status });
                    setShowPaymentModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>
                    {status === 'full'
                      ? 'Paid'
                      : status === 'partial'
                      ? 'Partial'
                      : 'Pending'}
                  </Text>
                  {estimate.payment_status === status && (
                    <Ionicons name="checkmark" size={24} color="#2563eb" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  applyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  measurementItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 12,
  },
  measurementHeader: {
    marginBottom: 8,
  },
  measurementTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  measurementDetails: {
    marginBottom: 8,
  },
  measurementText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  rateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 12,
    width: 120,
  },
  input: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    color: '#1f2937',
  },
  amountDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
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
  selectButton: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 14,
    color: '#1f2937',
  },
  buttonContainer: {
    padding: 16,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  pdfButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfButtonDisabled: {
    opacity: 0.6,
  },
  pdfButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1f2937',
  },
});