package com.example.deal;

import com.example.deal.dto.DealRequest;
import com.example.deal.dto.DealResponse;
import com.example.deal.dto.DealStatusUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DealController {


    private final DealService dealService;

    // ==========================================
    // CREATE DEAL
    // ==========================================


    @PostMapping
    public ResponseEntity<DealResponse> createDeal(
            @Valid @RequestBody DealRequest request
    ) {

        DealResponse response =
                dealService.createDeal(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ==========================================
    // GET ALL DEALS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<DealResponse>> getAllDeals() {

        return ResponseEntity.ok(
                dealService.getAllDeals()
        );
    }

    // ==========================================
    // GET DEAL BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<DealResponse> getDealById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                dealService.getDealById(id)
        );
    }

    // ==========================================
    // UPDATE DEAL STATUS
    // ==========================================

    @PatchMapping("/{id}/status")
    public ResponseEntity<DealResponse> updateDealStatus(
            @PathVariable Long id,
            @Valid @RequestBody DealStatusUpdateRequest request
    ) {

        return ResponseEntity.ok(
                dealService.updateDealStatus(
                        id,
                        request
                )
        );
    }
}