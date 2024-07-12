import { configureStore } from "@reduxjs/toolkit";
import data from "./reducer";

const store = configureStore({
    reducer: {
        data
    }
});
export default store