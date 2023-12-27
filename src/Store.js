import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./Slices/UserSlice";
import podcastReducer from "./Slices/PodcastSlice.js";

export const store = configureStore({
    reducer: {
        user: userReducer,
        podcasts: podcastReducer,
    },
});