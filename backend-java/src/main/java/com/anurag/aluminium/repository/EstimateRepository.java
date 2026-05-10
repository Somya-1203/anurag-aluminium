package com.anurag.aluminium.repository;

import com.anurag.aluminium.model.Estimate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EstimateRepository extends MongoRepository<Estimate, String> {
    List<Estimate> findByFieldExpertName(String fieldExpertName);
    List<Estimate> findByCustomerNameContainingIgnoreCase(String customerName);
}