package com.example.commission;

import com.example.commission.dto.CommissionRequest;
import com.example.commission.dto.CommissionResponse;
import com.example.deal.Deal;
import com.example.deal.DealRepository;
import com.example.deal.DealStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommissionService {

    private final CommissionRepository commissionRepository;
    private final DealRepository dealRepository;

    // ===============================
    // CREATE COMMISSION
    // ===============================

    @Transactional
    public CommissionResponse createCommission(CommissionRequest request) {

        Deal deal = dealRepository.findById(request.getDealId())
                .orElseThrow(() ->
                        new RuntimeException("Deal not found")
                );

        // Commission only for completed deal
        if (deal.getStatus() != DealStatus.COMPLETED) {
            throw new RuntimeException(
                    "Commission can only be created for completed deal"
            );
        }

        // Prevent duplicate commission
        if (commissionRepository.existsByDealId(deal.getId())) {
            throw new RuntimeException(
                    "Commission already exists for this deal"
            );
        }

        BigDecimal dealAmount = deal.getDealAmount();

        BigDecimal commissionAmount = dealAmount
                .multiply(request.getCommissionPercentage())
                .divide(BigDecimal.valueOf(100));

        Commission commission = Commission.builder()
                .deal(deal)
                .type(request.getType())
                .dealAmount(dealAmount)
                .commissionPercentage(request.getCommissionPercentage())
                .commissionAmount(commissionAmount)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        Commission savedCommission =
                commissionRepository.save(commission);

        return mapToResponse(savedCommission);
    }

    // ===============================
    // GET ALL COMMISSIONS
    // ===============================

    public List<CommissionResponse> getAllCommissions() {

        return commissionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ===============================
    // GET COMMISSION BY ID
    // ===============================

    public CommissionResponse getCommissionById(Long id) {

        Commission commission = commissionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Commission not found")
                );

        return mapToResponse(commission);
    }

    // ===============================
    // GET COMMISSION BY DEAL ID
    // ===============================

    public CommissionResponse getCommissionByDealId(Long dealId) {

        Commission commission = commissionRepository
                .findByDealId(dealId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Commission not found for this deal"
                        )
                );

        return mapToResponse(commission);
    }

    // ===============================
    // UPDATE PAYMENT STATUS
    // ===============================

    @Transactional
    public CommissionResponse updatePaymentStatus(
            Long id,
            PaymentStatus paymentStatus
    ) {

        Commission commission = commissionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Commission not found")
                );

        commission.setPaymentStatus(paymentStatus);

        Commission updatedCommission =
                commissionRepository.save(commission);

        return mapToResponse(updatedCommission);
    }

    // ===============================
    // ENTITY → RESPONSE
    // ===============================

    private CommissionResponse mapToResponse(
            Commission commission
    ) {

        Deal deal = commission.getDeal();

        return CommissionResponse.builder()
                .id(commission.getId())
                .dealId(deal.getId())
                .leadId(deal.getLead().getId())
                .propertyId(deal.getLead().getProperty().getId())
                .propertyTitle(
                        deal.getLead().getProperty().getTitle()
                )
                .type(commission.getType())
                .dealAmount(commission.getDealAmount())
                .commissionPercentage(
                        commission.getCommissionPercentage()
                )
                .commissionAmount(
                        commission.getCommissionAmount()
                )
                .paymentStatus(
                        commission.getPaymentStatus()
                )
                .createdAt(commission.getCreatedAt())
                .updatedAt(commission.getUpdatedAt())
                .build();
    }
}