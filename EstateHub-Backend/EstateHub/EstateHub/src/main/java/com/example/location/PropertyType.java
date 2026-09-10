package com.example.location;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "property_types",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"name", "area_id"}
                )
        }

)
@Getter
@Setter
public class PropertyType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, length = 100)
    private String name;

    // =====================================================
    // AREA RELATION
    // =====================================================


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "area_id",
            nullable = false
    )
    private Area area;

    // =====================================================
    // STATUS
    // =====================================================


    @Column(nullable = false)
    private Boolean enabled = true;

    // =====================================================
    // TIMESTAMPS
    // =====================================================

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (enabled == null) {
            enabled = true;
        }
    }
    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }

}