package com.anurag.aluminium.dto;

import com.anurag.aluminium.model.MeasurementItem;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstimateRequest {
    @JsonProperty("field_expert_name")
    @NotBlank(message = "field_expert_name is required")
    private String fieldExpertName;
    
    @JsonProperty("customer_name")
    @NotBlank(message = "customer_name is required")
    private String customerName;
    
    @JsonProperty("site_address")
    @NotBlank(message = "site_address is required")
    private String siteAddress;
    
    @JsonProperty("mobile_number")
    @NotBlank(message = "mobile_number is required")
    private String mobileNumber;
    
    @Valid
    @NotEmpty(message = "measurements is required and must contain at least one item")
    private List<MeasurementItem> measurements;
}