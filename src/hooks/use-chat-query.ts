import { useInfiniteQuery } from '@tanstack/react-query';

import { useSocket } from '@/components/providers/socket-provider';
import { getMessages } from '@/actions/messages';
import { getDirectMessages } from '@/actions/direct-messages';

interface ChatQueryProps {
  queryKey: string;
  actionType: 'messages' | 'direct-messages';
  paramKey: 'zoneId' | 'conversationId';
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  actionType,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam }: { pageParam: string }) => {
    if (actionType === 'messages') {
      const response = await getMessages({
        cursor: pageParam,
        [paramKey]: paramValue,
      });
      return response;
    } else if (actionType === 'direct-messages') {
      const response = await getDirectMessages({
        cursor: pageParam,
        [paramKey]: paramValue,
      });
      return response;
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      initialPageParam: '',
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
