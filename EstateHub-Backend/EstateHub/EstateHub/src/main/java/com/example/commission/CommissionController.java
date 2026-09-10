package com.example.commission;

import com.example.commission.dto.CommissionRequest;
import com.example.commission.dto.CommissionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
public class CommissionController {

    private final CommissionService commissionService;

    // ===============================
    // CREATE COMMISSION
    // ADMIN ONLY
    // ===============================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommissionResponse> createCommission(
            @Valid @RequestBody CommissionRequest request
    ) {

        CommissionResponse response =
                commissionService.createCommission(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ===============================
    // GET ALL COMMISSIONS
    // ADMIN ONLY
    // ===============================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CommissionResponse>> getAllCommissions() {

        return ResponseEntity.ok(
                commissionService.getAllCommissions()
        );
    }

    // ===============================
    // GET COMMISSION BY ID
    // ADMIN ONLY
    // ===============================

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommissionResponse> getCommissionById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                commissionService.getCommissionById(id)
        );
    }

    // ===============================
    // GET COMMISSION BY DEAL ID
    // ADMIN ONLY
    // ===============================

    @GetMapping("/deal/{dealId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommissionResponse> getCommissionByDealId(
            @PathVariable Long dealId
    ) {

        return ResponseEntity.ok(
                commissionService.getCommissionByDealId(dealId)
        );
    }

    // ===============================
    // UPDATE PAYMENT STATUS
    // ADMIN ONLY
    // ===============================

    @PatchMapping("/{id}/payment-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommissionResponse> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam PaymentStatus paymentStatus
    ) {

        return ResponseEntity.ok(
                commissionService.updatePaymentStatus(
                        id,
                        paymentStatus
                )
        );
    }
}