import { configureStore } from '@reduxjs/toolkit'
import { userapi } from '../api/userapi'
import { englishapi } from '../api/englishapi'
import { franceapi } from '../api/franceapi'
import { spainapi } from '../api/spainapi'
import { hindiapi } from "../api/hindiapi"
import { latestapi } from '../api/latestapi'
import { bookmarkapi } from "../api/bookmarkapi"

// const endpointLoggerMiddleware = store => next => action => {
//     if (action.meta && action.meta.arg && action.meta.arg.endpointName) {
//         console.log('Endpoint Name:', action.meta.arg.endpointName);
//     }
//     return next(action);
// }
export const store = configureStore({
    reducer: {
        [userapi.reducerPath]: userapi.reducer,
        [englishapi.reducerPath]: englishapi.reducer,
        [franceapi.reducerPath]: franceapi.reducer,
        [spainapi.reducerPath]: spainapi.reducer,
        [hindiapi.reducerPath]: hindiapi.reducer,
        [latestapi.reducerPath]: latestapi.reducer,
        [bookmarkapi.reducerPath]: bookmarkapi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        userapi.middleware,
        englishapi.middleware,
        franceapi.middleware,
        spainapi.middleware,
        hindiapi.middleware,
        latestapi.middleware,
        bookmarkapi.middleware
        // endpointLoggerMiddleware
    )
})

