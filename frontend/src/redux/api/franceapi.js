import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const franceapi = createApi({
    reducerPath: 'franceapi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1` }),
    endpoints: (build) => ({
        scrapeFrance: build.query({
            query: (france) => ({
                url: '/article/frenchnews',
                method: 'GET',
                body: france
            })
        })
    })
})

export const { useScrapeFranceQuery } = franceapi