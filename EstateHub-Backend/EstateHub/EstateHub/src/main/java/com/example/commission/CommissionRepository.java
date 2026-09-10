package com.example.commission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommissionRepository extends JpaRepository<Commission, Long> {

    Optional<Commission> findByDealId(Long dealId);

    boolean existsByDealId(Long dealId);
}