package com.anurag.aluminium.model;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    
    @JsonProperty("field_expert_name")
    private String fieldExpertName;
    
    @JsonProperty("customer_name")
    private String customerName;
    
    @JsonProperty("site_address")
    private String siteAddress;
    
    @JsonProperty("mobile_number")
    private String mobileNumber;
    
    private List<MeasurementItem> measurements;
    
    private Double subtotal = 0.0;
    private Double discount = 0.0;
    
    @JsonProperty("advance_received")
    private Double advanceReceived = 0.0;
    
    private Double cartage = 0.0;
    private Double total = 0.0;
    
    @JsonProperty("payment_status")
    private String paymentStatus = "pending"; // pending, partial, full
    
    @JsonProperty("created_by")
    private String createdBy; // "admin" or "field_expert"
    
    @JsonProperty("created_by_name")
    private String createdByName; // Name of the user who created it
    
    @JsonProperty("order_id")
    private String orderId; // Generated order ID for tracking
    
    @CreatedDate
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
}