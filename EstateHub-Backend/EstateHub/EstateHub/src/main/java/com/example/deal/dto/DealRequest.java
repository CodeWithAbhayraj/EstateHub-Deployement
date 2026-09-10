package com.example.deal.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class DealRequest {

    @NotNull(message = "Lead ID is required")
    private Long leadId;

    @NotNull(message = "Deal amount is required")
    @DecimalMin(
            value = "1.00",
            message = "Deal amount must be greater than 0"
    )
    private BigDecimal dealAmount;

    @NotNull(message = "Commission percentage is required")
    @DecimalMin(
            value = "0.01",
            message = "Commission percentage must be greater than 0"
    )
    @DecimalMax(
            value = "100.00",
            message = "Commission percentage cannot exceed 100"
    )
    private BigDecimal commissionPercentage;
}