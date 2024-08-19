import { configureStore } from '@reduxjs/toolkit'
import { userapi } from '../api/userapi'
import { englishapi } from '../api/englishapi'

export const store = configureStore({
    reducer: {
        [userapi.reducerPath]: userapi.reducer,
        [englishapi.reducerPath]: englishapi.reducer
    },
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(),
    userapi.middleware,
    englishapi.middleware
    ]
})