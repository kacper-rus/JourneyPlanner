export function calculateVehicleCO2(vehicleType, fuelType, distance) {
    const CO2_PER_KM = {
      small_car: {
        diesel: 0.13989414,
        petrol: 0.14652,
        hybrid: 0.10332,
        electric: 0,
      },
      large_car: {
        diesel: 0.20953414,
        petrol: 0.27639,
        hybrid: 0.15491,
        electric: 0,
      },
      average_car: {
        diesel: 0.17082414,
        petrol: 0.17048,
        hybrid: 0.12004,
        electric: 0,
      },
    };
  
    const CO2_PER_KM_FOR_VEHICLE_AND_FUEL_TYPE = CO2_PER_KM[vehicleType][fuelType];
    const totalCO2Output = CO2_PER_KM_FOR_VEHICLE_AND_FUEL_TYPE * distance;
    return totalCO2Output;
  }
  
  
  export function calculatePublicTransportCO2(vehicleType, distance) {
    const CO2_PER_PASSENGER_KM = {
      average_local_bus: 0.0965,
      coach: 0.02733,
      national_rail: 0.03549,
      international_rail: 0.00446,
      tram_and_light_rail: 0.02861,
      london_underground: 0.02781,
  
  
      BUS: 0.0965,
      CABLE_CAR: 0,
      COMMUTER_TRAIN: 0.03549,
      FERRY: 0,
      FUNICULAR: 0,
      GONDOLA_LIFT: 0,
      HEAVY_RAIL: 0.03549,
      HIGH_SPEED_TRAIN: 0.03549,
      INTERCITY_BUS: 0.0965,
      METRO_RAIL: 0.02861,
      MONORAIL: 0.02861,
      OTHER: 0,
      RAIL: 0.03549,
      SHARE_TAXI: 0,
      SUBWAY: 0.02781,
      TRAM: 0.02861,
      TROLLEYBUS: 0.02861,
    };
  
    const CO2_PER_PASSENGER_KM_FOR_VEHICLE_TYPE = CO2_PER_PASSENGER_KM[vehicleType];
    const totalCO2Output = CO2_PER_PASSENGER_KM_FOR_VEHICLE_TYPE * distance;
    return totalCO2Output;
  }
  
  
  export function calculateFlightCO2(flightType, distance) {
    const CO2_PER_PASSENGER_KM = {
      domestic_uk_average: 0.24587,
      short_haul_uk_average: 0.15353,
      long_haul_uk_average: 0.19309,
      international_none_uk_average: 0.18362,
    };
  
    const CO2_PER_PASSENGER_KM_FOR_FLIGHT_TYPE = CO2_PER_PASSENGER_KM[flightType];
    const totalCO2Output = CO2_PER_PASSENGER_KM_FOR_FLIGHT_TYPE * distance;
    return totalCO2Output;
  }