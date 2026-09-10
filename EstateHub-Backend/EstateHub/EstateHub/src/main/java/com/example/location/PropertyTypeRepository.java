package com.example.location;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PropertyTypeRepository
        extends JpaRepository<PropertyType, Long> {

    Optional<PropertyType> findByNameIgnoreCaseAndAreaId(
            String name,
            Long areaId
    );

    List<PropertyType> findByAreaIdAndEnabledTrue(
            Long areaId
    );

    boolean existsByNameIgnoreCaseAndAreaId(
            String name,
            Long areaId
    );
}