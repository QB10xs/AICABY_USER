export const estimatePrice = (distanceInMeters: number): number => {
  const basePrice = 5; // Base fare in your currency
  const pricePerKm = 2; // Price per kilometer
  const distanceInKm = distanceInMeters / 1000;
  
  return Math.round(basePrice + (distanceInKm * pricePerKm));
}; 