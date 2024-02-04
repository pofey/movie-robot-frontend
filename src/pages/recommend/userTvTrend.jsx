import React, { useState } from "react";
import PageTitle from "@/components/PageTitle";
import { Helmet } from "react-helmet-async";
import { FilterOptionsProvider } from "@/contexts/FilterOptionsProvider";
import { useGetPlaylistItems } from "@/api/MovieApi";
import ListView from "@/pages/subscribe/components/ListView";
import SubLogDialog from "@/pages/subscribe/SubLogDialog";

const Wall = ({ trendingType, showSubLogs }) => {
  const {
    data: subjects,
    isLoading: subjectsIsLoading
  } = useGetPlaylistItems({ playlist_code: "tv_user_sub_week_top" });
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
            url: item.url,
            app_url: item.app_url,
            desc: item.intro,
            season: item.seasonList?.map((s) => {
              return {
                doubanId: s.doubanId,
                seasonNumber: s.seasonNumber,
                releaseYear:s.airDate?.toString().substring(0, 4),
              };
            })
          };
        }) ?? []}
        isLoading={subjectsIsLoading}
        showSubLogs={showSubLogs}
      />
    </>
  );
};
const UserTvTrend = () => {
  const [subLogData, setSubLogData] = useState(null);
  return (
    <>
      <Helmet title="用户订阅剧集周榜" />
      <PageTitle text="用户订阅剧集周榜" />
      <FilterOptionsProvider>
        <SubLogDialog subId={subLogData?.subId}
                      title={subLogData?.title ? `${subLogData?.title}的订阅全息日志` : "未知信息"}
                      open={Boolean(subLogData)}
                      handleClose={() => setSubLogData(null)} />
        <Wall trendingType="movie_top250" showSubLogs={setSubLogData} />
      </FilterOptionsProvider>
    </>
  );
};

export default UserTvTrend;