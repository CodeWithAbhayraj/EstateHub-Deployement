package com.example.location;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AreaRepository extends JpaRepository<Area, Long> {

    // Get all active areas of a city
    List<Area> findByCityIdAndEnabledTrue(Long cityId);

    // Search area by name inside a specific city
    Optional<Area> findByNameIgnoreCaseAndCityId(
            String name,
            Long cityId
    );

    // Check duplicate area inside same city
    boolean existsByNameIgnoreCaseAndCityId(
            String name,
            Long cityId
    );
}

