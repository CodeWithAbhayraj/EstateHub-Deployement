package com.example.visit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class VisitRequest {

    @NotNull(message = "Lead ID is required")
    private Long leadId;

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotNull(message = "Visit date is required")
    private LocalDate visitDate;

    @NotBlank(message = "Visit time is required")
    private String visitTime;

    private String remarks;
}