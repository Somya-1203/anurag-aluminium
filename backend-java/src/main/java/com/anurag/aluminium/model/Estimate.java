package com.anurag.aluminium.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "estimates")
public class Estimate {
    @Id
    private String id;
    
    private String fieldExpertName;
    private String customerName;
    private String siteAddress;
    private String mobileNumber;
    
    private List<MeasurementItem> measurements;
    
    private Double subtotal = 0.0;
    private Double discount = 0.0;
    private Double advanceReceived = 0.0;
    private Double cartage = 0.0;
    private Double total = 0.0;
    
    private String paymentStatus = "pending"; // pending, partial, full
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}