package com.example.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private long totalProperties;

    private long pendingProperties;

    private long approvedProperties;

    private long rejectedProperties;

    private long totalLeads;

    private long pendingLeads;

    private long totalVisits;

    private long completedVisits;

    private long totalDeals;

    private long closedDeals;

    private double totalCommission;

    private double paidCommission;

    private double pendingCommission;
}