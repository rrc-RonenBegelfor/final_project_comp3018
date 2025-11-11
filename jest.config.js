module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/server.ts",
        "!src/types/**/*.ts",
    ],
    setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
};