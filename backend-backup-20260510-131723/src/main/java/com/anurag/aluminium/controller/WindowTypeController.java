package com.anurag.aluminium.controller;

import com.anurag.aluminium.dto.WindowTypeRequest;
import com.anurag.aluminium.model.WindowType;
import com.anurag.aluminium.service.WindowTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/window-types")
@RequiredArgsConstructor
public class WindowTypeController {
    private final WindowTypeService windowTypeService;

    @GetMapping
    public ResponseEntity<List<WindowType>> getAllWindowTypes() {
        return ResponseEntity.ok(windowTypeService.getAllWindowTypes());
    }

    @PostMapping
    public ResponseEntity<WindowType> createWindowType(@RequestBody WindowTypeRequest request) {
        try {
            WindowType windowType = windowTypeService.createWindowType(request.getName());
            return ResponseEntity.ok(windowType);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteWindowType(@PathVariable String id) {
        try {
            windowTypeService.deleteWindowType(id);
            return ResponseEntity.ok(Map.of("message", "Window type deleted"));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}