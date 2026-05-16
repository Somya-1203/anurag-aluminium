package com.anurag.aluminium.repository;

import com.anurag.aluminium.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByAdminIdOrderByCreatedAtDesc(String adminId);
    List<Notification> findByAdminIdAndIsReadOrderByCreatedAtDesc(String adminId, Boolean isRead);
    long countByAdminIdAndIsRead(String adminId, Boolean isRead);
}
