package com.anurag.aluminium.dto;

import com.anurag.aluminium.model.MeasurementItem;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstimateUpdateRequest {
    private List<MeasurementItem> measurements;
    private Double discount = 0.0;
    
    @JsonProperty("advance_received")
    private Double advanceReceived = 0.0;
    
    private Double cartage = 0.0;
    
    @JsonProperty("payment_status")
    private String paymentStatus = "pending";
}