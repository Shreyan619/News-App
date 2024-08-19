import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const englishapi = createApi({
    reducerPath: 'englishapi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1` }),
    endpoints: (build) => ({
        scrapeEnglish: build.query({
            query: (english) => ({
                url: '/article/english',
                method: 'GET',
                body: english
            })
        })
    })

})

export const { useEnglishApi } = englishapi 