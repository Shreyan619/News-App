import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const bookmarkapi = createApi({
    reducerPath: "bookmark",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1` }),
    endpoints: (build) => ({
        bookmark: build.mutation({
            query: (bookmark) => ({
                url: "/article/:articleId/user/:userId/bookmark",
                method: "POST",
                body: bookmark
            })
        }),
        removebookmark: build.mutation({
            query: (bookmark) => ({
                url: "/article/:articleId/user/:userId/bookmark/remove",
                method: "DELETE",
                body: bookmark
            })
        })
    })
})

export const { useBookmarkMutation, useRemovebookmarkMutation } = bookmarkapi

