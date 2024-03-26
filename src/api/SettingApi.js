import useHttp from "@/hooks/useHttp";
import { useMutation, useQuery } from "react-query";

export const useGetMediaServer = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/get_media_server", { params: params, method: "GET" })
  );
};
export const useSaveMediaServer = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_media_server", { params: params, method: "POST" })
  );
};
export const useGetDownloadClient = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/get_download_client", { params: params, method: "GET" })
  );
};
export const useSaveDownloadClient = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_download_client", { params: params, method: "POST" })
  );
};
export const useDeleteDownloadClient = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/delete_download_client", { params: params, method: "GET" })
  );
};
export const useGetMovieMetadata = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/get_movie_metadata", { params: params, method: "GET" })
  );
};
export const useDeleteMediaServer = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/delete_media_server", { params: params, method: "GET" })
  );
};
export const useSaveTmdb = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_tmdb", { params: params, method: "POST" })
  );
};
export const useSaveFanArt = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_fanart", { params: params, method: "POST" })
  );
};
export const useSaveDouban = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_douban", { params: params, method: "POST" })
  );
};
export const useGetWeb = (param) => {
  const client = useHttp();
  return useQuery(["getWebSetting", param], () =>
    client("/api/setting/get_web", { params: param, method: "GET" })
  );
};
export const useSaveWeb = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_web", { params: params, method: "POST" })
  );
};

export const useGetPassCloudflare = (param) => {
  const client = useHttp();
  return useQuery(["getWebSetting", param], () =>
    client("/api/setting/get_pass_cloudflare", { params: param, method: "GET" })
  );
};
export const useSavePassCloudflare = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_pass_cloudflare", { params: params, method: "POST" })
  );
};

export const useGetCookieCloud = (param) => {
  const client = useHttp();
  return useQuery(["get_cookie_cloud", param], () =>
    client("/api/setting/get_cookie_cloud", { params: param, method: "GET" })
  );
};
export const useSaveCookieCloud = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_cookie_cloud", { params: params, method: "POST" })
  );
};

export const useCheckCookieCloud = (param) => {
  const client = useHttp();
  return useQuery(["check_cookie_cloud", param], () =>
    client("/api/setting/check_cookie_cloud", { params: param, method: "GET" })
  );
};
export const useGetCookiesFromCookieCloud = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/get_cookies_from_cookie_cloud", { params: params, method: "GET" })
  );
};
export const useGetNotifySetting = (param) => {
  const client = useHttp();
  return useQuery(["getNotifySetting", param], () =>
    client("/api/setting/get_notify", { params: param, method: "GET" })
  );
};

export const useGetNotifyDefinition = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/notify/get_definition", { params: params, method: "GET" })
  );
};
export const useGetNotifyChannelList = (param) => {
  const client = useHttp();
  return useQuery(["get_channel_list", param], () =>
    client("/api/notify/get_channel_list", { params: param, method: "GET" })
  );
};
export const useSaveNotify = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_notify", { params: params, method: "POST" })
  );
};
export const useSetNotifyEnable = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/set_notify_enable", { params: params, method: "POST" })
  );
};
export const useTestNotify = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/test_notify", { params: params, method: "POST" })
  );
};
export const useDeleteNotify = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/delete_notify", { params: params, method: "GET" })
  );
};
export const useSetFreeDownloadEnable = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/set_free_download_enable", { params: params, method: "POST" })
  );
};
export const useSaveFreeDownload = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_free_download", { params: params, method: "POST" })
  );
};
export const useGetFreeDownloadSetting = (param) => {
  const client = useHttp();
  return useQuery(["getFreeDownloadSetting", param], () =>
    client("/api/setting/get_free_download", { params: param, method: "GET" })
  );
};
export const useGetSettingStatus = (param) => {
  const client = useHttp();
  return useQuery(["getSettingStatus", param], () =>
    client("/api/setting/get_status", { params: param, method: "GET" })
  );
};
export const useSetSubtitleEnable = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/set_subtitle_enable", { params: params, method: "POST" })
  );
};
export const useGetSubtitleSetting = (param) => {
  const client = useHttp();
  return useQuery(["getSubtitleSetting", param], () =>
    client("/api/setting/get_subtitle", { params: param, method: "GET" })
  );
};
export const useSaveSubtitle = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_subtitle", { params: params, method: "POST" })
  );
};
export const useGetServerSetting = (param) => {
  const client = useHttp();
  return useQuery(["getWebSetting", param], () =>
    client("/api/setting/get_server_setting", { params: param, method: "GET" })
  );
};
export const useGetLinkSetting = (param) => {
  const client = useHttp();
  return useQuery(["getWebSetting", param], () =>
    client("/api/setting/get_link_setting", { params: param, method: "GET" })
  );
};
export const useSaveLinkSetting = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_link_setting", { params: params, method: "POST" })
  );
};
export const useSaveServerSetting = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_server_setting", { params: params, method: "POST" })
  );
};
export const useAddSearchTemplate = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/add_search_template", { params: params, method: "POST" })
  );
};
export const useGetSearchTemplate = (param) => {
  const client = useHttp();
  return useQuery(["get_search_template", param], () =>
    client("/api/setting/get_search_template", { params: param, method: "GET" })
  );
};
export const useDeleteSearchTemplate = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/delete_search_template", { params: params, method: "GET" })
  );
};
export const useUpdateSearchTemplate = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/update_search_template", { params: params, method: "POST" })
  );
};
export const useGetNotifyTemplate = (param) => {
  const client = useHttp();
  return useQuery(["getNotifyTemplate", param], () =>
    client("/api/setting/get_notify_template", { params: param, method: "GET" })
  );
};
export const useSaveNotifyTemplate = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_notify_template", { params: params, method: "POST" })
  );
};
export const useGetScraper = (param) => {
  const client = useHttp();
  return useQuery(["getScraper", param], () =>
    client("/api/setting/get_scraper", { params: param, method: "GET" })
  );
};
export const useSaveScraper = (param) => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/setting/save_scraper", { params: params, method: "POST" })
  );
};