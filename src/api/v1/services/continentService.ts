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

/**
 * Uses Firebase logic to retreive all documents in continents collection.
 * 
 * @returns documents from continents collection.
 */
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

/**
 * Used to create a continent.
 * 
 * @param continentData Body data and fields you are trying to create a continent with.
 * @returns The newly created continent's id and it's contents.
 */
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

/**
 * Use to get a single continent by it's unique id.
 * 
 * @param id the continent's unique id
 * @returns the continent you fetched using it's unique id.
 */
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

/**
 * Updates the continent.
 * 
 * @param id targetted to update continent's unique id.
 * @param continentData the fields you want to update in the continent.
 * @returns Updated continent success message.
 */
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

/**
 * Deletes the continent.
 * 
 * @param id the unique id of the deleted continent.
 */
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

/**
 * Returns true of false if a continent exists already.
 * 
 * Used to validate so that you cannot input the same continent twice.
 * 
 * @param continentData name of the continent.
 * @returns {boolean} - true or false depending on the existence of the continent name.
 */
const checkExisting = async (
    continentData: {name: string;}
) => {
    const continents = getContinent();

    // Using some to return true of false if matching values from an array.
    const exists = (await continents).some(c => c.name.trim().toLowerCase() === continentData.name.trim().toLocaleLowerCase());

    return exists;
};