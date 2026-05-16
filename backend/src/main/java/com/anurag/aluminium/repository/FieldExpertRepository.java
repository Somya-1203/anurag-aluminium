package com.anurag.aluminium.repository;

import com.anurag.aluminium.model.FieldExpert;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FieldExpertRepository extends MongoRepository<FieldExpert, String> {
    Optional<FieldExpert> findByName(String name);
    Optional<FieldExpert> findByUserId(String userId);
    Optional<FieldExpert> findByPhone(String phone);
    Optional<FieldExpert> findByEmail(String email);
    List<FieldExpert> findByIsActive(Boolean isActive);
    List<FieldExpert> findByNameContainingIgnoreCase(String name);
}
