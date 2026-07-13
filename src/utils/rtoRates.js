export const rtoRates = {
  "Andhra Pradesh": {
    default: 14,
    cities: {
      "Visakhapatnam": 14,
      "Vijayawada": 14
    }
  },
  "Arunachal Pradesh": { default: 6 },
  "Assam": { default: 7 },
  "Bihar": {
    default: 9,
    cities: {
      "Patna": 9,
      "Gaya": 9
    }
  },
  "Chhattisgarh": { default: 8 },
  "Goa": { default: 11 },
  "Gujarat": {
    default: 6,
    cities: {
      "Ahmedabad": 6,
      "Surat": 6,
      "Vadodara": 6
    }
  },
  "Haryana": {
    default: 8, // varies by price, simplified
    cities: {
      "Gurgaon": 8,
      "Faridabad": 8,
      "Chandigarh": 8
    }
  },
  "Himachal Pradesh": { default: 9 },
  "Jharkhand": {
    default: 9,
    cities: {
      "Ranchi": 9,
      "Jamshedpur": 9
    }
  },
  "Karnataka": {
    default: 15,
    cities: {
      "Bengaluru": 15,
      "Mysuru": 15,
      "Mangaluru": 15
    }
  },
  "Kerala": {
    default: 11,
    cities: {
      "Thiruvananthapuram": 11,
      "Kochi": 11,
      "Kozhikode": 11
    }
  },
  "Madhya Pradesh": {
    default: 10,
    cities: {
      "Bhopal": 10,
      "Indore": 10
    }
  },
  "Maharashtra": {
    default: 11, // 11% for petrol, 13% for diesel usually. We'll use 11% default.
    cities: {
      "Mumbai": 11,
      "Pune": 11,
      "Nagpur": 11,
      "Thane": 11
    }
  },
  "Manipur": { default: 7 },
  "Meghalaya": { default: 7 },
  "Mizoram": { default: 7 },
  "Nagaland": { default: 7 },
  "Odisha": {
    default: 10,
    cities: {
      "Bhubaneswar": 10,
      "Cuttack": 10
    }
  },
  "Punjab": {
    default: 9,
    cities: {
      "Ludhiana": 9,
      "Amritsar": 9,
      "Chandigarh": 9
    }
  },
  "Rajasthan": {
    default: 10,
    cities: {
      "Jaipur": 10,
      "Jodhpur": 10,
      "Udaipur": 10
    }
  },
  "Sikkim": { default: 7 },
  "Tamil Nadu": {
    default: 15,
    cities: {
      "Chennai": 15,
      "Coimbatore": 15,
      "Madurai": 15
    }
  },
  "Telangana": {
    default: 14,
    cities: {
      "Hyderabad": 14,
      "Warangal": 14
    }
  },
  "Tripura": { default: 7 },
  "Uttar Pradesh": {
    default: 10,
    cities: {
      "Lucknow": 10,
      "Kanpur": 10,
      "Noida": 10,
      "Agra": 10
    }
  },
  "Uttarakhand": {
    default: 9,
    cities: {
      "Dehradun": 9
    }
  },
  "West Bengal": {
    default: 10,
    cities: {
      "Kolkata": 10,
      "Darjeeling": 10
    }
  },
  "Delhi": {
    default: 10, // simplified, varies by price
    cities: {
      "New Delhi": 10
    }
  },
  "Jammu and Kashmir": { default: 9 },
  "Ladakh": { default: 9 },
  "Puducherry": { default: 7 },
  "Chandigarh": { default: 8 }
};

export const statesList = Object.keys(rtoRates).sort();

export const getCitiesForState = (stateName) => {
  if (!stateName || !rtoRates[stateName]) return [];
  const cities = rtoRates[stateName].cities;
  return cities ? Object.keys(cities).sort() : [];
};

export const getRTORate = (stateName, cityName) => {
  if (!stateName || !rtoRates[stateName]) return 0;

  if (cityName && rtoRates[stateName].cities && rtoRates[stateName].cities[cityName] !== undefined) {
    return rtoRates[stateName].cities[cityName];
  }
  return rtoRates[stateName].default;
};
