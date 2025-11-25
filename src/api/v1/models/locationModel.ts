/**
 * Location model to retreive only information required when used for Geocoding.
 */
export interface Location {
    continent_code: string;
    continent_name: string;
    country_code: string;
    country_name: string;
    city: string;
}