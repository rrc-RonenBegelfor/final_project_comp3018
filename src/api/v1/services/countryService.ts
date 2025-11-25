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

const checkExisting = async (
    countryData: {name: string;}
) => {
    const countries = getCountry();

    const exists = (await countries).some(c => c.name.trim().toLowerCase() === countryData.name.trim().toLocaleLowerCase());

    return exists;
};