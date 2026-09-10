package com.example.lead.followup;

import com.example.lead.Lead;
import com.example.lead.LeadRepository;
import com.example.lead.followup.dto.LeadFollowUpRequest;
import com.example.lead.followup.dto.LeadFollowUpResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadFollowUpService {

    private final LeadFollowUpRepository followUpRepository;
    private final LeadRepository leadRepository;

    // ===============================
    // CREATE FOLLOW-UP
    // ===============================

    public LeadFollowUpResponse createFollowUp(
            Long leadId,
            LeadFollowUpRequest request
    ) {

        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found")
                );

        LeadFollowUp followUp = LeadFollowUp.builder()
                .lead(lead)
                .followUpDate(request.getFollowUpDate())
                .note(request.getNote())
                .nextFollowUpDate(request.getNextFollowUpDate())
                .build();

        LeadFollowUp savedFollowUp =
                followUpRepository.save(followUp);

        return mapToResponse(savedFollowUp);
    }

    // ===============================
    // GET FOLLOW-UPS BY LEAD
    // ===============================

    public List<LeadFollowUpResponse> getFollowUps(
            Long leadId
    ) {

        if (!leadRepository.existsById(leadId)) {
            throw new RuntimeException("Lead not found");
        }

        return followUpRepository
                .findByLeadIdOrderByFollowUpDateDesc(leadId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ===============================
    // ENTITY → RESPONSE
    // ===============================

    private LeadFollowUpResponse mapToResponse(
            LeadFollowUp followUp
    ) {

        return LeadFollowUpResponse.builder()
                .id(followUp.getId())
                .leadId(followUp.getLead().getId())
                .followUpDate(followUp.getFollowUpDate())
                .note(followUp.getNote())
                .nextFollowUpDate(
                        followUp.getNextFollowUpDate()
                )
                .createdAt(followUp.getCreatedAt())
                .build();
    }
}