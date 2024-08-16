import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from '../../../../backend/src/models/user.model'

export const userapi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1` }),
    endpoints: (build) => ({
        login: build.mutation({
            query: (user) => ({
                url: '/user/login',
                method: "POST",
                body: user
            })
        }),
        create: build.mutation({
            query: (user) => ({
                url: '/user/create',
                method: "POST",
                body: user
            })
        })
    })
})

export const { useLoginMutation, useCreateMutation } = userapi