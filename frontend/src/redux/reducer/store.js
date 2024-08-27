import { configureStore } from '@reduxjs/toolkit'
import { userapi } from '../api/userapi'
import { englishapi } from '../api/englishapi'
import { franceapi } from '../api/franceapi'
import { spainapi } from '../api/spainapi'

export const store = configureStore({
    reducer: {
        [userapi.reducerPath]: userapi.reducer,
        [englishapi.reducerPath]: englishapi.reducer,
        [franceapi.reducerPath]: franceapi.reducer,
        [spainapi.reducerPath]: spainapi.reducer
    },
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(),
    userapi.middleware,
    englishapi.middleware,
    franceapi.middleware,
    spainapi.middleware
    ]
})