import { configureStore } from '@reduxjs/toolkit'
import { userapi } from '../api/userapi'

export const store = configureStore({
    reducer: {
        userapi: userapi.reducer
    },
    middleware:(getDefaultMiddleware)=>[...getDefaultMiddleware(),userapi.middleware]
})