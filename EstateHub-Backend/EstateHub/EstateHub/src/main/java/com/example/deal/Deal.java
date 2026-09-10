package com.example.deal;

import com.example.lead.Lead;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "deals",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_deal_lead",
                        columnNames = "lead_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deal {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Lead associated with this deal
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "lead_id",
            nullable = false,
            unique = true

    )
    private Lead lead;

    // Final deal amount
    @Column(
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal dealAmount;

    // Commission percentage
    @Column(
            nullable = false,
            precision = 5,
            scale = 2
    )
    private BigDecimal commissionPercentage;

    // Automatically calculated commission
    @Column(
            nullable = false,
            precision = 15,
            scale = 2
    )
    private BigDecimal commissionAmount;

    // Deal status
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private DealStatus status = DealStatus.PENDING;

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