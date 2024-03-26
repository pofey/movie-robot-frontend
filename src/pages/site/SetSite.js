import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Link,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../utils/request";
import { useGetCookiesFromCookieCloud } from "@/api/SettingApi";

const AUTH_TYPES = {
  "cookies": "Cookies认证",
  "user": "用户名密码认证",
  "api_key": "API密钥"
};
const SetSite = ({ opType, open, site, siteMeta, filterSiteNames, onClose, onEditSuccess, onEditFailed }) => {
  const [values, setValues] = React.useState({
    site_name: "mteam",
    cookie: "",
    web_search: true,
    smart_download: true,
    traffic_management_status: 0,
    upload_kpi: 1024,
    proxies: "",
    user_agent: "",
    auth_type: "user",
    auth_username: "",
    auth_password: "",
    api_key: ""
  });
  const { mutate: getCookies } = useGetCookiesFromCookieCloud();
  const [siteData, setSiteData] = useState(siteMeta);
  const [errors, setErrors] = React.useState({});
  const [showErrors, setShowErrors] = React.useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [allowAuthType, setAllowAuthType] = useState(["cookies", "user", "api_key"]);
  const handleValueChange = (e) => {
    if (e.target.type === "checkbox") {
      setValues({ ...values, [e.target.name]: e.target.checked });
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };
  const onSubmit = async (values) => {
    setSubmitting(true);
    let hasError = false;
    if (values.site_name === undefined || values.site_name === "") {
      setErrorMessage("必须选择站点");
      hasError = true;
    } else {
      setErrorMessage(undefined);
    }
    if (hasError) {
      setSubmitting(false);
      return;
    } else {
      setErrors({});
      setShowErrors({});
    }
    try {
      setMessage("保存中，请稍后....");
      const res = await axios.post("/api/site/save_site", values);
      const { code, message, data } = res;
      if (code === undefined || code === 1) {
        setErrorMessage(message);
        return;
      }
      onEditSuccess(opType, values);
    } catch (error) {
      const message = error.message || "配置出错啦";
      setErrorMessage(message);
      if (onEditFailed !== undefined) {
        onEditFailed(error, opType, values);
      }
    } finally {
      setMessage(undefined);
      setSubmitting(false);
    }
  };
  useEffect(() => {
    setErrors({});
    setShowErrors({});
    setErrorMessage(undefined);
    if (opType === "add" && filterSiteNames !== undefined && filterSiteNames.length > 0) {
      let data = [];
      siteMeta.map((val, i) => {
        if (!filterSiteNames.includes(val.id)) {
          data.push(val);
        }
      });
      setSiteData(data);
      if (data.length > 0) {
        setValues({ ...values, site_name: data[0].id });
      }
    } else {
      setSiteData(siteMeta);
    }
    if (site !== undefined && site !== null) {
      if (site.allow_auth_type) {
        setAllowAuthType(site.allow_auth_type);
      }
      getCookies({
        domain: site.domain
      }, {
        onSuccess: (res) => {
          let cookies = "";
          if (res.data) {
            cookies = res.data;
          }
          setValues({
            site_name: site.site_name,
            cookie: cookies || site.cookie,
            web_search: site.web_search === 1,
            smart_download: site.smart_download === 1,
            traffic_management_status: site.traffic_management_status,
            upload_kpi: site.upload_kpi,
            proxies: site?.proxies,
            user_agent: site?.user_agent ? site.user_agent : "",
            auth_username: site?.auth_username ? site.auth_username : "",
            auth_type: site?.auth_type ? site?.auth_type : "cookies",
            api_key: site?.api_key ? site.api_key : ""
          });
        }
      });
    } else {
      setValues({
        site_name: "",
        cookie: "",
        web_search: true,
        smart_download: true,
        traffic_management_status: 0,
        upload_kpi: 1024,
        proxies: "",
        user_agent: "",
        auth_type: "user",
        auth_username: "",
        auth_password: "",
        api_key: ""
      });
    }
  }, [opType, site, filterSiteNames]);
  return (<Dialog
    open={open}
    onClose={!submitting ? onClose : null}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">{opType === "add" ? "新增站点" : "编辑站点"}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        站点将用于搜索和智能下载任务，采用爬虫技术抓取信息供程序调用。
      </DialogContentText>
      {errorMessage && (<Alert mt={2} mb={1} severity="warning">
        {errorMessage}
      </Alert>)}
      {message && (<Alert severity="info" my={3}>
        {message}
      </Alert>)}
      <FormControl fullWidth>
        <Select
          name="site_name"
          value={values.site_name}
          onChange={(e) => {
            handleValueChange(e);
            const site = siteMeta.find((item) => item.id === e.target.value);
            if (site) {
              setAllowAuthType(site.allow_auth_type);
            }
            const domain = site?.domain;
            if (domain) {
              getCookies({
                domain
              }, {
                onSuccess: (res) => {
                  let cookies = "";
                  if (res.data) {
                    cookies = res.data;
                  }
                  setValues(currentValues => ({
                    ...currentValues,
                    cookie: cookies,
                    site_name: e.target.value
                  }));
                }
              });
            }
          }}
          disabled={opType === "update"}
        >
          {siteData && siteData.map((row) => (
            <MenuItem key={row.id} value={row.id}>{row.name + "-" + row.domain}</MenuItem>))}
        </Select>
        <FormHelperText>传播盗版以及教唆他人使用盗版都是违法行为，产品为自动化工具不提供任何站点接入，请自行研究学习使用</FormHelperText>
      </FormControl>
      <FormControl fullWidth>
        <Select
          name="auth_type"
          value={values.auth_type}
          onChange={(e) => handleValueChange(e)}
        >
          {allowAuthType && allowAuthType.length > 0 && allowAuthType.map((item) => (
            <MenuItem key={item} value={item}>{AUTH_TYPES[item]}</MenuItem>
          ))}
        </Select>
        <FormHelperText>敏感信息采用AES加密存储在本地；</FormHelperText>
      </FormControl>
      {values.auth_type === "api_key" && <>
        <TextField
          type="text"
          name="api_key"
          margin="dense"
          label="API密钥"
          fullWidth
          value={values.api_key}
          onChange={handleValueChange}
          error={Boolean(showErrors.api_key && errors.api_key)}
          helperText={(showErrors.api_key && errors.api_key) || (
            <span>
                        使用网站提供的apiKey获取信息（需站点支持）
                    </span>
          )}
        /></>}
      {values.auth_type === "cookies" && <>
        <TextField
          type="text"
          name="cookie"
          margin="dense"
          label="Cookie"
          fullWidth
          value={values.cookie}
          onChange={handleValueChange}
          error={Boolean(showErrors.cookie && errors.cookie)}
          helperText={(showErrors.cookie && errors.cookie) || (
            <span>
                        使站点保持登陆状态的有效Cookie
                        <Link target="_blank"
                              href="https://support.huaweicloud.com/vss_faq/vss_01_0146.html">
                                去学习如何获取
                            </Link>
                    </span>
          )}
        />
        <TextField
          type="text"
          name="user_agent"
          margin="dense"
          label="User-Agent"
          fullWidth
          value={values.user_agent}
          onChange={handleValueChange}
          error={Boolean(showErrors.user_agent && errors.user_agent)}
          helperText={(showErrors.user_agent && errors.user_agent) || (
            <span>
                        保持和你浏览器登录时相同的UserAgent，有助于绕开某些站点的安全防护
                    </span>
          )}
        />
      </>}
      {values.auth_type === "user" && <>
        <TextField
          type="text"
          name="auth_username"
          margin="dense"
          label="登录用户名"
          fullWidth
          value={values.auth_username}
          onChange={handleValueChange}
          error={Boolean(showErrors.auth_username && errors.auth_username)}
          helperText={(showErrors.auth_username && errors.auth_username) || (
            <span>
                        登录网站所需要的用户名
                    </span>
          )}
        />
        <TextField
          type="password"
          name="auth_password"
          margin="dense"
          label="登录密码"
          fullWidth
          value={values.auth_password}
          onChange={handleValueChange}
          error={Boolean(showErrors.auth_password && errors.auth_password)}
          helperText={(showErrors.auth_password && errors.auth_password) || (
            <span>
                        登录网站所需要的密码，编辑时不显示此值是正常的，因为加密了
                    </span>
          )}
        />
      </>}
      <TextField
        type="text"
        name="proxies"
        label="代理设置"
        value={values.proxies}
        onChange={handleValueChange}
        error={Boolean(showErrors.proxies && errors.proxies)}
        helperText={(showErrors.proxies && errors.proxies) || (
          <span>
                        留空则不使用代理。支持通过HTTP代理、SOCKS代理访问站点（分享数据、搜索、下种子文件）。示范：http://localhost:8030 或 socks5://user:pass@host:port
                    </span>
        )}
      />
      <FormControl fullWidth>
        <Select
          name="traffic_management_status"
          value={values.traffic_management_status}
          onChange={(e) => handleValueChange(e)}
        >
          <MenuItem value={0}>关闭流量管理</MenuItem>
          <MenuItem value={1}>主动积累上传量</MenuItem>
          <MenuItem value={2}>被动按需养护</MenuItem>
        </Select>
        <FormHelperText>
          开启此功能还需要在基础设置-流量管理中做好设置才会生效。
          <Link target="_blank"
                href="https://yee329.notion.site/28702cf23a834c2380eb8ff34de68ea5">有什么用？</Link>
        </FormHelperText>
      </FormControl>
      <TextField
        type="number"
        name="upload_kpi"
        margin="dense"
        label="上传量目标"
        fullWidth
        value={values.upload_kpi}
        onChange={handleValueChange}
        error={Boolean(showErrors.upload_kpi && errors.upload_kpi)}
        disabled={values.traffic_management_status !== 1}
        helperText={(showErrors.upload_kpi && errors.upload_kpi) || (
          <span>
                        单位GB。主动积累上传量模式时需要设定一个要达成的目标，被动模式此值无用。
                    </span>
        )}
      />
      <FormControlLabel
        control={<Checkbox
          checked={values.web_search}
          name="web_search"
          onChange={handleValueChange}
        />}
        label="允许在Web搜索中使用"
      />
      <FormControlLabel
        control={<Checkbox
          checked={values.smart_download}
          name="smart_download"
          onChange={handleValueChange}
        />}
        label="允许在智能下载中使用"
      />
    </DialogContent>
    <DialogActions>
      <Button color="primary" onClick={() => onSubmit(values)} disabled={submitting}>
        提交
      </Button>
      <Button onClick={onClose} color="primary" disabled={submitting}>
        取消
      </Button>
    </DialogActions>
  </Dialog>);
};
export default SetSite;