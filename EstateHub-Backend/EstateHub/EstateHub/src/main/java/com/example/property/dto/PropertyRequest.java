package com.example.property.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PropertyRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Area is required")
    @Positive(message = "Area must be greater than 0")
    private Double area;

    @NotNull(message = "BHK is required")
    @Positive(message = "BHK must be greater than 0")
    private Integer bhk;

    @NotNull(message = "Property type is required")
    private Long propertyTypeId;

    @NotNull(message = "City is required")
    private Long cityId;

    @NotNull(message = "Area is required")
    private Long areaId;

    private String furnished;

    private Boolean parking;

    private String facing;

    private Boolean readyToMove;

    private Boolean newProject;

    private Boolean resale;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;
}