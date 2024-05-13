import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
};

const movieSlice = createSlice({
    name: "MOVIE_SLICE",
    initialState,
    reducers: {
        storeMovieData: (state, actions) => {
            state.data = actions.payload;
        },
    },
});

export default movieSlice.reducer;
export const { storeMovieData } = movieSlice.actions;
