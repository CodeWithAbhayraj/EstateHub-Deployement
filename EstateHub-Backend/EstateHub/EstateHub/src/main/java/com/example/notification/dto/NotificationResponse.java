package com.example.notification.dto;

import com.example.notification.NotificationType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class NotificationResponse {

    private Long id;

    private NotificationType type;

    private String message;

    private Long referenceId;

    private Boolean isRead;

    private LocalDateTime createdAt;

    private LocalDateTime readAt;
}