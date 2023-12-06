export const extractAddressDetails = (address: string) => {
  if (address === undefined || address === "") return;
  const parts = address.split(",").map(part => part.trim());
  const [BuildingNumber, District, StreetName, Postcode, CityCode, country] = parts;

  return {
    BuildingNumber,
    District,
    StreetName,
    Postcode,
    CityCode,
    country,
  };
};
