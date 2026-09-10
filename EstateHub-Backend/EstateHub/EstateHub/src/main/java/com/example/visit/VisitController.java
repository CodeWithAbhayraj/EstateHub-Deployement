package com.example.visit;

import com.example.visit.dto.VisitRequest;
import com.example.visit.dto.VisitResponse;
import com.example.visit.dto.VisitStatusUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
@RequiredArgsConstructor
public class VisitController {

    private final VisitService visitService;

    // =====================================================
    // BUYER - CREATE VISIT
    // =====================================================

    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<VisitResponse> createVisit(
            @Valid @RequestBody VisitRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(visitService.createVisit(request));
    }

    // =====================================================
    // ADMIN - GET ALL VISITS
    // =====================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VisitResponse>> getAllVisits() {

        return ResponseEntity.ok(
                visitService.getAllVisits()
        );
    }

    // =====================================================
    // BUYER / ADMIN - GET VISIT BY ID
    // =====================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('BUYER', 'ADMIN')")
    public ResponseEntity<VisitResponse> getVisitById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                visitService.getVisitById(id)
        );
    }

    // =====================================================
    // BUYER - GET OWN VISITS
    // =====================================================

    @GetMapping("/my")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<List<VisitResponse>> getMyVisits() {

        return ResponseEntity.ok(
                visitService.getMyVisits()
        );
    }

    // =====================================================
    // ADMIN - GET VISITS BY BUYER
    // =====================================================

    @GetMapping("/buyer/{buyerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VisitResponse>> getVisitsByBuyer(
            @PathVariable Long buyerId
    ) {

        return ResponseEntity.ok(
                visitService.getVisitsByBuyer(buyerId)
        );
    }

    // =====================================================
    // ADMIN - GET VISITS BY LEAD
    // =====================================================

    @GetMapping("/lead/{leadId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VisitResponse>> getVisitsByLead(
            @PathVariable Long leadId
    ) {

        return ResponseEntity.ok(
                visitService.getVisitsByLead(leadId)
        );
    }

    // =====================================================
    // ADMIN - GET VISITS BY PROPERTY
    // =====================================================

    @GetMapping("/property/{propertyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VisitResponse>> getVisitsByProperty(
            @PathVariable Long propertyId
    ) {

        return ResponseEntity.ok(
                visitService.getVisitsByProperty(propertyId)
        );
    }

    // =====================================================
    // ADMIN - UPDATE VISIT STATUS
    // =====================================================

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VisitResponse> updateVisitStatus(
            @PathVariable Long id,
            @Valid @RequestBody VisitStatusUpdateRequest request
    ) {

        return ResponseEntity.ok(
                visitService.updateVisitStatus(id, request)
        );
    }

    // =====================================================
    // ADMIN - DELETE VISIT
    // =====================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteVisit(
            @PathVariable Long id
    ) {

        visitService.deleteVisit(id);

        return ResponseEntity.ok(
                "Visit deleted successfully"
        );
    }
}