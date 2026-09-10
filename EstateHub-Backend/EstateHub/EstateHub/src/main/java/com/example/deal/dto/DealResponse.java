package com.example.deal.dto;

import com.example.deal.DealStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class DealResponse {

    private Long id;

    private Long leadId;

    private Long propertyId;

    private String propertyTitle;

    private BigDecimal dealAmount;

    private BigDecimal commissionPercentage;

    private BigDecimal commissionAmount;

    private DealStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}