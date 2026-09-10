package com.example.lead.followup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class LeadFollowUpRequest {

    @NotNull(message = "Follow-up date is required")
    private LocalDate followUpDate;

    @NotBlank(message = "Note is required")
    private String note;

    private LocalDate nextFollowUpDate;
}