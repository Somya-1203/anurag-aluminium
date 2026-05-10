package com.anurag.aluminium.repository;

import com.anurag.aluminium.model.WindowType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WindowTypeRepository extends MongoRepository<WindowType, String> {
    Optional<WindowType> findByName(String name);
    boolean existsByName(String name);
}