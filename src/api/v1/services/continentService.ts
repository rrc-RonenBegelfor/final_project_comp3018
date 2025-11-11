import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { Continent } from "../models/continentModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

const collection: string ="continents";

export const getContinent = async(): Promise<Continent[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(collection);
        const continents: Continent[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Continent;
        });

        return continents;
    } catch (error: unknown) {
        throw error;
    }
};

export const createContinent = async (continentData: {
    name: string;
    number: number;
}): Promise<Continent> => {
    try {
        const newContinent: Partial<Continent> = {
            ...continentData,
        };

        const continentId: string = await createDocument<Continent>(collection, newContinent);

        return structuredClone({ id: continentId, ...newContinent} as Continent);
    } catch (error: unknown) {
        throw error;
    }
};

export const getContinentById = async (id: string): Promise<Continent> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            collection,
            id
        );

        if (!doc) {
            throw new Error(`Continent with ID ${id} not found`);
        }

        const data: DocumentData | undefined = doc.data();
        const continent: Continent = {
            id: doc.id,
            ...data,
        } as Continent;

        return structuredClone(continent);
    } catch (error: unknown) {
        throw error;
    }
};

export const updateContinent = async (
    id: string,
    continentData: Pick<Continent, "name" | "number">,
): Promise<Continent> => {
    try {
        const continent: Continent = await getContinentById(id);

        if (!continent) {
            throw new Error(`Continent with ${id} not found`);
        }

        const updateContinent: Continent = {
            ...continent,
            ...continentData,
        };

        await updateDocument<Continent>(collection, id, updateContinent);

        return structuredClone(updateContinent);
    } catch (error: unknown) {
        throw error;
    }
};

export const deleteContinent = async (id: string): Promise<void> => {
    try {
        const continent: Continent = await getContinentById(id);

        if (!continent) {
            throw new Error(`Continent with ${id} not found`);
        }

        await deleteDocument(collection, id);
    } catch (error: unknown) {
        throw error;
    }
};