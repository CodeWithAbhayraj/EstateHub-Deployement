package com.example.property;

import com.example.property.dto.PropertyRequest;
import com.example.property.dto.PropertyResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    // =====================================================
    // SELLER - CREATE PROPERTY
    // =====================================================

    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<PropertyResponse> createProperty(
            @Valid @RequestBody PropertyRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        PropertyResponse response =
                propertyService.createProperty(request, email);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =====================================================
    // BUYER / SELLER / ADMIN - GET PROPERTY
    // =====================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<PropertyResponse> getProperty(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                propertyService.getPropertyById(id)
        );
    }

    // =====================================================
    // BUYER - GET PUBLISHED PROPERTIES
    // =====================================================

    @GetMapping
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<PropertyResponse>> getPublishedProperties() {

        return ResponseEntity.ok(
                propertyService.getPublishedProperties()
        );
    }

    // =====================================================
    // SELLER - MY PROPERTIES
    // =====================================================

    @GetMapping("/my")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<PropertyResponse>> getMyProperties(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                propertyService.getMyProperties(email)
        );
    }

    // =====================================================
    // SELLER - UPDATE OWN PROPERTY
    // =====================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<PropertyResponse> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                propertyService.updateProperty(
                        id,
                        request,
                        email
                )
        );
    }

    // =====================================================
    // SELLER - DELETE OWN PROPERTY
    // =====================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email = authentication.getName();

        propertyService.deleteProperty(id, email);

        return ResponseEntity.noContent().build();
    }

    // =====================================================
    // SELLER - SUBMIT PROPERTY FOR APPROVAL
    // =====================================================

    @PatchMapping("/{id}/submit")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<PropertyResponse> submitForApproval(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                propertyService.submitForApproval(
                        id,
                        email
                )
        );
    }

    // =====================================================
    // ADMIN - APPROVE PROPERTY
    // =====================================================

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<PropertyResponse> approveProperty(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                propertyService.approveProperty(id)
        );
    }

    // =====================================================
    // ADMIN - REJECT PROPERTY
    // =====================================================

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<PropertyResponse> rejectProperty(
            @PathVariable Long id,
            @RequestParam String reason
    ) {

        return ResponseEntity.ok(
                propertyService.rejectProperty(
                        id,
                        reason
                )
        );
    }
}