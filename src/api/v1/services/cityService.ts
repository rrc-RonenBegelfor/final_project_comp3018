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
        const newCity: Partial<City> = {
            ...cityData,
        };

        const cityId: string = await createDocument<City>(collection, newCity);

        return structuredClone({ id: cityId, ...newCity} as City);
    } catch (error: unknown) {
        throw error;
    }
};

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