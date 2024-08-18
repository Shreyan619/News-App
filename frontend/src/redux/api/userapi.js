import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userapi = createApi({
    reducerPath: 'userapi',
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
            query: (user) => {
                const formData = new FormData()

                formData.append('name', user.name);
                formData.append('email', user.email);
                formData.append('password', user.password);
                formData.append('provider', user.provider);

                if (user.picture) {
                    formData.append('picture', user.picture);
                }
                return {
                    url: '/user/create',
                    method: "POST",
                    body: formData,
                    // headers: {
                    //     'Content-Type': 'multipart/form-data',
                    // }
                }
            }
        })
    })
})

export const { useLoginMutation, useCreateMutation } = userapi