import { configureStore } from '@reduxjs/toolkit'
import { userapi } from '../api/userapi'
import { englishapi } from '../api/englishapi'
import { franceapi } from '../api/franceapi'
import { spainApi } from '../api/spainapi'
import { hindiapi } from "../api/hindiapi"
import { latestapi } from '../api/latestapi'

export const store = configureStore({
    reducer: {
        [userapi.reducerPath]: userapi.reducer,
        [englishapi.reducerPath]: englishapi.reducer,
        [franceapi.reducerPath]: franceapi.reducer,
        [spainApi.reducerPath]: spainApi.reducer,
        [hindiapi.reducerPath]: hindiapi.reducer,
        [latestapi.reducerPath]:latestapi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        userapi.middleware,
        englishapi.middleware,
        franceapi.middleware,
        spainApi.middleware,
        hindiapi.middleware,
        latestapi.middleware
    )
})