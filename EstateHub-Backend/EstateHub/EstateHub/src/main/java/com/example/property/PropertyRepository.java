package com.example.property;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    // ==========================================
    // STATUS
    // ==========================================

    List<Property> findByStatus(PropertyStatus status);


    // ==========================================
    // SELLER
    // ==========================================

    List<Property> findBySellerId(Long sellerId);


    // ==========================================
    // LOCATION
    // ==========================================

    // Properties by City
    List<Property> findByCityId(Long cityId);

    // Properties by Area
    List<Property> findByLocationAreaId(Long areaId);

    // Properties by Property Type
    List<Property> findByPropertyTypeId(Long propertyTypeId);


    // ==========================================
    // LOCATION + PROPERTY TYPE
    // ==========================================

    // City + Area
    List<Property> findByCityIdAndLocationAreaId(
            Long cityId,
            Long areaId
    );

    // City + Property Type
    List<Property> findByCityIdAndPropertyTypeId(
            Long cityId,
            Long propertyTypeId
    );

    // Area + Property Type
    List<Property> findByLocationAreaIdAndPropertyTypeId(
            Long areaId,
            Long propertyTypeId
    );


    // ==========================================
    // CITY + AREA + PROPERTY TYPE
    // ==========================================

    List<Property> findByCityIdAndLocationAreaIdAndPropertyTypeId(
            Long cityId,
            Long areaId,
            Long propertyTypeId
    );
}