package com.anurag.aluminium.controller;

import com.anurag.aluminium.dto.FieldExpertRequest;
import com.anurag.aluminium.dto.FieldExpertResponse;
import com.anurag.aluminium.dto.FieldExpertUpdateRequest;
import com.anurag.aluminium.service.FieldExpertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/field-experts")
@Validated
@RequiredArgsConstructor
public class FieldExpertController {
    private static final Logger logger = LoggerFactory.getLogger(FieldExpertController.class);
    private final FieldExpertService fieldExpertService;

    @PostMapping
    public ResponseEntity<?> createFieldExpert(@Valid @RequestBody FieldExpertRequest request) {
        logger.info("Creating field expert: {}", request.getName());
        try {
            FieldExpertResponse response = fieldExpertService.createFieldExpert(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error creating field expert: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<FieldExpertResponse>> getAllFieldExperts() {
        return ResponseEntity.ok(fieldExpertService.getAllFieldExperts());
    }

    @GetMapping("/active")
    public ResponseEntity<List<FieldExpertResponse>> getActiveFieldExperts() {
        return ResponseEntity.ok(fieldExpertService.getActiveFieldExperts());
    }

    @GetMapping("/search")
    public ResponseEntity<List<FieldExpertResponse>> searchFieldExperts(@RequestParam String query) {
        return ResponseEntity.ok(fieldExpertService.searchFieldExperts(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFieldExpertById(@PathVariable String id) {
        try {
            FieldExpertResponse response = fieldExpertService.getFieldExpertById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFieldExpert(
            @PathVariable String id,
            @Valid @RequestBody FieldExpertUpdateRequest request) {
        try {
            FieldExpertResponse response = fieldExpertService.updateFieldExpert(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating field expert: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFieldExpert(@PathVariable String id) {
        try {
            fieldExpertService.deleteFieldExpert(id);
            return ResponseEntity.ok(Map.of("message", "Field Expert deleted successfully"));
        } catch (Exception e) {
            logger.error("Error deleting field expert: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateFieldExpert(@PathVariable String id) {
        try {
            FieldExpertResponse response = fieldExpertService.deactivateFieldExpert(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<?> activateFieldExpert(@PathVariable String id) {
        try {
            FieldExpertResponse response = fieldExpertService.activateFieldExpert(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
