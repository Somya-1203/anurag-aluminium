package com.anurag.aluminium.service;

import com.anurag.aluminium.dto.EstimateRequest;
import com.anurag.aluminium.dto.EstimateUpdateRequest;
import com.anurag.aluminium.model.Estimate;
import com.anurag.aluminium.model.MeasurementItem;
import com.anurag.aluminium.repository.EstimateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EstimateService {
    private final EstimateRepository estimateRepository;
    private final SettingsService settingsService;
    private final FieldExpertService fieldExpertService;
    private final NotificationService notificationService;

    public Estimate createEstimate(EstimateRequest request) {
        Estimate estimate = new Estimate();
        estimate.setFieldExpertName(request.getFieldExpertName());
        estimate.setCustomerName(request.getCustomerName());
        estimate.setSiteAddress(request.getSiteAddress());
        estimate.setMobileNumber(request.getMobileNumber());

        String createdBy = request.getCreatedBy() != null ? request.getCreatedBy() : "field_expert";
        String createdByName = request.getCreatedByName() != null ? request.getCreatedByName() : request.getFieldExpertName();
        estimate.setCreatedBy(createdBy);
        estimate.setCreatedByName(createdByName);
        estimate.setOrderId(generateOrderId());

        Double defaultRateObj = settingsService.getSettings().getDefaultRate();
        double defaultRate = (defaultRateObj == null || defaultRateObj <= 0) ? 100.0 : defaultRateObj;

        List<MeasurementItem> calculatedMeasurements = new ArrayList<>();
        double subtotal = 0.0;

        for (MeasurementItem item : request.getMeasurements()) {
            MeasurementItem calculated = new MeasurementItem();
            calculated.setWindowType(item.getWindowType());
            calculated.setWidthInches(item.getWidthInches());
            calculated.setHeightInches(item.getHeightInches());
            calculated.setQuantity(item.getQuantity());
            double rate = item.getRate() != null && item.getRate() > 0 ? item.getRate() : defaultRate;
            calculated.setRate(rate);

            double areaSqft = (item.getWidthInches() * item.getHeightInches()) / 144.0;
            calculated.setAreaSqft(Math.round(areaSqft * 1000.0) / 1000.0);
            double amount = areaSqft * rate * item.getQuantity();
            calculated.setAmount(Math.round(amount * 100.0) / 100.0);
            subtotal += amount;
            calculatedMeasurements.add(calculated);
        }

        double discount = request.getDiscount() != null ? request.getDiscount() : 0.0;
        double advanceReceived = request.getAdvanceReceived() != null ? request.getAdvanceReceived() : 0.0;
        double cartage = request.getCartage() != null ? request.getCartage() : 0.0;
        double total = subtotal - discount + cartage;

        estimate.setMeasurements(calculatedMeasurements);
        estimate.setSubtotal(Math.round(subtotal * 100.0) / 100.0);
        estimate.setDiscount(discount);
        estimate.setAdvanceReceived(advanceReceived);
        estimate.setCartage(cartage);
        estimate.setTotal(Math.round(total * 100.0) / 100.0);
        estimate.setPaymentStatus("pending");
        estimate.setCreatedAt(LocalDateTime.now());
        estimate.setUpdatedAt(LocalDateTime.now());

        Estimate savedEstimate = estimateRepository.save(estimate);

        if ("field_expert".equalsIgnoreCase(createdBy)) {
            fieldExpertService.incrementEstimateCount(request.getFieldExpertName());
            notificationService.createNotification(
                    "admin",
                    "estimate_created",
                    "New Estimate Added",
                    String.format("Field Expert %s added an estimate for %s.", request.getFieldExpertName(), request.getCustomerName()),
                    savedEstimate.getId(),
                    request.getFieldExpertName(),
                    request.getCustomerName()
            );
        }

        return savedEstimate;
    }

    public List<Estimate> getAllEstimates() {
        return estimateRepository.findAll();
    }

    public Estimate getEstimateById(String id) {
        return estimateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estimate not found"));
    }

    public Estimate updateEstimate(String id, EstimateUpdateRequest request) {
        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estimate not found"));

        if (request.getFieldExpertName() != null) {
            estimate.setFieldExpertName(request.getFieldExpertName());
        }
        if (request.getCustomerName() != null) {
            estimate.setCustomerName(request.getCustomerName());
        }
        if (request.getSiteAddress() != null) {
            estimate.setSiteAddress(request.getSiteAddress());
        }
        if (request.getMobileNumber() != null) {
            estimate.setMobileNumber(request.getMobileNumber());
        }

        Double defaultRateObj = settingsService.getSettings().getDefaultRate();
        double defaultRate = (defaultRateObj == null || defaultRateObj <= 0) ? 100.0 : defaultRateObj;

        List<MeasurementItem> calculatedMeasurements = new ArrayList<>();
        double subtotal = 0.0;

        for (MeasurementItem item : request.getMeasurements()) {
            MeasurementItem calculated = new MeasurementItem();
            calculated.setWindowType(item.getWindowType());
            calculated.setWidthInches(item.getWidthInches());
            calculated.setHeightInches(item.getHeightInches());
            calculated.setQuantity(item.getQuantity());
            double rate = item.getRate() != null && item.getRate() > 0 ? item.getRate() : defaultRate;
            calculated.setRate(rate);

            double areaSqft = (item.getWidthInches() * item.getHeightInches()) / 144.0;
            calculated.setAreaSqft(Math.round(areaSqft * 1000.0) / 1000.0);
            double amount = areaSqft * rate * item.getQuantity();
            calculated.setAmount(Math.round(amount * 100.0) / 100.0);
            subtotal += amount;

            calculatedMeasurements.add(calculated);
        }

        double discount = request.getDiscount() != null ? request.getDiscount() : estimate.getDiscount();
        double advanceReceived = request.getAdvanceReceived() != null ? request.getAdvanceReceived() : estimate.getAdvanceReceived();
        double cartage = request.getCartage() != null ? request.getCartage() : estimate.getCartage();
        double total = subtotal - discount + cartage;

        estimate.setMeasurements(calculatedMeasurements);
        estimate.setSubtotal(Math.round(subtotal * 100.0) / 100.0);
        estimate.setDiscount(discount);
        estimate.setAdvanceReceived(advanceReceived);
        estimate.setCartage(cartage);
        estimate.setTotal(Math.round(total * 100.0) / 100.0);
        estimate.setPaymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : estimate.getPaymentStatus());
        estimate.setUpdatedAt(LocalDateTime.now());

        return estimateRepository.save(estimate);
    }

    private String generateOrderId() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public void deleteEstimate(String id) {
        if (!estimateRepository.existsById(id)) {
            throw new RuntimeException("Estimate not found");
        }
        estimateRepository.deleteById(id);
    }

    public List<Estimate> getEstimatesByDate(LocalDateTime startDate, LocalDateTime endDate) {
        return estimateRepository.findByCreatedAtBetween(startDate, endDate);
    }

    public List<Estimate> getEstimatesByPaymentStatus(String status) {
        return estimateRepository.findByPaymentStatus(status);
    }

    public List<Estimate> searchEstimates(String query) {
        List<Estimate> byCustomer = estimateRepository.searchByCustomerName(query);
        List<Estimate> byOrderId = estimateRepository.findByOrderIdContainingIgnoreCase(query);
        List<Estimate> byPhone = estimateRepository.findByMobileNumber(query);
        List<Estimate> byFieldExpert = estimateRepository.findByFieldExpertName(query);
        
        List<Estimate> results = new ArrayList<>();
        results.addAll(byCustomer);
        results.addAll(byOrderId);
        results.addAll(byPhone);
        results.addAll(byFieldExpert);
        
        return results;
    }

    public List<Estimate> getEstimatesByFieldExpertAndDate(String fieldExpertName, LocalDateTime startDate, LocalDateTime endDate) {
        return estimateRepository.findByFieldExpertNameAndDateRange(fieldExpertName, startDate, endDate);
    }

    public List<Estimate> getEstimatesByFieldExpertName(String fieldExpertName) {
        return estimateRepository.findByFieldExpertName(fieldExpertName);
    }
}