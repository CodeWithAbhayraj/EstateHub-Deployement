package com.example.lead.followup;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadFollowUpRepository
        extends JpaRepository<LeadFollowUp, Long> {

    List<LeadFollowUp> findByLeadIdOrderByFollowUpDateDesc(Long leadId);
}