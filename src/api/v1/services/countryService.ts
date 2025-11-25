import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { Country } from "../models/countryModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";
import {getIp, getLocationData} from "../services/locationService";

const collection: string = "countries";

/**
 * Uses Firebase logic to retreive all documents in countries collection.
 * 
 * @returns documents from countries collection.
 */
export const getCountry = async(): Promise<Country[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(collection);
        const countries: Country[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Country;
        });

        return countries;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Used to create a country.
 * 
 * @param countryData Body data and fields you are trying to create a country with.
 * @returns The newly created country's id and it's contents.
 */
export const createCountry = async (countryData: {
    continentId: string;
    name: string;
    data: {
        date: string;
        type: string;
        description: string;
        damage: string;
        resolution: string;
    }[];
}): Promise<Country> => {
    try {
        if (await checkExisting({name: countryData.name})) {
            throw new Error(`Country with name ${countryData.name} already exists`);
        }

        const newCountry: Partial<Country> = {
            ...countryData,
        };

        const countryId: string = await createDocument<Country>(collection, newCountry);

        return structuredClone({ id: countryId, ...newCountry} as Country);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Use to get a single country by it's unique id.
 * 
 * @param id the country's unique id
 * @returns the country you fetched using it's unique id.
 */
export const getCountryById = async (id: string): Promise<Country> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            collection,
            id
        );

        if (!doc) {
            throw new Error(`Country with ID ${id} not found`);
        }

        const data: DocumentData | undefined = doc.data();
        const country: Country = {
            id: doc.id,
            ...data,
        } as Country;

        return structuredClone(country);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Updates the country.
 * 
 * @param id targetted to update country's unique id.
 * @param countryData the fields you want to update in the country.
 * @returns Updated country success message.
 */
export const updateCountry = async (
    id: string,
    countryData: Pick<Country, "continentId" | "name" | "data">,
): Promise<Country> => {
    try {
        const country: Country = await getCountryById(id);

        if (!country) {
            throw new Error(`Country with ${id} not found`);
        }

        const updateCountry: Country = {
            ...country,
            data: countryData.data ? countryData.data : country.data,
        };

        if (countryData.continentId !== undefined) {
            updateCountry.continentId = countryData.continentId;
        }

        if (countryData.name !== undefined) {
            updateCountry.name = countryData.name;
        }

        await updateDocument<Country>(collection, id, updateCountry);

        return structuredClone(updateCountry);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Deletes the country.
 * 
 * @param id the unique id of the deleted country.
 */
export const deleteCountry = async (id: string): Promise<void> => {
    try {
        const country: Country = await getCountryById(id);

        if (!country) {
            throw new Error(`Country with ${id} not found`);
        }

        await deleteDocument(collection, id);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Returns country/ies based on continent id.
 * 
 * @param continentId foreign key from continents to compare.
 * @returns filtered countries.
 */
export const getCountryForContinent = async (continentId: string): Promise<Country[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(collection);
        const countries: Country[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Country;
        });

        const filteredCountries = countries.filter((c) => c.continentId.toLowerCase() === continentId.toLowerCase());

        return filteredCountries;
    } catch (error: unknown) {
        throw error;
    }
}

/**
 * Used to fetch for user's IP, get their location using geocoding, and return a history fact about ther country if it exists.
 * 
 * @returns country the user is found in
 */
export const getCountryByIp = async (): Promise<Country[]> => {
    try{
        const ip = await getIp();
        const location = await getLocationData(ip);

        const snapshot: QuerySnapshot = await getDocuments(collection);
        const countries: Country[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Country;
        });

        const matchedCountry = countries.filter(c => c.name.toLowerCase() === location.country_name.toLowerCase());

        return matchedCountry;
    } catch (error: unknown) {
        throw error;
    } 
};

/**
 * Returns true of false if a country exists already.
 * 
 * Used to validate so that you cannot input the same country twice.
 * 
 * @param countryData name of the country.
 * @returns {boolean} - true or false depending on the existence of the country name.
 */
const checkExisting = async (
    countryData: {name: string;}
) => {
    const countries = getCountry();

    const exists = (await countries).some(c => c.name.trim().toLowerCase() === countryData.name.trim().toLocaleLowerCase());

    return exists;
};