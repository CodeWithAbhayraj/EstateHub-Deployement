package com.example.deal.dto;

import com.example.deal.DealStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DealStatusUpdateRequest {

    @NotNull(message = "Deal status is required")
    private DealStatus status;
}