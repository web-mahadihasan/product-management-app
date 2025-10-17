import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

interface useAppMutationOptions<TData, TError, TVariables> extends UseMutationOptions<TData, TError, TVariables> {
  url: string;
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export const useAppMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
>({ 
  url, 
  method = 'POST', 
  ...mutationOptions 
}: useAppMutationOptions<TData, TError, TVariables>) => {
  const mutationFunction = async (input: TVariables) => {
    const response = await axiosInstance({
      url: url,
      method: method,
      data: input,
    });
    return response.data as TData;
  };

  return useMutation({
    mutationFn: mutationFunction,
    ...mutationOptions,
  });
};