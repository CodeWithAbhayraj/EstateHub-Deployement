package com.example.visit.dto;

import com.example.visit.VisitStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class VisitResponse {

    private Long id;

    private Long leadId;

    private Long propertyId;

    private Long buyerId;

    private LocalDate visitDate;

    private String visitTime;

    private VisitStatus status;

    private String remarks;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}