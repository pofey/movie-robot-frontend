// 订阅列表
import useHttp from "@/hooks/useHttp";
import { useInfiniteQuery, useQuery } from "react-query";

export const useMovieDimension = () => {
    const client = useHttp();
    return useQuery(['movieDimension'], () =>
        client("/api/movie/dimension")
    );
}

export const useDoubanRanking = (param) => {
    const client = useHttp();
    return useQuery(['doubanRanking', param], () =>
        client("/api/movie/douban_rank_list", { params: param })
    );
}
export const useGetPlaylistItems = (param) => {
    const client = useHttp();
    return useQuery(['playlist_items', param], () =>
      client("/api/movie/playlist_items", { params: param })
    );
}
export const useGetDoubanSuggestion = () => {
    const client = useHttp();
    return useInfiniteQuery(['douban_suggestion'],
        async ({ pageParam = 0 }) => {
            const res = await client("/api/movie/douban_suggestion", { params: { start: pageParam }, method: "GET" })
            return res.data
        }, {
        getNextPageParam: (lastPage) => {
            return lastPage.has_more ? lastPage.next_start : null
        }
    }
    );
};

export const useSearchKeywordCache = (param) => {
    const client = useHttp();
    return useQuery(['getSearchKeywordCache', param], () =>
        client("/api/movie/get_search_keyword_cache", { params: param, method: "GET" })
    );
};