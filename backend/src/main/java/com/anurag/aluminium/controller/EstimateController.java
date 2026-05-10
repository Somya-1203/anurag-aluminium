package com.anurag.aluminium.controller;

import com.anurag.aluminium.dto.EstimateRequest;
import com.anurag.aluminium.dto.EstimateUpdateRequest;
import com.anurag.aluminium.model.Estimate;
import com.anurag.aluminium.service.EstimateService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estimates")
@RequiredArgsConstructor
public class EstimateController {
    private static final Logger logger = LoggerFactory.getLogger(EstimateController.class);
    private final EstimateService estimateService;

    @PostMapping
    public ResponseEntity<?> createEstimate(@RequestBody EstimateRequest request) {
        logger.info("Received createEstimate request: {}", request);
        try {
            Estimate estimate = estimateService.createEstimate(request);
            logger.info("Created estimate with id={}", estimate.getId());
            return ResponseEntity.ok(estimate);
        } catch (Exception e) {
            logger.error("createEstimate failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid estimate payload or missing required fields."));
        }
    }

    @GetMapping
    public ResponseEntity<List<Estimate>> getAllEstimates() {
        return ResponseEntity.ok(estimateService.getAllEstimates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estimate> getEstimateById(@PathVariable String id) {
        try {
            Estimate estimate = estimateService.getEstimateById(id);
            return ResponseEntity.ok(estimate);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estimate> updateEstimate(
            @PathVariable String id,
            @RequestBody EstimateUpdateRequest request) {
        try {
            Estimate estimate = estimateService.updateEstimate(id, request);
            return ResponseEntity.ok(estimate);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEstimate(@PathVariable String id) {
        try {
            estimateService.deleteEstimate(id);
            return ResponseEntity.ok(Map.of("message", "Estimate deleted"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}