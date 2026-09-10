package com.example.visit.dto;

import com.example.visit.VisitStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VisitStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private VisitStatus status;

    private String remarks;
}