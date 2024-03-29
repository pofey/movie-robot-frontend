import React, {useState} from 'react';
import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import {FilterOptionsProvider} from "@/contexts/FilterOptionsProvider";
import { useDoubanRanking, useGetPlaylistItems } from "@/api/MovieApi";
import ListView from "@/pages/subscribe/components/ListView";
import SubLogDialog from "@/pages/subscribe/SubLogDialog";

const Wall = ({trendingType, showSubLogs}) => {
  const {
    data: subjects,
    isLoading: subjectsIsLoading
  } = useGetPlaylistItems({ playlist_code: "movie_user_sub_week_top" });
  console.log(subjects)
    return (
        <>
            <ListView
                items={subjects?.data.map((item) => {
                    return {
                        douban_id: item.doubanId,
                        cn_name: item.title,
                        poster_path: item.posterUrl,
                        rating: item.rating,
                        sub_id: item.sub_id,
                        status: item.status,
                        release_year: item.releaseYear,
                        type: item.mediaType,
                        url: `https://movie.douban.com/subject/${item.doubanId}/`,
                        app_url: `douban://douban.com/movie/${item.doubanId}`,
                        desc: item.intro
                    }
                }) ?? []}
                isLoading={subjectsIsLoading}
                showSubLogs={showSubLogs}
            />
        </>
    );
};
const UserMovieTrend = () => {
    const [subLogData, setSubLogData] = useState(null);
    return (
        <>
            <Helmet title="用户订阅电影周榜"/>
            <PageTitle text="用户订阅电影周榜"/>
            <FilterOptionsProvider>
                <SubLogDialog subId={subLogData?.subId}
                              title={subLogData?.title ? `${subLogData?.title}的订阅全息日志` : "未知信息"}
                              open={Boolean(subLogData)}
                              handleClose={() => setSubLogData(null)}/>
                <Wall trendingType="movie_top250" showSubLogs={setSubLogData}/>
            </FilterOptionsProvider>
        </>
    )
}

export default UserMovieTrend