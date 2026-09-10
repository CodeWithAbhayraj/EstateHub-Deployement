package com.example.deal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DealRepository
        extends JpaRepository<Deal, Long> {

    boolean existsByLeadId(Long leadId);

    Optional<Deal> findByLeadId(Long leadId);
}