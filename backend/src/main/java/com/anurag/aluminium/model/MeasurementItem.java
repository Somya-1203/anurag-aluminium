package com.anurag.aluminium.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeasurementItem {
    @JsonProperty("window_type")
    @NotBlank(message = "window_type is required")
    private String windowType;
    
    @JsonProperty("width_inches")
    @NotNull(message = "width_inches is required")
    @Min(value = 1, message = "width_inches must be greater than 0")
    private Double widthInches;
    
    @JsonProperty("height_inches")
    @NotNull(message = "height_inches is required")
    @Min(value = 1, message = "height_inches must be greater than 0")
    private Double heightInches;
    
    @NotNull(message = "quantity is required")
    @Min(value = 1, message = "quantity must be greater than 0")
    private Integer quantity;
    private Double rate; // Rate per sq ft
    
    @JsonProperty("area_sqft")
    private Double areaSqft; // Calculated area
    
    private Double amount; // Calculated amount
}