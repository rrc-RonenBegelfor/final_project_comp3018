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
import { getCountry } from "../services/countryService";

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
    continent_code: string;
    number: {
        human: number;
        natural: number;
        human_natural: number;
    };
}): Promise<Continent> => {
    try {
        if (await checkExisting({name: continentData.name})) {
            throw new Error(`Continent with name ${continentData.name} already exists`);
        }

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
): Promise<Continent> => {
    try {
        const continent: Continent = await getContinentById(id);

        if (!continent) {
            throw new Error(`Continent with ${id} not found`);
        }

        const countries = await getCountry();

        const countriesInContinent = countries.filter(c => c.continentId === continent.continent_code);

        const numbers = {
            human: 0,
            natural: 0,
            human_natural: 0,
        }

        countriesInContinent.forEach(country => {
            country.data.forEach(event => {
                const type = event.type.trim().toLowerCase();
                
                if (type === "human") {
                    numbers.human++;
                } else if (type === "natural") {
                    numbers.natural++;
                } else if (type === "human/natural" || type === "natural/human") {
                    numbers.human_natural++;
                }
            })
        })

        const updateContinent: Continent = {
            ...continent,
            number: numbers,
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

// Using some to return true of false if matching values from an array.
const checkExisting = async (
    continentData: {name: string;}
) => {
    const continents = getContinent();

    const exists = (await continents).some(c => c.name.trim().toLowerCase() === continentData.name.trim().toLocaleLowerCase());

    return exists;
};