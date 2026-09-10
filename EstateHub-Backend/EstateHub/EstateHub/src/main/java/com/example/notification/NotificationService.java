package com.example.notification;

import com.example.user.User;
import com.example.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;


    // =====================================================
    // CREATE NOTIFICATION
    // =====================================================

    @Transactional
    public Notification createNotification(
            User user,
            NotificationType type,
            String message,
            Long referenceId
    ) {

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }


    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }


    // =====================================================
    // GET MY NOTIFICATIONS
    // =====================================================

    @Transactional(readOnly = true)
    public List<Notification> getMyNotifications() {

        User user = getLoggedInUser();

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId());
    }


    // =====================================================
    // GET MY UNREAD NOTIFICATIONS
    // =====================================================

    @Transactional(readOnly = true)
    public List<Notification> getMyUnreadNotifications() {

        User user = getLoggedInUser();

        return notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(
                        user.getId()
                );
    }


    // =====================================================
    // GET UNREAD COUNT
    // =====================================================

    @Transactional(readOnly = true)
    public long getUnreadCount() {

        User user = getLoggedInUser();

        return notificationRepository
                .countByUserIdAndIsReadFalse(user.getId());
    }


    // =====================================================
    // MARK NOTIFICATION AS READ
    // =====================================================

    @Transactional
    public Notification markAsRead(Long notificationId) {

        User user = getLoggedInUser();

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        // User can mark only their own notification
        if (!notification.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to access this notification"
            );
        }

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());

        return notificationRepository.save(notification);
    }


    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    @Transactional
    public void markAllAsRead() {

        User user = getLoggedInUser();

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(
                                user.getId()
                        );

        LocalDateTime now = LocalDateTime.now();

        for (Notification notification : notifications) {

            notification.setIsRead(true);
            notification.setReadAt(now);
        }

        notificationRepository.saveAll(notifications);
    }
}