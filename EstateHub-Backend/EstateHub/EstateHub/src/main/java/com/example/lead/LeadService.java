package com.example.lead;

import com.example.lead.dto.LeadRequest;
import com.example.lead.dto.LeadResponse;
import com.example.lead.dto.LeadStatusUpdateRequest;
import com.example.notification.NotificationService;
import com.example.notification.NotificationType;
import com.example.property.Property;
import com.example.property.PropertyRepository;
import com.example.property.PropertyStatus;
import com.example.user.Role;
import com.example.user.User;
import com.example.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    // Notification service
    private final NotificationService notificationService;


    // ==========================================
    // CREATE LEAD
    // ==========================================

    @Transactional
    public LeadResponse createLead(LeadRequest request) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Buyer not found")
                );

        // Only BUYER can create lead
        if (buyer.getRole() != Role.BUYER) {

            throw new RuntimeException(
                    "Only buyers can create leads"
            );
        }

        Property property = propertyRepository
                .findById(request.getPropertyId())
                .orElseThrow(() ->
                        new RuntimeException("Property not found")
                );

        // Lead only for published property
        if (property.getStatus() != PropertyStatus.PUBLISHED) {

            throw new RuntimeException(
                    "Lead can only be created for published property"
            );
        }

        Lead lead = Lead.builder()
                .buyer(buyer)
                .property(property)
                .budget(request.getBudget())
                .preferredVisitDate(
                        request.getPreferredVisitDate()
                )
                .message(request.getMessage())
                .status(LeadStatus.NEW)
                .build();

        Lead savedLead = leadRepository.save(lead);


        // ==========================================
        // NOTIFICATION - ADMIN
        // ==========================================

        List<User> admins = userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getRole() == Role.ADMIN ||
                                user.getRole() == Role.SUPER_ADMIN
                )
                .toList();

        String propertyTitle = property.getTitle();

        String message =
                "New lead created for property: "
                        + propertyTitle;

        for (User admin : admins) {

            notificationService.createNotification(
                    admin,
                    NotificationType.LEAD_CREATED,
                    message,
                    savedLead.getId()
            );
        }


        return mapToResponse(savedLead);
    }


    // ==========================================
    // ADMIN - GET ALL LEADS
    // ==========================================

    public List<LeadResponse> getAllLeads() {

        return leadRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // ==========================================
    // ADMIN - GET LEAD BY ID
    // ==========================================

    public LeadResponse getLeadById(Long id) {

        Lead lead = leadRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found")
                );

        return mapToResponse(lead);
    }


    // ==========================================
    // ADMIN - UPDATE LEAD STATUS
    // ==========================================

    @Transactional
    public LeadResponse updateLeadStatus(
            Long id,
            LeadStatusUpdateRequest request
    ) {

        Lead lead = leadRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found")
                );

        lead.setStatus(request.getStatus());
        lead.setRemarks(request.getRemarks());

        Lead updatedLead = leadRepository.save(lead);


        // ==========================================
        // NOTIFICATION - BUYER
        // ==========================================

        User buyer = lead.getBuyer();

        String propertyTitle =
                lead.getProperty().getTitle();

        String message =
                "Your lead for property '"
                        + propertyTitle
                        + "' has been updated to "
                        + request.getStatus();

        notificationService.createNotification(
                buyer,
                NotificationType.LEAD_UPDATED,
                message,
                updatedLead.getId()
        );


        return mapToResponse(updatedLead);
    }


    // ==========================================
    // ENTITY → RESPONSE
    // ==========================================

    private LeadResponse mapToResponse(Lead lead) {

        return LeadResponse.builder()
                .id(lead.getId())
                .propertyId(
                        lead.getProperty().getId()
                )
                .propertyTitle(
                        lead.getProperty().getTitle()
                )
                .budget(
                        lead.getBudget()
                )
                .preferredVisitDate(
                        lead.getPreferredVisitDate()
                )
                .message(
                        lead.getMessage()
                )
                .status(
                        lead.getStatus()
                )
                .remarks(
                        lead.getRemarks()
                )
                .createdAt(
                        lead.getCreatedAt()
                )
                .updatedAt(
                        lead.getUpdatedAt()
                )
                .build();
    }
}