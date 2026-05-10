package com.anurag.aluminium.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeasurementItem {
    @JsonProperty("window_type")
    private String windowType;
    
    @JsonProperty("width_inches")
    private Double widthInches;
    
    @JsonProperty("height_inches")
    private Double heightInches;
    
    private Integer quantity;
    private Double rate; // Rate per sq ft
    
    @JsonProperty("area_sqft")
    private Double areaSqft; // Calculated area
    
    private Double amount; // Calculated amount
}