import React from "react";
import async from "./components/Async";
import AuthGuard from "./components/guards/AuthGuard";
import AuthLayout from "./layouts/Auth";

// Auth components
import SignIn from "./pages/auth/SignIn";
import Page404 from "./pages/auth/Page404";
import Page500 from "./pages/auth/Page500";

const DashboardLayout = async(() => import("./layouts/Dashboard"));
const MovieAnalyze = async(() => import("./pages/movie/analyze"));
const MovieSearch = async(() => import("./pages/movie/search"));
const DownloadRecord = async(() => import("./pages/download/record"));
const SiteDashboard = async(() => import("./pages/site"));
const InitMediaServer = async(() => import("./pages/config/MediaServer"));
const InitDownloadClient = async(() => import("./pages/config/DownloadClient"));
const InitMediaPath = async(() => import("./pages/config/MediaPath"));
const InitMovieMetadata = async(() => import("./pages/config/MovieMetadata"));
const InitWeb = async(() => import("./pages/config/Web"));
const InitAdminUser = async(() => import("./pages/config/AdminUser"));
const DoubanConfig = async(() => import("./pages/config/DoubanConfig"));
const NotifyConfig = async(() => import("./pages/config/NotifyConfig"));
const Notify = async(() => import("./pages/notify/index"));
const FreeDownloadConfig = async(() => import("./pages/config/FreeDownload"));
const UserManager = async(() => import("./pages/user/Index"));
const EditUser = async(() => import("./pages/user/EditUser"));
const InviteEmail = async(() => import("./pages/user/InviteEmail"));
const MovieRankingList = async(() => import("./pages/subscribe/MovieRankingList"));
const TVRankingList = async(() => import("./pages/subscribe/TVRankingList"));
const RecentPopularMovieList = async(() => import("./pages/subscribe/RecentPopularMovieList"));
const RecentPopularTVList = async(() => import("./pages/subscribe/RecentPopularTVList"));
const SubscribeList = async(() => import("./pages/subscribe/list"));
const EditSubCustomFilter = async(() => import("./pages/subscribe/Custom/EditCustomFilter"));
const SubscribeSearch = async(() => import("./pages/subscribe/Search"));
const ScoreRuleConfig = async(() => import("./pages/config/ScoreRuleConfig"));
const Selectors = async(() => import("./pages/selectors"));
const SelectorsEditFilter = async(() => import("./pages/selectors/Filter/Edit"));
const SearchPage = async(() => import("./pages/search/index"));
const Setting = async(() => import("./pages/setting"));
const EditMediaServer = async(() => import("./pages/setting/MediaServer/EditMediaServer"));
const EditDownloadClient = async(() => import("./pages/setting/DownloadClient/Edit"));
const EditTmdb = async(() => import("./pages/setting/MovieMetadata/EditTmdb"));
const EditFanArt = async(() => import("./pages/setting/MovieMetadata/EditFanArt"));
const EditDouban = async(() => import("./pages/setting/MovieMetadata/EditDouban"));
const EditWeb = async(() => import("./pages/setting/Advanced/EditWeb"));
const EditNotify = async(() => import("./pages/setting/Notify/Edit"));
const EditFreeDownload = async(() => import("./pages/setting/Advanced/EditFreeDownload"));
const EditSubtitle = async(() => import("./pages/setting/Advanced/EditSubtitle"));
const EditSearchSetting = async(() => import("./pages/setting/Advanced/EditSearchSetting"));
const EditLink = async(() => import("./pages/setting/Advanced/EditLink"));
const MediaLinkIndex = async(() => import("./pages/media/Link/index"));
const HomePage = async(() => import("./pages/home"));

