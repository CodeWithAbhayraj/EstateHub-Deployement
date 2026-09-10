package com.example.favorite;

import com.example.favorite.dto.FavoriteResponse;
import com.example.property.Property;
import com.example.property.PropertyRepository;
import com.example.user.Role;
import com.example.user.User;
import com.example.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    // =====================================================
    // BUYER - SAVE/FAVORITE PROPERTY
    // =====================================================

    @Transactional
    public FavoriteResponse addFavorite(Long propertyId) {

        User buyer = getLoggedInBuyer();

        // Check property exists
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException("Property not found with id: " + propertyId)
                );

        // Check if already favorite
        if (favoriteRepository.existsByBuyerIdAndPropertyId(
                buyer.getId(),
                property.getId()
        )) {
            throw new RuntimeException("Property is already in your favorites");
        }

        Favorite favorite = new Favorite();

        // Buyer ID comes from JWT
        favorite.setBuyerId(buyer.getId());

        favorite.setPropertyId(property.getId());

        Favorite savedFavorite = favoriteRepository.save(favorite);

        return mapToResponse(savedFavorite);
    }

    // =====================================================
    // BUYER - REMOVE FAVORITE
    // =====================================================

    @Transactional
    public void removeFavorite(Long propertyId) {

        User buyer = getLoggedInBuyer();

        // Check property exists
        propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException("Property not found with id: " + propertyId)
                );

        // Check favorite exists
        if (!favoriteRepository.existsByBuyerIdAndPropertyId(
                buyer.getId(),
                propertyId
        )) {
            throw new RuntimeException("Property is not in your favorites");
        }

        favoriteRepository.deleteByBuyerIdAndPropertyId(
                buyer.getId(),
                propertyId
        );
    }

    // =====================================================
    // BUYER - GET MY FAVORITES
    // =====================================================

    public List<FavoriteResponse> getMyFavorites() {

        User buyer = getLoggedInBuyer();

        return favoriteRepository.findByBuyerId(buyer.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =====================================================
    // BUYER - CHECK IF PROPERTY IS FAVORITE
    // =====================================================

    public boolean isFavorite(Long propertyId) {

        User buyer = getLoggedInBuyer();

        // Check property exists
        propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new RuntimeException("Property not found with id: " + propertyId)
                );

        return favoriteRepository.existsByBuyerIdAndPropertyId(
                buyer.getId(),
                propertyId
        );
    }

    // =====================================================
    // GET LOGGED-IN BUYER FROM JWT
    // =====================================================

    private User getLoggedInBuyer() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException("User is not authenticated");
        }

        String email = authentication.getName();

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // Only BUYER can use favorites
        if (buyer.getRole() != Role.BUYER) {
            throw new RuntimeException(
                    "Only buyers can use favorites"
            );
        }

        return buyer;
    }

    // =====================================================
    // ENTITY → RESPONSE
    // =====================================================

    private FavoriteResponse mapToResponse(Favorite favorite) {

        FavoriteResponse response = new FavoriteResponse();

        response.setId(favorite.getId());
        response.setBuyerId(favorite.getBuyerId());
        response.setPropertyId(favorite.getPropertyId());
        response.setCreatedAt(favorite.getCreatedAt());

        return response;
    }
}

