package com.example.lead.followup.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class LeadFollowUpResponse {

    private Long id;

    private Long leadId;

    private LocalDate followUpDate;

    private String note;

    private LocalDate nextFollowUpDate;

    private LocalDateTime createdAt;
}