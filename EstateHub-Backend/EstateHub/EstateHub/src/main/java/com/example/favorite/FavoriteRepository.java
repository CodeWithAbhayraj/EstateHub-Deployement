package com.example.favorite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // Get all favorites of a buyer
    List<Favorite> findByBuyerId(Long buyerId);

    // Check if buyer already favorited a property
    boolean existsByBuyerIdAndPropertyId(Long buyerId, Long propertyId);

    // Find specific favorite
    Optional<Favorite> findByBuyerIdAndPropertyId(
            Long buyerId,
            Long propertyId
    );

    // Delete specific favorite
    void deleteByBuyerIdAndPropertyId(
            Long buyerId,
            Long propertyId
    );
}

