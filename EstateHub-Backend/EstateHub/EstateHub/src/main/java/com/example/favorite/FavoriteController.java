package com.example.favorite;

import com.example.favorite.dto.FavoriteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // =====================================================
    // BUYER - SAVE PROPERTY TO FAVORITES
    // =====================================================

    @PostMapping("/{propertyId}")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<FavoriteResponse> addFavorite(
            @PathVariable Long propertyId
    ) {

        FavoriteResponse response =
                favoriteService.addFavorite(propertyId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =====================================================
    // BUYER - REMOVE PROPERTY FROM FAVORITES
    // =====================================================

    @DeleteMapping("/{propertyId}")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<String> removeFavorite(
            @PathVariable Long propertyId
    ) {

        favoriteService.removeFavorite(propertyId);

        return ResponseEntity.ok(
                "Property removed from favorites successfully"
        );
    }

    // =====================================================
    // BUYER - GET MY FAVORITES
    // =====================================================

    @GetMapping
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<List<FavoriteResponse>> getMyFavorites() {

        List<FavoriteResponse> favorites =
                favoriteService.getMyFavorites();

        return ResponseEntity.ok(favorites);
    }

    // =====================================================
    // BUYER - CHECK IF PROPERTY IS FAVORITE
    // =====================================================

    @GetMapping("/{propertyId}")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<Boolean> isFavorite(
            @PathVariable Long propertyId
    ) {

        boolean favorite =
                favoriteService.isFavorite(propertyId);

        return ResponseEntity.ok(favorite);
    }
}

