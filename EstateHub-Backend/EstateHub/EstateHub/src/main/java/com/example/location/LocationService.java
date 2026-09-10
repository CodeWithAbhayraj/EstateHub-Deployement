package com.example.location;

import com.example.location.dto.AreaRequest;
import com.example.location.dto.AreaResponse;
import com.example.location.dto.CityRequest;
import com.example.location.dto.CityResponse;
import com.example.location.dto.PropertyTypeRequest;
import com.example.location.dto.PropertyTypeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final CityRepository cityRepository;
    private final AreaRepository areaRepository;
    private final PropertyTypeRepository propertyTypeRepository;


    // =====================================================
    // CITY
    // =====================================================

    @Transactional
    public CityResponse createCity(CityRequest request) {

        if (request == null ||
                request.getName() == null ||
                request.getName().trim().isEmpty()) {

            throw new RuntimeException("City name is required");
        }

        String cityName = request.getName().trim();

        if (cityRepository.existsByNameIgnoreCase(cityName)) {
            throw new RuntimeException("City already exists");
        }

        City city = new City();

        city.setName(cityName);
        city.setEnabled(true);

        City savedCity = cityRepository.save(city);

        return mapCityToResponse(savedCity);
    }


    public List<CityResponse> getAllCities() {

        return cityRepository.findByEnabledTrue()
                .stream()
                .map(this::mapCityToResponse)
                .toList();
    }


    public CityResponse getCityById(Long id) {

        City city = cityRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "City not found with id: " + id
                        )
                );

        return mapCityToResponse(city);
    }


    public CityResponse searchCity(String name) {

        City city = cityRepository
                .findByNameIgnoreCase(name.trim())
                .orElseThrow(() ->
                        new RuntimeException(
                                "City not found: " + name
                        )
                );

        return mapCityToResponse(city);
    }


    // =====================================================
    // AREA
    // =====================================================

    @Transactional
    public AreaResponse createArea(
            Long cityId,
            AreaRequest request
    ) {

        if (request == null ||
                request.getName() == null ||
                request.getName().trim().isEmpty()) {

            throw new RuntimeException("Area name is required");
        }

        City city = cityRepository.findById(cityId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "City not found with id: " + cityId
                        )
                );

        String areaName = request.getName().trim();

        if (areaRepository.existsByNameIgnoreCaseAndCityId(
                areaName,
                cityId
        )) {

            throw new RuntimeException(
                    "Area already exists in this city"
            );
        }

        Area area = new Area();

        area.setName(areaName);
        area.setCity(city);
        area.setEnabled(true);

        Area savedArea = areaRepository.save(area);

        return mapAreaToResponse(savedArea);
    }


    public List<AreaResponse> getAreasByCity(Long cityId) {

        if (!cityRepository.existsById(cityId)) {

            throw new RuntimeException(
                    "City not found with id: " + cityId
            );
        }

        return areaRepository
                .findByCityIdAndEnabledTrue(cityId)
                .stream()
                .map(this::mapAreaToResponse)
                .toList();
    }


    public AreaResponse searchArea(
            String name,
            Long cityId
    ) {

        Area area = areaRepository
                .findByNameIgnoreCaseAndCityId(
                        name.trim(),
                        cityId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Area not found: " + name
                        )
                );

        return mapAreaToResponse(area);
    }


    // =====================================================
    // PROPERTY TYPE
    // =====================================================

    @Transactional
    public PropertyTypeResponse createPropertyType(
            Long areaId,
            PropertyTypeRequest request
    ) {

        if (request == null ||
                request.getName() == null ||
                request.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Property type name is required"
            );
        }

        // -------------------------------------------------
        // Check Area exists
        // -------------------------------------------------

        Area area = areaRepository.findById(areaId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Area not found with id: " + areaId
                        )
                );

        String propertyTypeName =
                request.getName().trim();

        // -------------------------------------------------
        // Check duplicate inside same Area
        // -------------------------------------------------

        if (propertyTypeRepository
                .existsByNameIgnoreCaseAndAreaId(
                        propertyTypeName,
                        areaId
                )) {

            throw new RuntimeException(
                    "Property type already exists in this area"
            );
        }

        // -------------------------------------------------
        // Create Property Type
        // -------------------------------------------------

        PropertyType propertyType =
                new PropertyType();

        propertyType.setName(propertyTypeName);
        propertyType.setArea(area);
        propertyType.setEnabled(true);

        PropertyType savedPropertyType =
                propertyTypeRepository.save(propertyType);

        return mapPropertyTypeToResponse(
                savedPropertyType
        );
    }


    // =====================================================
    // GET PROPERTY TYPES BY AREA
    // =====================================================

    public List<PropertyTypeResponse> getPropertyTypesByArea(
            Long areaId
    ) {

        if (!areaRepository.existsById(areaId)) {

            throw new RuntimeException(
                    "Area not found with id: " + areaId
            );
        }

        return propertyTypeRepository
                .findByAreaIdAndEnabledTrue(areaId)
                .stream()
                .map(this::mapPropertyTypeToResponse)
                .toList();
    }


    // =====================================================
    // GET PROPERTY TYPE BY ID
    // =====================================================

    public PropertyTypeResponse getPropertyTypeById(
            Long id
    ) {

        PropertyType propertyType =
                propertyTypeRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Property type not found with id: "
                                                + id
                                )
                        );

        return mapPropertyTypeToResponse(
                propertyType
        );
    }


    // =====================================================
    // SEARCH PROPERTY TYPE INSIDE AREA
    // =====================================================

    public PropertyTypeResponse searchPropertyType(
            String name,
            Long areaId
    ) {

        PropertyType propertyType =
                propertyTypeRepository
                        .findByNameIgnoreCaseAndAreaId(
                                name.trim(),
                                areaId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Property type not found: "
                                                + name
                                )
                        );

        return mapPropertyTypeToResponse(
                propertyType
        );
    }


    // =====================================================
    // ENTITY → CITY RESPONSE
    // =====================================================

    private CityResponse mapCityToResponse(
            City city
    ) {

        CityResponse response =
                new CityResponse();

        response.setId(city.getId());
        response.setName(city.getName());
        response.setEnabled(city.getEnabled());

        response.setCreatedAt(
                city.getCreatedAt()
        );

        response.setUpdatedAt(
                city.getUpdatedAt()
        );

        return response;
    }


    // =====================================================
    // ENTITY → AREA RESPONSE
    // =====================================================

    private AreaResponse mapAreaToResponse(
            Area area
    ) {

        AreaResponse response =
                new AreaResponse();

        response.setId(area.getId());
        response.setName(area.getName());
        response.setEnabled(area.getEnabled());

        response.setCreatedAt(
                area.getCreatedAt()
        );

        response.setUpdatedAt(
                area.getUpdatedAt()
        );

        if (area.getCity() != null) {

            response.setCityId(
                    area.getCity().getId()
            );

            response.setCityName(
                    area.getCity().getName()
            );
        }

        return response;
    }


    // =====================================================
    // ENTITY → PROPERTY TYPE RESPONSE
    // =====================================================

    private PropertyTypeResponse mapPropertyTypeToResponse(
            PropertyType propertyType
    ) {

        PropertyTypeResponse response =
                new PropertyTypeResponse();

        response.setId(
                propertyType.getId()
        );

        response.setName(
                propertyType.getName()
        );

        response.setEnabled(
                propertyType.getEnabled()
        );

        response.setCreatedAt(
                propertyType.getCreatedAt()
        );

        response.setUpdatedAt(
                propertyType.getUpdatedAt()
        );

        // -------------------------------------------------
        // AREA DETAILS
        // -------------------------------------------------

        if (propertyType.getArea() != null) {

            response.setAreaId(
                    propertyType.getArea().getId()
            );

            response.setAreaName(
                    propertyType.getArea().getName()
            );
        }

        return response;
    }
}