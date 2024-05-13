import { configureStore } from "@reduxjs/toolkit";
import MovieStore from "./reducer/movieRed";

export const store = configureStore({
    reducer: {
        MovieStore,
    },
});
