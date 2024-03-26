import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Alert as MuiAlert,
  Breadcrumbs,
  Button, Checkbox,
  Divider as MuiDivider, FormControl, FormControlLabel, FormHelperText,
  Link,
  TextField as MuiTextField,
  Typography
} from "@mui/material";
import styled from "styled-components/macro";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { useGetCookieCloud, useGetPassCloudflare, useSaveCookieCloud, useSavePassCloudflare } from "@/api/SettingApi";
import message from "@/utils/message";

const Divider = styled(MuiDivider)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);


function CookieCloudForm({ isInit }) {
  const navigate = useNavigate();
  const { data: getConfig } = useGetCookieCloud();
  const { mutateAsync: saveConfig } = useSaveCookieCloud();
  const formik = useFormik({
    initialValues: {
      url: "http://",
      uuid: "",
      password: "",
      enable:true
    }, onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        saveConfig({
          url: values.url,
          uuid: values.uuid,
          password: values.password,
          enable: values.enable,
        }, {
          onSuccess: res => {
            const { code, message: msg } = res;
            if (code === 0) {
              message.success("更改CookieCloud设置成功。");
              navigate("/setting/index");
            } else {
              message.error(msg);
            }
          }
        });
      } catch (error) {
        const message = error.message || "配置出错啦";

        setStatus({ success: false });
        setErrors({ submit: message });
        setSubmitting(false);
      }
    }
  });

  useEffect(async () => {
    if (getConfig?.data) {
      formik.setFieldValue("url", getConfig.data?.url ? getConfig.data?.url : "http://");
      formik.setFieldValue("uuid", getConfig.data?.uuid ? getConfig.data?.uuid : "");
      formik.setFieldValue("password", getConfig.data?.password ? getConfig.data?.password : "");
      formik.setFieldValue("enable", getConfig.data?.enable!==undefined ? getConfig.data?.enable : true);
    }
  }, [getConfig]);
  return (<form noValidate onSubmit={formik.handleSubmit}>
    {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
      {formik.errors.submit}
    </Alert>)}
    <Typography>CookieCloud是一个和自架服务器同步Cookie的小工具，可以将浏览器的Cookie及Local storage同步到手机和云端，它内置端对端加密，可设定同步时间间隔。<Link href="https://github.com/easychen/CookieCloud" target="_blank">CookieCloud项目介绍</Link></Typography>
    <TextField
      type="text"
      name="url"
      label="服务器地址"
      value={formik.values.url}
      error={Boolean(formik.touched.url && formik.errors.url)}
      fullWidth
      helperText="和CookieCloud浏览器插件中设定的服务器地址一致"
      onBlur={formik.handleBlur}
      onChange={formik.handleChange}
      my={3}
    />
    <TextField
      type="text"
      name="uuid"
      label="用户KEY"
      value={formik.values.uuid}
      error={Boolean(formik.touched.uuid && formik.errors.uuid)}
      fullWidth
      helperText="和CookieCloud浏览器插件中设定的用户KEY一致"
      onBlur={formik.handleBlur}
      onChange={formik.handleChange}
      my={3}
    />
    <TextField
      type="text"
      name="password"
      label="端对端加密密码"
      value={formik.values.password}
      error={Boolean(formik.touched.password && formik.errors.password)}
      fullWidth
      helperText="和CookieCloud浏览器插件中设定的端对端加密密码一致"
      onBlur={formik.handleBlur}
      onChange={formik.handleChange}
      my={3}
    />
    <FormControl>
      <FormControlLabel control={<Checkbox name="enable"
                                           checked={formik.values.enable}
                                           onChange={formik.handleChange}/>} label={"是否启用"}/>
    </FormControl>
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      disabled={formik.isSubmitting}
    >
      保存
    </Button>
  </form>);
}

const CookieCloud = () => {
  return (<React.Fragment>
    <Helmet title="CookieCloud设置" />
    <Typography variant="h3" gutterBottom display="inline">
      CookieCloud设置
    </Typography>

    <Breadcrumbs aria-label="Breadcrumb" mt={2}>
      <Link component={NavLink} to="/setting/index">
        设置
      </Link>
      <Typography>CookieCLoud设置</Typography>
    </Breadcrumbs>
    <Divider my={6} />
    <CookieCloudForm />
  </React.Fragment>);
};
export default CookieCloud;