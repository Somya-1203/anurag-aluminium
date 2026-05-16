package com.anurag.aluminium.service;

import com.anurag.aluminium.model.Notification;
import com.anurag.aluminium.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public Notification createNotification(String adminId, String type, String title, String message, String estimateId, String fieldExpertName, String customerName) {
        Notification notification = new Notification();
        notification.setAdminId(adminId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setEstimateId(estimateId);
        notification.setFieldExpertName(fieldExpertName);
        notification.setCustomerName(customerName);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(String adminId) {
        return notificationRepository.findByAdminIdOrderByCreatedAtDesc(adminId);
    }

    public long getUnreadCount(String adminId) {
        return notificationRepository.countByAdminIdAndIsRead(adminId, false);
    }

    public Notification markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }
}