const routes = [{
    path: "auth", element: <AuthLayout/>, children: [{
        path: "sign-in", element: <SignIn/>
    }, {
        path: "404", element: <Page404/>
    }, {
        path: "500", element: <Page500/>
    }]
}, {
    path: "setup", element: <AuthLayout/>, children: [{
        path: "admin", element: <InitAdminUser/>
    }, {
        path: "web", element: <InitWeb/>
    }, {
        path: "media-server", element: <AuthGuard><InitMediaServer/></AuthGuard>
    }, {
        path: "download-client", element: <AuthGuard><InitDownloadClient/></AuthGuard>
    }, {
        path: "media-path", element: <AuthGuard><InitMediaPath/></AuthGuard>
    }, {
        path: "movie-metadata", element: <AuthGuard><InitMovieMetadata/></AuthGuard>
    }]
}, {
    path: "config", element: <AuthGuard>
        <DashboardLayout/>
    </AuthGuard>, children: [{
        path: "web", element: <InitWeb/>
    }, {
        path: "media-server", element: <InitMediaServer/>
    }, {
        path: "download-client", element: <InitDownloadClient/>
    }, {
        path: "media-path", element: <InitMediaPath/>
    }, {
        path: "movie-metadata", element: <InitMovieMetadata/>
    }, {
        path: "notify", element: <NotifyConfig/>
    }, {
        path: "free-download", element: <FreeDownloadConfig/>
    }, {
        path: "score-config", element: <ScoreRuleConfig/>
    }]
}, {
    path: "setting", element: <AuthGuard>
        <DashboardLayout/>
    </AuthGuard>, children: [
        {
            path: "index",
            element: <Setting/>
        }, {
            path: 'edit-media-server',
            element: <EditMediaServer/>
        }, {
            path: 'edit-download-client',
            element: <EditDownloadClient/>
        }, {
            path: 'edit-tmdb',
            element: <EditTmdb/>
        }, {
            path: 'edit-fanart',
            element: <EditFanArt/>
        }, {
            path: 'edit-douban',
            element: <EditDouban/>
        }, {
            path: 'edit-web',
            element: <EditWeb/>
        }, {
            path: 'edit-notify',
            element: <EditNotify/>
        }, {
            path: 'edit-free-download',
            element: <EditFreeDownload/>
        }, {
            path: 'edit-subtitle',
            element: <EditSubtitle/>
        }, {
            path: 'edit-search-setting',
            element: <EditSearchSetting/>
        }, {
            path: 'edit-link',
            element: <EditLink/>
        }
    ]
}, {
    path: "smartDownload", element: <AuthGuard>
        <DashboardLayout/>
    </AuthGuard>, children: [{
        path: "douban", element: <DoubanConfig/>
    }, {
        path: "selectors", element: <Selectors/>
    }, {
        path: "edit-filter", element: <SelectorsEditFilter/>
    }]
}, {
    path: "/", element: (<AuthGuard>
        <DashboardLayout/>
    </AuthGuard>), children: [{
        path: "", element: <HomePage/>
    }]
},{
    path: "/home", element: (<AuthGuard>
        <DashboardLayout/>
    </AuthGuard>), children: [{
        path: "", element: <HomePage/>
    }]
}, {
    path: "movie", element: (<AuthGuard><DashboardLayout/></AuthGuard>), children: [{
        path: "default", element: <MovieAnalyze/>
    }, {
        path: "analyze", element: <MovieAnalyze/>
    }, {
        path: "search", element: <MovieSearch/>
    }]
}, {
    path: "download", element: (<AuthGuard><DashboardLayout/></AuthGuard>), children: [{
        path: "default", element: <DownloadRecord/>
    }, {
        path: "record", element: <DownloadRecord/>
    }]
}, {
    path: "site", element: (<AuthGuard><DashboardLayout/></AuthGuard>), children: [{
        path: "dashboard", element: <SiteDashboard/>
    }]
}, {
    path: "notify", element: (<AuthGuard><DashboardLayout/></AuthGuard>), children: [{
        path: "list", element: <Notify/>
    }]
}, {
    path: "user", element: (<AuthGuard><DashboardLayout/></AuthGuard>), children: [{
        path: "index", element: <UserManager/>
    }, {
        path: "edit", element: <EditUser/>
    }, {
        path: "invite-email", element: <InviteEmail/>
    }]
}, {
    path: "subscribe", element: (<AuthGuard><DashboardLayout/></AuthGuard>), children: [{
        path: "movieRankingList", element: <MovieRankingList/>
    }, {
        path: "tvRankingList", element: <TVRankingList/>
    }, {
        path: "recentPopularMovieList", element: <RecentPopularMovieList/>
    }, {
        path: "recentPopularTVListList", element: <RecentPopularTVList/>
    }, {
        path: "search", element: <SubscribeSearch/>
    }, {
        path: "list", element: <SubscribeList/>
    }, {
        path: "edit-custom-filter", element: <EditSubCustomFilter/>
    }]
}, {
    path: "media", element: (<AuthGuard><DashboardLayout/></AuthGuard>), children: [{
        path: "link-index", element: <MediaLinkIndex/>
    }]
}, {
    path: "*", element: <AuthLayout/>, children: [{
        path: "*", element: <Page404/>
    }]
}];

export default routes;
