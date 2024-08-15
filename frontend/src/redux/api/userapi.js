import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userapi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1` }),
    endpoints: (build) => ({
        create: build.mutation({
            query: (user) => ({
                url: '/user/create',
                method: "POST",
                body: user
            })
        })
    })
})

export const { useCreateMutation } = userapi