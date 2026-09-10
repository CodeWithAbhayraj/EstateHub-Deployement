package com.example.lead;

import com.example.lead.dto.LeadRequest;
import com.example.lead.dto.LeadResponse;
import com.example.lead.dto.LeadStatusUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    // ==========================================
    // BUYER - CREATE LEAD
    // ==========================================

    @PostMapping
    public ResponseEntity<LeadResponse> createLead(
            @Valid @RequestBody LeadRequest request
    ) {

        LeadResponse response = leadService.createLead(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ==========================================
    // ADMIN - GET ALL LEADS
    // ==========================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<LeadResponse>> getAllLeads() {

        return ResponseEntity.ok(
                leadService.getAllLeads()
        );
    }

    // ==========================================
    // ADMIN - GET LEAD BY ID
    // ==========================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<LeadResponse> getLeadById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                leadService.getLeadById(id)
        );
    }

    // ==========================================
    // ADMIN - UPDATE LEAD STATUS
    // ==========================================

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<LeadResponse> updateLeadStatus(
            @PathVariable Long id,
            @Valid @RequestBody LeadStatusUpdateRequest request
    ) {

        return ResponseEntity.ok(
                leadService.updateLeadStatus(id, request)
        );
    }
}