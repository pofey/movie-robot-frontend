import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import * as Yup from "yup";
import {useFormik} from "formik";
import axios from "../../../utils/request";

import {Alert as MuiAlert, Box, Button, Link, TextField as MuiTextField} from "@mui/material";
import {spacing} from "@mui/system";
import ScoreRuleSelectComponent from "@/components/core/ScoreRuleSelectComponent";
import UserConfigComponent from "@/pages/config/douban/UserConfigComponent";
import TagConfigComponent from "@/pages/config/douban/TagConfigComponent";
import DownloadPathConfigComponent from "@/pages/config/douban/DownloadPathConfigComponent";
import pageMessage from "@/utils/message";
import TestDownload from "@/pages/config/douban/TestDownload";
import {getScoreRuleNames} from "@/api/CommonApi";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;

function DoubanConfigComponent({}) {
    const navigate = useNavigate();
    const [testDownloadPath, setTestDownloadPath] = useState({disabled: true, open: false})
    const [doubanTags, setDoubanTags] = useState({cate: [], area: []})
    const [mediaPaths, setMediaPaths] = useState([])
    const [users, setUsers] = useState([{id: '', pull_time_range: 365}])
    const [ruleData, setRuleData] = useState([])
    const [downloadPath, setDownloadPath] = useState([{
        type: "movie",
        cate: [],
        area: [],
        download_path: "",
        score_rule: 'compress'
    }])
    const [formMessage, setFormMessage] = useState();
    const [userFormHasError, setUserFormHasError] = useState(false)
    const [pathFormHasError, setPathFormHasError] = useState(false)
    const saveConfig = async (params) => {
        const res = await axios.post("/api/config/save_douban", params);
        const {code, message, data} = res;
        if (code === undefined || code === 1) {
            throw new Error(message);
        }
        setFormMessage(message);
        pageMessage.success(message || '操作成功')
        setTestDownloadPath({disabled: false})
    };
    const formik = useFormik({
        initialValues: {
            default_score_rule: 'compress'
        }, validationSchema: Yup.object().shape({
            default_score_rule: Yup.string().max(256).required()
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            if (userFormHasError || pathFormHasError) {
                return
            }
            try {
                await setSubmitting(true);
                let params = {...values}
                params["users"] = users
                params["download_paths"] = downloadPath
                await saveConfig(params);
            } catch (error) {
                const message = error.message || "配置出错啦";
                pageMessage.error(message)
                setStatus({success: false});
                setErrors({submit: message});
            } finally {
                await setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        let res_config = await axios.get("/api/config/get_douban");
        let config = res_config.data;
        if (config !== undefined && config !== null) {
            formik.setFieldValue("default_score_rule", config.default_score_rule);
            formik.setFieldValue("cookie", config.cookie);
            setUsers(config.users);
            setDownloadPath(config.download_paths);
            setTestDownloadPath({disabled: false})
        }
        const scoreRuleNames = await getScoreRuleNames()
        setRuleData(scoreRuleNames);
        let res_tag = await axios.get('/api/common/douban_tag');
        setDoubanTags(res_tag.data);
        let res_path = await axios.get('/api/config/get_media_path');
        setMediaPaths(res_path.data.paths);
    }, []);
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        {formMessage && (<Alert severity="success" my={3}>
            {formMessage}
        </Alert>)}
        <ScoreRuleSelectComponent name="default_score_rule" value={formik.values.default_score_rule} data={ruleData}
                                  onChange={formik.handleChange}/>
        <UserConfigComponent users={users} setUsers={setUsers}
                             submitting={formik.isSubmitting}
                             setHasError={setUserFormHasError}/>
        <DownloadPathConfigComponent data={downloadPath} setData={setDownloadPath} submitting={formik.isSubmitting}
                                     setHasError={setPathFormHasError} tag={doubanTags} downloadPaths={mediaPaths}/>
        <TestDownload open={testDownloadPath.open} onClose={() => {
            setTestDownloadPath({...testDownloadPath, open: false})
        }}/>
        <Centered>
            <Box mt={4}>
                <Button
                    sx={{mr: 2}}
                    size="medium"
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formik.isSubmitting}
                >
                    保存设置
                </Button>
                <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    disabled={testDownloadPath.disabled}
                    onClick={() => {
                        setTestDownloadPath({...testDownloadPath, open: true})
                    }}
                >
                    测试一下保存规则
                </Button>
            </Box>
        </Centered>

    </form>);
}

export default DoubanConfigComponent;
