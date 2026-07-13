import { getRTORate } from './rtoRates';

export const calculatePrices = (exShowroomPrice, stateName, cityName, otherFees = 0) => {
    const basePrice = Number(exShowroomPrice) || 0;
    const rtoPercentage = getRTORate(stateName, cityName);
    
    const rtoAmount = (basePrice * rtoPercentage) / 100;
    const onRoadPrice = basePrice + rtoAmount + Number(otherFees);
    
    return {
        rtoPercentage,
        rtoAmount,
        onRoadPrice,
        basePrice,
        otherFees
    };
};
