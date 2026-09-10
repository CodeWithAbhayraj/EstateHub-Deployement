package com.example.lead;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {

    List<Lead> findByBuyerId(Long buyerId);

    List<Lead> findByPropertyId(Long propertyId);

    List<Lead> findByStatus(LeadStatus status);
}