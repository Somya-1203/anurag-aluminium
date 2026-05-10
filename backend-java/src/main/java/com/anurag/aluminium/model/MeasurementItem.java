package com.anurag.aluminium.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeasurementItem {
    private String windowType;
    private Double widthInches;
    private Double heightInches;
    private Integer quantity;
    private Double rate; // Rate per sq ft
    private Double areaSqft; // Calculated area
    private Double amount; // Calculated amount
}