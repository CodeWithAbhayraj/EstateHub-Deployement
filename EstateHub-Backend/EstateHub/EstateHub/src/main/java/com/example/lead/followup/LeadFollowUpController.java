package com.example.lead.followup;

import com.example.lead.followup.dto.LeadFollowUpRequest;
import com.example.lead.followup.dto.LeadFollowUpResponse;
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
public class LeadFollowUpController {

    private final LeadFollowUpService followUpService;

    // ===============================
    // ADMIN - CREATE FOLLOW-UP
    // ===============================

    @PostMapping("/{leadId}/followups")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeadFollowUpResponse> createFollowUp(
            @PathVariable Long leadId,
            @Valid @RequestBody LeadFollowUpRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        followUpService.createFollowUp(
                                leadId,
                                request
                        )
                );
    }

    // ===============================
    // ADMIN - GET FOLLOW-UPS
    // ===============================

    @GetMapping("/{leadId}/followups")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeadFollowUpResponse>> getFollowUps(
            @PathVariable Long leadId
    ) {

        return ResponseEntity.ok(
                followUpService.getFollowUps(leadId)
        );
    }
}