package com.anurag.aluminium.controller;

import com.anurag.aluminium.model.Notification;
import com.anurag.aluminium.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable String adminId) {
        return ResponseEntity.ok(notificationService.getNotifications(adminId));
    }

    @GetMapping("/admin/{adminId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable String adminId) {
        long count = notificationService.getUnreadCount(adminId);
        return ResponseEntity.ok(Map.of("unread_count", count));
    }

    @PutMapping("/{id}/mark-read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        try {
            Notification notification = notificationService.markAsRead(id);
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
