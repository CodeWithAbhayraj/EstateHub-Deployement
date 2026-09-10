package com.example.notification;

import com.example.notification.dto.NotificationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;


    // =====================================================
    // GET MY NOTIFICATIONS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications() {

        return ResponseEntity.ok(
                notificationService.getMyNotifications()
                        .stream()
                        .map(this::mapToResponse)
                        .toList()
        );
    }


    // =====================================================
    // GET MY UNREAD NOTIFICATIONS
    // =====================================================

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>>
    getMyUnreadNotifications() {

        return ResponseEntity.ok(
                notificationService
                        .getMyUnreadNotifications()
                        .stream()
                        .map(this::mapToResponse)
                        .toList()
        );
    }


    // =====================================================
    // GET UNREAD COUNT
    // =====================================================

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount() {

        return ResponseEntity.ok(
                notificationService.getUnreadCount()
        );
    }


    // =====================================================
    // MARK ONE AS READ
    // =====================================================

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                mapToResponse(
                        notificationService.markAsRead(id)
                )
        );
    }


    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    @PatchMapping("/read-all")
    public ResponseEntity<String> markAllAsRead() {

        notificationService.markAllAsRead();

        return ResponseEntity.ok(
                "All notifications marked as read"
        );
    }


    // =====================================================
    // ENTITY → RESPONSE
    // =====================================================

    private NotificationResponse mapToResponse(
            Notification notification
    ) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .message(notification.getMessage())
                .referenceId(notification.getReferenceId())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }
}