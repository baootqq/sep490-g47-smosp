package com.sep490_g47.smosp.account;

import com.sep490_g47.smosp.account.dto.NotificationResponse;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    /**
     * Get all notifications for a specific user, ordered by most recent first.
     *
     * @param userId the user ID
     * @return the list of notifications
     */
    List<NotificationResponse> getNotifications(UUID userId);

    /**
     * Mark a specific notification as read.
     *
     * @param userId the user ID
     * @param notificationId the notification ID
     */
    void markAsRead(UUID userId, UUID notificationId);

    /**
     * Mark all unread notifications as read for a specific user.
     *
     * @param userId the user ID
     */
    void markAllAsRead(UUID userId);
}
