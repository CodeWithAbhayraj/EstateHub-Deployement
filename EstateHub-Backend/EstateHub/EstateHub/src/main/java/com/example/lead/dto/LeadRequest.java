package com.example.lead.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class LeadRequest {

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotBlank(message = "Budget is required")
    private String budget;

    @NotNull(message = "Preferred visit date is required")
    private LocalDate preferredVisitDate;

    @NotBlank(message = "Message is required")
    private String message;
}