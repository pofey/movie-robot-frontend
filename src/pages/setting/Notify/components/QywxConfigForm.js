import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import * as Yup from "yup";
import {useFormik} from "formik";
import _ from 'lodash';

import {Alert as MuiAlert, Button, Checkbox, FormControlLabel, Link, TextField as MuiTextField} from "@mui/material";
import {spacing} from "@mui/system";
import MessageTemplateComponent from "@/pages/config/notify/MessageTemplateComponent";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;

function QywxConfigForm({data, onSubmitEvent, onTestEvent}) {
    const [opType, setOpType] = useState('save')
    const [message, setMessage] = useState();
    const [messageTemplate, setMessageTemplate] = useState({
        movie_completed: {
            title: '${name} (${year}) 评分:${rating}', message: '${nickname}添加的电影 ${name}(${year})下载完毕'
        }, 'tv_completed': {
            title: '${name} (${year}) 评分:${rating}', message: '${nickname}添加的剧集 ${name}(${year})第${episodes}集下载完毕'
        }
    })
    const formik = useFormik({
        initialValues: {
            touser: '@all',
            corpid: '',
            corpsecret: '',
            agentid: '100001',
            message_template: 'movie_completed',
            title: '${name} (${year}) 评分:${rating}',
            message: '${nickname}添加的电影 ${name}(${year})下载完毕',
            token: '',
            aes_key: '',
            enable: true,
            use_server_proxy: false,
            server_url:''
        }, validationSchema: Yup.object().shape({
            touser: Yup.string().max(256).required(),
            corpid: Yup.string().max(256).required(),
            corpsecret: Yup.string().max(256).required(),
            agentid: Yup.string().max(256).required(),
            title: Yup.string().max(1000).required(),
            message: Yup.string().max(1000).required(),
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                setMessage(undefined)
                setSubmitting(true)
                let params = {...values}
                params['message_template'] = messageTemplate;
                delete params['title']
                delete params['message']
                if (opType === "save") {
                    await onSubmitEvent(params, setMessage)
                } else if (opType === "test") {
                    await onTestEvent(params, setMessage)
                }
            } catch (error) {
                const message = error.message || "企业微信配置出错啦";
                setStatus({success: false});
                setErrors({submit: message});
            } finally {
                setSubmitting(false);
            }
        }
    });
    useEffect(async () => {
        if (data !== undefined && data !== null) {
            formik.setFieldValue('touser', data.touser)
            formik.setFieldValue('corpid', data.corpid)
            formik.setFieldValue('corpsecret', data.corpsecret)
            formik.setFieldValue('agentid', data.agentid)
            if (data.token) {
                formik.setFieldValue('token', data.token)
            }
            if (data.aes_key) {
                formik.setFieldValue('aes_key', data.aes_key)
            }
            if (data.enable !== undefined || data.enable !== null) {
                formik.setFieldValue('enable', data.enable)
            }
            const {
                title,
                message
            } = _.get(data, `message_template.${_.get(formik, 'values.message_template', '')}`, {
                title: '',
                message: ''
            })
            formik.setFieldValue('title', title)
            formik.setFieldValue('message', message)
            formik.setFieldValue('use_server_proxy', data?.use_server_proxy !== undefined && data?.use_server_proxy !== null ? data.use_server_proxy : false)
            formik.setFieldValue('server_url', data?.server_url !== undefined ? data.server_url : 'https://qyapi.weixin.qq.com')
            setMessageTemplate(data.message_template)
        }
    }, [data]);
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        {message && (<Alert severity="success" my={3}>
            {message}
        </Alert>)}
        <TextField
            type="text"
            name="server_url"
            label="推送API地址"
            value={formik.values.server_url}
            error={Boolean(formik.touched.server_url && formik.errors.server_url)}
            fullWidth
            helperText={<>
                官方：https://qyapi.weixin.qq.com 高级玩家可以自定义代理，小白启用内置代理即可。<Link target="_blank" href="https://yee329.notion.site/af9db7f54b424c919f2f7f375ffbfcf2">查看教程</Link>
            </>}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="touser"
            label="touser"
            value={formik.values.touser}
            error={Boolean(formik.touched.touser && formik.errors.touser)}
            fullWidth
            helperText={'指定接收消息的成员，成员ID列表（多个接收者用‘|’分隔，最多支持1000个）。特殊情况：指定为"@all"，则向该企业应用的全部成员发送'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="corpid"
            label="corpid"
            value={formik.values.corpid}
            error={Boolean(formik.touched.corpid && formik.errors.corpid)}
            fullWidth
            helperText={'企业微信CorpID'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="corpsecret"
            label="corpsecret"
            value={formik.values.corpsecret}
            error={Boolean(formik.touched.corpsecret && formik.errors.corpsecret)}
            fullWidth
            helperText={'企业微信corpsecret'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="agentid"
            label="agentid"
            value={formik.values.agentid}
            error={Boolean(formik.touched.agentid && formik.errors.agentid)}
            fullWidth
            helperText={'企业应用的id，整型。企业内部开发，可在应用的设置页面查看；'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <MessageTemplateComponent formik={formik} messageTemplate={messageTemplate}
                                  setMessageTemplate={setMessageTemplate}/>
        <TextField
            type="text"
            name="token"
            label="Token"
            value={formik.values.token}
            error={Boolean(formik.touched.token && formik.errors.token)}
            fullWidth
            helperText={'企业微信接收消息页随机获取的Token，可留空不配置。'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="aes_key"
            label="EncodingAESKey"
            value={formik.values.aes_key}
            error={Boolean(formik.touched.aes_key && formik.errors.aes_key)}
            fullWidth
            helperText={'企业微信接收消息页随机获取的EncodingAESKey，可留空不配置。'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <FormControlLabel
            control={<Checkbox
                checked={formik.values.use_server_proxy}
                name="use_server_proxy"
                onChange={formik.handleChange}
            />}
            label="开启Movie Robot自建代理通过白名单验证"
        />
        <FormControlLabel
            control={<Checkbox
                checked={formik.values.enable}
                name="enable"
                onChange={formik.handleChange}
            />}
            label="启用这个通知（启用多个将推多个）"
        />
        <Centered>
            <Button sx={{mr: 2}}
                    size="medium"
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={() => setOpType('test')}
                    disabled={formik.isSubmitting}
            >
                推送一条消息测试
            </Button>
            <Button
                mr={2}
                size="medium"
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                onClick={() => setOpType('save')}
            >
                保存设置
            </Button>
        </Centered>

    </form>);
}

export default QywxConfigForm;
