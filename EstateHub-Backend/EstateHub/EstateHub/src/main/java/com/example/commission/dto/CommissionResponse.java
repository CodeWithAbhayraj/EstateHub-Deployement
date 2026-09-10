package com.example.commission.dto;

import com.example.commission.CommissionType;
import com.example.commission.PaymentStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class CommissionResponse {

    private Long id;

    private Long dealId;

    private Long leadId;

    private Long propertyId;

    private String propertyTitle;

    private CommissionType type;

    private BigDecimal dealAmount;

    private BigDecimal commissionPercentage;

    private BigDecimal commissionAmount;

    private PaymentStatus paymentStatus;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}