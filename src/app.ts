import express from "express";
import dotenv from "dotenv";

dotenv.config()

import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import continentRoutes from "./api/v1/routes/continentRoutes";
import countryRoutes from "./api/v1/routes/countryRoutes";
import citiesRoutes from "./api/v1/routes/cityRoutes";
import userRoutes from "./api/v1/routes/userRoutes";
import adminRoutes from "./api/v1/routes/adminRoutes";
import locationRoutes from "./api/v1/routes/locationRoutes";
import setupSwagger from "./config/swagger";
import morgan from "morgan";

const app = express();

app.use(accessLogger);
app.use(errorLogger);
app.use(consoleLogger);

// Body parsing middleware
app.use(express.json());
app.use(morgan("combined"));
setupSwagger(app);

// API Routes
app.use("/api/v1/continents", continentRoutes);
app.use("/api/v1/countries", countryRoutes);
app.use("/api/v1/cities", citiesRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/location", locationRoutes);

// Global error handling middleware (MUST be applied last)
app.use(errorHandler);

export default app;