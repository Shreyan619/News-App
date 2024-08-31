import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const spainapi = createApi({
    reducerPath: 'spainApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1` }),
    endpoints: (build) => ({
        scrapeSpain: build.query({
            query: (spain) => ({
                url: '/article/spanishnews',
                method: 'GET',
                // body: spain
            })
        }),
        scrapeSpainSport: build.query({
            query: (spain) => ({
                url: '/article/spanishsport',
                method: 'GET',
                // body: spain
            })
        })
    })
})

export const { useScrapeSpainQuery, useScrapeSpainSportQuery } = spainapi