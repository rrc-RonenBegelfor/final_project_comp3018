import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { City } from "../models/cityhModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

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

        const continentId: string = await createDocument<City>(collection, newCity);

        return structuredClone({ id: continentId, ...newCity} as City);
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
    cityData: Pick<City, "name" | "date" | "type" | "description" | "damage" | "resolution">,
): Promise<City> => {
    try {
        const city: City = await getCityById(id);

        if (!city) {
            throw new Error(`City with ${id} not found`);
        }

        const updateCity: City = {
            ...city,
        };

        if (cityData.name !== undefined) {
            cityData.name = cityData.name;
        }
        if (cityData.date !== undefined) {
            cityData.date = cityData.date;
        }
        if (cityData.type !== undefined) {
            cityData.type = cityData.type;
        }
        if (cityData.description !== undefined) {
            cityData.description = cityData.description;
        }
        if (cityData.damage !== undefined) {
            cityData.damage = cityData.damage;
        }
        if (cityData.resolution !== undefined) {
            cityData.resolution = cityData.resolution;
        }

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