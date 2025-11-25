import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { City } from "../models/cityModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";
import {getIp, getLocationData} from "../services/locationService";

const collection: string ="cities";

/**
 * Uses Firebase logic to retreive all documents in cities collection.
 * 
 * @returns documents from cities collection.
 */
export const getCity = async(): Promise<City[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(collection);
        const cities: City[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as City;
        });

        return cities;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Used to create a city.
 * 
 * @param cityData Body data and fields you are trying to create a city with.
 * @returns The newly created city's id and it's contents.
 */
export const createCity = async (cityData: {
    countryId: string;
    name: string;
    date: string;
    type: string;
    description: string;
    damage: string;
    resolution: string;
}): Promise<City> => {
    try {
        if (await checkExisting({name: cityData.name})) {
            throw new Error(`Country with name ${cityData.name} already exists`);
        }

        const newCity: Partial<City> = {
            ...cityData,
        };

        const cityId: string = await createDocument<City>(collection, newCity);

        return structuredClone({ id: cityId, ...newCity} as City);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Use to get a single city by it's unique id.
 * 
 * @param id the city's unique id
 * @returns the city you fetched using it's unique id.
 */
export const getCityById = async (id: string): Promise<City> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            collection,
            id
        );

        if (!doc) {
            throw new Error(`City with ID ${id} not found`);
        }

        const data: DocumentData | undefined = doc.data();
        const city: City = {
            id: doc.id,
            ...data,
        } as City;

        return structuredClone(city);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Updates the city.
 * 
 * @param id targetted to update city's unique id.
 * @param cityData the fields you want to update in the city.
 * @returns Updated city success message.
 */
export const updateCity = async (
    id: string,
    cityData: Pick<City, "countryId" | "name" | "date" | "type" | "description" | "damage" | "resolution">,
): Promise<City> => {
    try {
        const city: City = await getCityById(id);

        if (!city) {
            throw new Error(`City with ${id} not found`);
        }

        const updateCity: City = {
            ...city,
            ...cityData,
        };

        await updateDocument<City>(collection, id, updateCity);

        return structuredClone(updateCity);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Deletes the city.
 * 
 * @param id the unique id of the deleted city.
 */
export const deleteCity = async (id: string): Promise<void> => {
    try {
        const city: City = await getCityById(id);

        if (!city) {
            throw new Error(`City with ${id} not found`);
        }

        await deleteDocument(collection, id);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Returns city/ies based on country id.
 * 
 * @param countryId foreign key from countries to compare.
 * @returns filtered cities.
 */
export const getCityForCountry = async (countryId: string): Promise<City[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(collection);
        const cities: City[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as City;
        });

        const filteredCities = cities.filter((c) => c.countryId.toLowerCase() === countryId.toLowerCase());

        return filteredCities;
    } catch (error: unknown) {
        throw error;
    }
}

/**
 * Used to fetch for user's IP, get their location using geocoding, and return a history fact about ther city if it exists.
 * 
 * @returns city the user is found in
 */
export const getCityByIp = async (): Promise<City[]> => {
    try{
        const ip = await getIp();
        const location = await getLocationData(ip);

        const snapshot: QuerySnapshot = await getDocuments(collection);
        const cities: City[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as City;
        });

        const matchedCity = cities.filter(c => c.name.toLowerCase() === location.city.toLowerCase());

        return matchedCity;
    } catch (error: unknown) {
        throw error;
    } 
};

/**
 * Returns true of false if a city exists already.
 * 
 * Used to validate so that you cannot input the same city twice.
 * 
 * @param cityData name of the city.
 * @returns {boolean} - true or false depending on the existence of the city name.
 */
const checkExisting = async (
    cityData: {name: string;}
) => {
    const cities = getCity();

    const exists = (await cities).some(c => c.name.trim().toLowerCase() === cityData.name.trim().toLocaleLowerCase());

    return exists;
};