package com.anurag.aluminium.repository;

import com.anurag.aluminium.model.Estimate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EstimateRepository extends MongoRepository<Estimate, String> {
    List<Estimate> findByFieldExpertName(String fieldExpertName);
    List<Estimate> findByCustomerNameContainingIgnoreCase(String customerName);
    List<Estimate> findByOrderIdContainingIgnoreCase(String orderId);
    List<Estimate> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Estimate> findByPaymentStatus(String paymentStatus);
    
    @Query("{ 'customer_name': { $regex: ?0, $options: 'i' } }")
    List<Estimate> searchByCustomerName(String customerName);
    
    @Query("{ 'mobile_number': ?0 }")
    List<Estimate> findByMobileNumber(String mobileNumber);
    
    @Query("{ 'field_expert_name': ?0, 'created_at': { $gte: ?1, $lte: ?2 } }")
    List<Estimate> findByFieldExpertNameAndDateRange(String fieldExpertName, LocalDateTime startDate, LocalDateTime endDate);
}