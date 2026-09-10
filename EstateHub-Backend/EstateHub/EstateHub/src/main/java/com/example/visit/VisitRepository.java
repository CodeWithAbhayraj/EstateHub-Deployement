package com.example.visit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface VisitRepository extends JpaRepository<Visit, Long> {

    List<Visit> findByBuyerId(Long buyerId);

    List<Visit> findByLeadId(Long leadId);

    List<Visit> findByPropertyId(Long propertyId);

    List<Visit> findByStatus(VisitStatus status);

    List<Visit> findByVisitDate(LocalDate visitDate);
}