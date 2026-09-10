
package com.example.visit;

import com.example.lead.Lead;
import com.example.lead.LeadRepository;
import com.example.notification.NotificationService;
import com.example.notification.NotificationType;
import com.example.property.Property;
import com.example.property.PropertyRepository;
import com.example.user.Role;
import com.example.user.User;
import com.example.user.UserRepository;
import com.example.visit.dto.VisitRequest;
import com.example.visit.dto.VisitResponse;
import com.example.visit.dto.VisitStatusUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitService {

    private final VisitRepository visitRepository;
    private final UserRepository userRepository;
    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;

    // Notification service
    private final NotificationService notificationService;


    // =====================================================
    // BUYER - CREATE VISIT
    // =====================================================

    @Transactional
    public VisitResponse createVisit(VisitRequest request) {

        User buyer = getLoggedInUser();

        // Only BUYER can create visit
        if (buyer.getRole() != Role.BUYER) {
            throw new RuntimeException(
                    "Only buyers can create visits"
            );
        }

        // Find lead
        Lead lead = leadRepository.findById(request.getLeadId())
                .orElseThrow(() ->
                        new RuntimeException("Lead not found")
                );

        // Check that lead belongs to logged-in buyer
        if (lead.getBuyer() == null ||
                !lead.getBuyer().getId().equals(buyer.getId())) {

            throw new RuntimeException(
                    "You can only create visit for your own lead"
            );
        }

        // Find property
        Property property = propertyRepository
                .findById(request.getPropertyId())
                .orElseThrow(() ->
                        new RuntimeException("Property not found")
                );

        // Check that lead and property are the same
        if (lead.getProperty() == null ||
                !lead.getProperty().getId().equals(property.getId())) {

            throw new RuntimeException(
                    "Property does not belong to this lead"
            );
        }

        // Create Visit
        Visit visit = new Visit();

        visit.setLeadId(lead.getId());
        visit.setPropertyId(property.getId());

        // Buyer ID comes from logged-in JWT user
        visit.setBuyerId(buyer.getId());

        visit.setVisitDate(request.getVisitDate());
        visit.setVisitTime(request.getVisitTime());
        visit.setRemarks(request.getRemarks());
        visit.setStatus(VisitStatus.SCHEDULED);

        Visit savedVisit = visitRepository.save(visit);


        // =====================================================
        // NOTIFICATION - ADMIN / SUPER ADMIN
        // =====================================================

        List<User> admins = userRepository.findByRoleIn(
                List.of(Role.ADMIN, Role.SUPER_ADMIN)
        );

        String propertyTitle = property.getTitle();

        String message =
                "New visit scheduled for property '"
                        + propertyTitle
                        + "' on "
                        + savedVisit.getVisitDate()
                        + " at "
                        + savedVisit.getVisitTime();

        for (User admin : admins) {

            notificationService.createNotification(
                    admin,
                    NotificationType.VISIT_CREATED,
                    message,
                    savedVisit.getId()
            );
        }


        return mapToResponse(savedVisit);
    }


    // =====================================================
    // GET VISIT BY ID
    // =====================================================

    public VisitResponse getVisitById(Long id) {

        Visit visit = visitRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Visit not found with id: " + id
                        )
                );

        User currentUser = getLoggedInUser();

        // ADMIN can see everything
        if (currentUser.getRole() == Role.ADMIN ||
                currentUser.getRole() == Role.SUPER_ADMIN) {

            return mapToResponse(visit);
        }

        // BUYER can see only their own visit
        if (currentUser.getRole() == Role.BUYER) {

            if (visit.getBuyerId() == null ||
                    !visit.getBuyerId().equals(currentUser.getId())) {

                throw new RuntimeException(
                        "You are not allowed to view this visit"
                );
            }

            return mapToResponse(visit);
        }

        throw new RuntimeException(
                "You are not allowed to view this visit"
        );
    }


    // =====================================================
    // ADMIN - GET ALL VISITS
    // =====================================================

    public List<VisitResponse> getAllVisits() {

        return visitRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // BUYER - GET OWN VISITS
    // =====================================================

    public List<VisitResponse> getMyVisits() {

        User buyer = getLoggedInUser();

        if (buyer.getRole() != Role.BUYER) {
            throw new RuntimeException(
                    "Only buyers can view their visits"
            );
        }

        return visitRepository.findByBuyerId(buyer.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // ADMIN - GET VISITS BY BUYER
    // =====================================================

    public List<VisitResponse> getVisitsByBuyer(Long buyerId) {

        return visitRepository.findByBuyerId(buyerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // ADMIN - GET VISITS BY LEAD
    // =====================================================

    public List<VisitResponse> getVisitsByLead(Long leadId) {

        return visitRepository.findByLeadId(leadId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // ADMIN - GET VISITS BY PROPERTY
    // =====================================================

    public List<VisitResponse> getVisitsByProperty(Long propertyId) {

        return visitRepository.findByPropertyId(propertyId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // ADMIN - UPDATE VISIT STATUS
    // =====================================================

    @Transactional
    public VisitResponse updateVisitStatus(
            Long id,
            VisitStatusUpdateRequest request
    ) {

        Visit visit = visitRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Visit not found with id: " + id
                        )
                );

        visit.setStatus(request.getStatus());

        if (request.getRemarks() != null) {
            visit.setRemarks(request.getRemarks());
        }

        Visit updatedVisit = visitRepository.save(visit);


        // =====================================================
        // NOTIFICATION - BUYER
        // =====================================================

        User buyer = userRepository.findById(
                updatedVisit.getBuyerId()
        ).orElseThrow(() ->
                new RuntimeException("Buyer not found")
        );

        Property property = propertyRepository.findById(
                updatedVisit.getPropertyId()
        ).orElseThrow(() ->
                new RuntimeException("Property not found")
        );

        String message =
                "Your visit for property '"
                        + property.getTitle()
                        + "' has been updated to "
                        + updatedVisit.getStatus()
                        + ". Visit date: "
                        + updatedVisit.getVisitDate()
                        + " at "
                        + updatedVisit.getVisitTime();

        notificationService.createNotification(
                buyer,
                NotificationType.VISIT_UPDATED,
                message,
                updatedVisit.getId()
        );


        return mapToResponse(updatedVisit);
    }


    // =====================================================
    // ADMIN - DELETE VISIT
    // =====================================================

    @Transactional
    public void deleteVisit(Long id) {

        Visit visit = visitRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Visit not found with id: " + id
                        )
                );

        visitRepository.delete(visit);
    }


    // =====================================================
    // GET LOGGED-IN USER FROM JWT
    // =====================================================

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }


    // =====================================================
    // ENTITY -> RESPONSE
    // =====================================================

    private VisitResponse mapToResponse(Visit visit) {

        VisitResponse response = new VisitResponse();

        response.setId(visit.getId());
        response.setLeadId(visit.getLeadId());
        response.setPropertyId(visit.getPropertyId());

        response.setBuyerId(visit.getBuyerId());

        response.setVisitDate(visit.getVisitDate());
        response.setVisitTime(visit.getVisitTime());
        response.setStatus(visit.getStatus());
        response.setRemarks(visit.getRemarks());
        response.setCreatedAt(visit.getCreatedAt());
        response.setUpdatedAt(visit.getUpdatedAt());

        return response;
    }
}

