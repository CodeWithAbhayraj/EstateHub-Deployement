package com.example.commission.dto;

import com.example.commission.CommissionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CommissionRequest {

    @NotNull(message = "Deal ID is required")
    private Long dealId;

    @NotNull(message = "Commission type is required")
    private CommissionType type;

    @NotNull(message = "Commission percentage is required")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Commission percentage must be greater than 0")
    private BigDecimal commissionPercentage;
}