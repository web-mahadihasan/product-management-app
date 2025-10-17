import { useQuery, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

interface useAppQueryOptions<T> extends UseQueryOptions<T> {
  url: string;
}

export const useAppQuery = <T,>({ url, ...reactQueryOptions }: useAppQueryOptions<T>) => {
  const fetchFunction = async () => {
    const response = await axiosInstance.get(url);
    return response.data as T;
  };

  const queryKey: QueryKey = reactQueryOptions.queryKey ?? [url];

  return useQuery({
    queryFn: fetchFunction,
    ...reactQueryOptions,
    queryKey,
    refetchOnWindowFocus: false,
  });
};