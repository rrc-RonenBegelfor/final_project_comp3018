/**
 * Continent Model
 */
export interface Continent {
    id?: string;
    name: string;
    continent_code: string;
    number: {
        human: number;
        natural: number;
        human_natural: number;
    };
};