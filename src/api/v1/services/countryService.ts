import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { Country } from "../models/countryhModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

const collection: string ="countries";

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
    name: string;
    data: {
        date: string;
        type: string;
        description: string;
        damage: string;
        resolution: string;
    }[]
}): Promise<Country> => {
    try {
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
    countryData: Pick<Country, "name" | "date" | "type" | "description" | "damage" | "resolution">,
): Promise<Country> => {
    try {
        const country: Country = await getCountryById(id);

        if (!country) {
            throw new Error(`Country with ${id} not found`);
        }

        const updateCountry: Country = {
            ...country,
        };

        if (countryData.name !== undefined) {
            countryData.name = countryData.name;
        }
        if (countryData.date !== undefined) {
            countryData.date = countryData.date;
        }
        if (countryData.type !== undefined) {
            countryData.type = countryData.type;
        }
        if (countryData.description !== undefined) {
            countryData.description = countryData.description;
        }
        if (countryData.damage !== undefined) {
            countryData.damage = countryData.damage;
        }
        if (countryData.resolution !== undefined) {
            countryData.resolution = countryData.resolution;
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