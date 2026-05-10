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
public class EstimateRequest {
    @JsonProperty("field_expert_name")
    private String fieldExpertName;
    
    @JsonProperty("customer_name")
    private String customerName;
    
    @JsonProperty("site_address")
    private String siteAddress;
    
    @JsonProperty("mobile_number")
    private String mobileNumber;
    
    private List<MeasurementItem> measurements;
}