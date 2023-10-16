'use client';
import { createApi, fetchBaseQuery, FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react';
import { API_SERVER } from '@/constants';

interface Team {
  id: string;
}

export const teamsApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${API_SERVER}/teams`,
    validateStatus: () => true,  // handle status codes in transformResponse
  }),
  endpoints: (builder) => ({
    postTeam: builder.mutation({
      query: (team: Team) => ({ url: '', method: 'POST', body: team }),
      transformResponse (response: null, meta: FetchBaseQueryMeta) {
        if (!meta.response) {
          return true;
        } else if (meta.response.status == 201) {
          return true;
        } else if (meta.response.status == 422) {
          return false;
        } else {
          throw new Error("Oh no bad response status");
        }
      },
    }),
    deleteTeam: builder.mutation({
      query: (id: string) => ({ url: id, method: 'DELETE' }),
      transformResponse (response: null, meta: FetchBaseQueryMeta) {
        if (!meta.response) {
          return true;
        } else if (meta.response.status == 200) {
          return true;
        } else if (meta.response.status == 404) {
          return false;
        } else {
          throw new Error('Oh no bad response status');
        }
      },
    }),
    putTeam: builder.mutation({
      query: (team: Team) => ({
        url: team.id,
        method: 'PUT',
        body: team,
      }),
      transformResponse (response: null, meta: FetchBaseQueryMeta) {
        if (!meta.response) {
          return true;
        } else if (meta.response.status == 200) {
          return true;
        } else if (meta.response.status == 422) {
          return false;
        } else {
          throw new Error('Oh no bad response status');
        }
      },
    }),
  }),
});
