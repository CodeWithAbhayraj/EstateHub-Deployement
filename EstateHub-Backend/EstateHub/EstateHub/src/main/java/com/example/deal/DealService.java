
package com.example.deal;

import com.example.deal.dto.DealRequest;
import com.example.deal.dto.DealResponse;
import com.example.deal.dto.DealStatusUpdateRequest;
import com.example.lead.Lead;
import com.example.lead.LeadRepository;
import com.example.lead.LeadStatus;
import com.example.notification.NotificationService;
import com.example.notification.NotificationType;
import com.example.user.Role;
import com.example.user.User;
import com.example.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DealService {

    private final DealRepository dealRepository;
    private final LeadRepository leadRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;


    // ==========================================
    // CREATE DEAL
    // ==========================================

    @Transactional
    public DealResponse createDeal(DealRequest request) {

        Lead lead = leadRepository.findById(request.getLeadId())
                .orElseThrow(() ->
                        new RuntimeException("Lead not found")
                );

        // Deal can only be created after lead is CLOSED
        if (lead.getStatus() != LeadStatus.CLOSED) {

            throw new RuntimeException(
                    "Deal can only be created for CLOSED lead"
            );
        }

        // Prevent duplicate deal
        if (dealRepository.existsByLeadId(request.getLeadId())) {

            throw new RuntimeException(
                    "Deal already exists for this lead"
            );
        }

        BigDecimal commissionAmount =
                calculateCommission(
                        request.getDealAmount(),
                        request.getCommissionPercentage()
                );

        Deal deal = Deal.builder()
                .lead(lead)
                .dealAmount(request.getDealAmount())
                .commissionPercentage(
                        request.getCommissionPercentage()
                )
                .commissionAmount(commissionAmount)
                .status(DealStatus.PENDING)
                .build();

        Deal savedDeal = dealRepository.save(deal);

        // ==========================================
        // AUTOMATIC DEAL CREATED NOTIFICATIONS
        // ==========================================

        Lead savedLead = savedDeal.getLead();

        User buyer = savedLead.getBuyer();
        User seller = savedLead.getProperty().getSeller();

        String propertyTitle =
                savedLead.getProperty().getTitle();

        String message =
                "Deal created for property: "
                        + propertyTitle
                        + ". Deal amount: ₹"
                        + savedDeal.getDealAmount();

        // Buyer notification
        notificationService.createNotification(
                buyer,
                NotificationType.DEAL_CREATED,
                message,
                savedDeal.getId()
        );

        // Seller notification
        notificationService.createNotification(
                seller,
                NotificationType.DEAL_CREATED,
                message,
                savedDeal.getId()
        );

        // Admin / Broker notifications
        List<User> admins =
                userRepository.findAll()
                        .stream()
                        .filter(user ->
                                user.getRole() == Role.ADMIN
                        )
                        .toList();

        for (User admin : admins) {

            notificationService.createNotification(
                    admin,
                    NotificationType.DEAL_CREATED,
                    message,
                    savedDeal.getId()
            );
        }

        return mapToResponse(savedDeal);
    }


    // ==========================================
    // GET ALL DEALS
    // ==========================================

    @Transactional(readOnly = true)
    public List<DealResponse> getAllDeals() {

        return dealRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // ==========================================
    // GET DEAL BY ID
    // ==========================================

    @Transactional(readOnly = true)
    public DealResponse getDealById(Long id) {

        Deal deal = dealRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Deal not found")
                );

        return mapToResponse(deal);
    }


    // ==========================================
    // UPDATE DEAL STATUS
    // ==========================================

    @Transactional
    public DealResponse updateDealStatus(
            Long id,
            DealStatusUpdateRequest request
    ) {

        Deal deal = dealRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Deal not found")
                );

        DealStatus oldStatus = deal.getStatus();

        deal.setStatus(request.getStatus());

        Deal updatedDeal = dealRepository.save(deal);

        // ==========================================
        // AUTOMATIC DEAL UPDATED NOTIFICATIONS
        // ==========================================

        Lead lead = updatedDeal.getLead();

        User buyer = lead.getBuyer();
        User seller = lead.getProperty().getSeller();

        String propertyTitle =
                lead.getProperty().getTitle();

        String message =
                "Deal status updated for property: "
                        + propertyTitle
                        + ". Status changed from "
                        + oldStatus
                        + " to "
                        + updatedDeal.getStatus();

        // Buyer notification
        notificationService.createNotification(
                buyer,
                NotificationType.DEAL_UPDATED,
                message,
                updatedDeal.getId()
        );

        // Seller notification
        notificationService.createNotification(
                seller,
                NotificationType.DEAL_UPDATED,
                message,
                updatedDeal.getId()
        );

        // Admin / Broker notifications
        List<User> admins =
                userRepository.findAll()
                        .stream()
                        .filter(user ->
                                user.getRole() == Role.ADMIN
                        )
                        .toList();

        for (User admin : admins) {

            notificationService.createNotification(
                    admin,
                    NotificationType.DEAL_UPDATED,
                    message,
                    updatedDeal.getId()
            );
        }

        return mapToResponse(updatedDeal);
    }


    // ==========================================
    // CALCULATE COMMISSION
    // ==========================================

    private BigDecimal calculateCommission(
            BigDecimal dealAmount,
            BigDecimal commissionPercentage
    ) {

        return dealAmount
                .multiply(commissionPercentage)
                .divide(
                        BigDecimal.valueOf(100),
                        2,
                        RoundingMode.HALF_UP
                );
    }


    // ==========================================
    // ENTITY → RESPONSE
    // ==========================================

    private DealResponse mapToResponse(Deal deal) {

        Lead lead = deal.getLead();

        return DealResponse.builder()
                .id(deal.getId())
                .leadId(lead.getId())
                .propertyId(
                        lead.getProperty().getId()
                )
                .propertyTitle(
                        lead.getProperty().getTitle()
                )
                .dealAmount(
                        deal.getDealAmount()
                )
                .commissionPercentage(
                        deal.getCommissionPercentage()
                )
                .commissionAmount(
                        deal.getCommissionAmount()
                )
                .status(
                        deal.getStatus()
                )
                .createdAt(
                        deal.getCreatedAt()
                )
                .updatedAt(
                        deal.getUpdatedAt()
                )
                .build();
    }
}
