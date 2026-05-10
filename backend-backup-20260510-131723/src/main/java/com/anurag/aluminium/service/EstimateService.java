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

@Service
@RequiredArgsConstructor
public class EstimateService {
    private final EstimateRepository estimateRepository;

    public Estimate createEstimate(EstimateRequest request) {
        Estimate estimate = new Estimate();
        estimate.setFieldExpertName(request.getFieldExpertName());
        estimate.setCustomerName(request.getCustomerName());
        estimate.setSiteAddress(request.getSiteAddress());
        estimate.setMobileNumber(request.getMobileNumber());

        // Calculate areas for measurements
        List<MeasurementItem> calculatedMeasurements = new ArrayList<>();
        for (MeasurementItem item : request.getMeasurements()) {
            MeasurementItem calculated = new MeasurementItem();
            calculated.setWindowType(item.getWindowType());
            calculated.setWidthInches(item.getWidthInches());
            calculated.setHeightInches(item.getHeightInches());
            calculated.setQuantity(item.getQuantity());
            calculated.setRate(null); // Field expert doesn't set rate
            
            // Calculate area in square feet
            double areaSqft = (item.getWidthInches() * item.getHeightInches()) / 144.0;
            calculated.setAreaSqft(Math.round(areaSqft * 1000.0) / 1000.0);
            calculated.setAmount(null);
            
            calculatedMeasurements.add(calculated);
        }

        estimate.setMeasurements(calculatedMeasurements);
        estimate.setSubtotal(0.0);
        estimate.setDiscount(0.0);
        estimate.setAdvanceReceived(0.0);
        estimate.setCartage(0.0);
        estimate.setTotal(0.0);
        estimate.setPaymentStatus("pending");
        estimate.setCreatedAt(LocalDateTime.now());
        estimate.setUpdatedAt(LocalDateTime.now());

        return estimateRepository.save(estimate);
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

        // Calculate amounts for measurements
        List<MeasurementItem> calculatedMeasurements = new ArrayList<>();
        double subtotal = 0.0;

        for (MeasurementItem item : request.getMeasurements()) {
            MeasurementItem calculated = new MeasurementItem();
            calculated.setWindowType(item.getWindowType());
            calculated.setWidthInches(item.getWidthInches());
            calculated.setHeightInches(item.getHeightInches());
            calculated.setQuantity(item.getQuantity());
            calculated.setRate(item.getRate());

            // Calculate area in square feet
            double areaSqft = (item.getWidthInches() * item.getHeightInches()) / 144.0;
            calculated.setAreaSqft(Math.round(areaSqft * 1000.0) / 1000.0);

            // Calculate amount if rate is set
            double amount = 0.0;
            if (item.getRate() != null) {
                amount = areaSqft * item.getRate() * item.getQuantity();
                subtotal += amount;
            }
            calculated.setAmount(Math.round(amount * 100.0) / 100.0);

            calculatedMeasurements.add(calculated);
        }

        double total = subtotal - request.getDiscount() + request.getCartage();

        estimate.setMeasurements(calculatedMeasurements);
        estimate.setSubtotal(Math.round(subtotal * 100.0) / 100.0);
        estimate.setDiscount(request.getDiscount());
        estimate.setAdvanceReceived(request.getAdvanceReceived());
        estimate.setCartage(request.getCartage());
        estimate.setTotal(Math.round(total * 100.0) / 100.0);
        estimate.setPaymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "pending");
        estimate.setUpdatedAt(LocalDateTime.now());

        return estimateRepository.save(estimate);
    }

    public void deleteEstimate(String id) {
        if (!estimateRepository.existsById(id)) {
            throw new RuntimeException("Estimate not found");
        }
        estimateRepository.deleteById(id);
    }
}