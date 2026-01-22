import { IGeoDbResponseData } from '../types/locations';

export function getLocationLatLon(locationName: string, fullCitiesInfo: IGeoDbResponseData[]) {
  const fullCityInfo = fullCitiesInfo.find((cityInfo) => {
    return cityInfo.name === locationName;
  });

  if (!fullCityInfo) return undefined;

  return { lat: fullCityInfo.latitude, lon: fullCityInfo.longitude };
}
