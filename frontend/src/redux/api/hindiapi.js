import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const hindiapi = createApi({
    reducerPath: 'spainapi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1` }),
    endpoints: (build) => ({
        scrapeHindi: build.query({
            query: (hindi) => ({
                url: '/article/hindinews',
                method: 'GET',
                body: hindi
            })
        }),
        scrapeHindiBusiness: build.query({
            query: (hindi) => ({
                url: '/article/hindibusiness',
                method: 'GET',
                body: hindi
            })
        })
    })
})

export const { useScrapeHindiQuery, useScrapeHindiBusinessQuery } = hindiapi