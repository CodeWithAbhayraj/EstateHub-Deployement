package com.example.commission;

import com.example.deal.Deal;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "commissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Commission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Deal linked with this commission
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deal_id", nullable = false, unique = true)
    private Deal deal;

    // Commission type
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommissionType type;

    // Deal amount
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal dealAmount;

    // Commission percentage
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal commissionPercentage;

    // Calculated commission amount
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal commissionAmount;

    // Payment status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}