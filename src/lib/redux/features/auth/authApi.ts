import { baseApi } from '../../services/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      queryFn: (credentials) => {
        const { role } = credentials;
        return {
          data: {
            token: 'mock_jwt_token',
            user: { name: 'Md. Rahman', role: role || 'customer' },
          },
        };
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
