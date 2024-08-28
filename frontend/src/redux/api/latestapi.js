import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const latestapi = createApi({
    reducerPath: 'franceapi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1` }),
    endpoints: (build) => ({
        scrapLatest: build.query({
            query: (latest) => ({
                url: '/article/popularnews',
                method: 'GET',
                // body: latest
            })
        }),
        // scrapeFranceTech: build.query({
        //     query: (france) => ({
        //         url: '/article/frenchtech',
        //         method: 'GET',
        //         body: france
        //     })
        // })
    })
})

export const { useScrapLatestQuery } = latestapi