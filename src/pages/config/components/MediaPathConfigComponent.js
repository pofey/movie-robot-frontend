import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import axios from "../../../utils/request";
import pageMessage from "@/utils/message";

import {
  Alert as MuiAlert,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Select,
  TextField as MuiTextField,
  Typography
} from "@mui/material";
import { spacing } from "@mui/system";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;

function MediaPathConfigComponent({ isInit }) {
  const navigate = useNavigate();
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [paths, setPaths] = useState([{
    download_path: "",
    source_dir: "",
    target_dir: "",
    qbit_cate: "",
    type: "movie",
    file_process_mode: "link",
    use_area_folder: false
  }]);
  const [downloadClient, setDownloadClient] = useState();
  const saveConfig = async (params) => {
    setNextButtonDisabled(true);
    setErrorMessage(undefined);
    let hasError = false;
    let tmpPaths = [...paths];
    for (let i = 0; i < params.length; i++) {
      let v = params[i];
      let item = { ...tmpPaths[i] };
      if (v.download_path === undefined || v.download_path === "" || item.downloadPathError !== undefined) {
        item.downloadPathError = item.downloadPathError || "路径不能为空";
        hasError = true;
      }
      if (v.source_dir === undefined || v.source_dir === "" || item.sourceDirError !== undefined) {
        item.sourceDirError = item.sourceDirError || "路径不能为空";
        hasError = true;
      }
      if (!["xx", "other"].includes(v.type) && (v.target_dir === undefined || v.target_dir === "" || item.targetDirError !== undefined)) {
        item.targetDirError = item.targetDirError || "路径不能为空";
        hasError = true;
      }
      tmpPaths[i] = item;
    }
    setPaths(tmpPaths);
    if (hasError) {
      setNextButtonDisabled(false);
      return;
    }
    try {
      const res = await axios.post("/api/config/save_media_path", params);
      const { code, message, data } = res;
      if (code === undefined || code === 1) {
        throw new Error(message);
      }
      navigate("/setting/index");
    } catch (error) {
      const message = error.message || "配置出错啦";
      setErrorMessage(message);
      pageMessage.error(message);
    }
    setNextButtonDisabled(false);
  };
  const handleOnChange = (index, e) => {
    let tmpPaths = [...paths];
    let item = { ...tmpPaths[index] };
    if (e.target.type === "checkbox") {
      item[e.target.name] = e.target.checked;
    } else {
      item[e.target.name] = e.target.value;
    }
    tmpPaths[index] = item;
    setPaths(tmpPaths);
  };

  const handleOnBlur = async (index, e) => {
    let tmpPaths = [...paths];
    let item = { ...tmpPaths[index] };
    let errorMsg = undefined;
    if (e.target.value === "") {
      errorMsg = "路径不能为空";
    } else if (e.target.name !== "download_path") {
      const res = await axios.get("/api/config/check_path", { params: { path: e.target.value } });
      const { code, message, data } = res;
      if (code === undefined || code === 1) {
        errorMsg = message;
      }
    }
    switch (e.target.name) {
      case "download_path":
        item.downloadPathError = errorMsg;
        break;
      case "source_dir":
        item.sourceDirError = errorMsg;
        break;
      case "target_dir":
        item.targetDirError = errorMsg;
        break;
      default:
        break;
    }

    tmpPaths[index] = item;
    setPaths(tmpPaths);
  };
  useEffect(async () => {
    axios.get("/api/config/get_media_path").then((res) => {
      const data = res.data;
      if (data !== undefined) {
        if (data.download_client !== undefined) {
          setDownloadClient(data.download_client);
        }
        setPaths(data.paths);
      }
    });
  }, []);
  return (<Card>
    {errorMessage && (<Alert mt={2} mb={1} severity="warning">
      {errorMessage}
    </Alert>)}
    {paths && paths.length > 0 ? (paths.map((p, i) => (<Card mb={6} key={i}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          路径{i + 1}<Button onClick={() => {
          const temp = [...paths];
          temp.splice(i, 1);
          setPaths(temp);
        }}>删除</Button>
        </Typography>
        <FormControl m={4} fullWidth>
          <Select
            name="type"
            value={p.type}
            displayEmpty
            onChange={(e) => handleOnChange(i, e)}
          >
            <MenuItem value="movie">电影</MenuItem>
            <MenuItem value="tv">剧集</MenuItem>
            <MenuItem value="xx">XX</MenuItem>
            <MenuItem value="other">其他</MenuItem>
          </Select>
          <FormHelperText>路径存放的内容类型{p.type === "xx" || p.type === "other" ? "，XX和其他类型不做识别和转移操作" : ""}</FormHelperText>
        </FormControl>
        <TextField
          name="download_path"
          value={p.download_path}
          label="下载保存路径"
          fullWidth
          variant="outlined"
          error={Boolean(p.downloadPathError !== undefined && p.downloadPathError !== "")}
          helperText={(p.downloadPathError !== undefined && p.downloadPathError !== "" && p.downloadPathError) || "种子提交到下载工具后，文件的保存路径"}
          my={2}
          onChange={(e) => handleOnChange(i, e)}
          onBlur={(e) => handleOnBlur(i, e)}
        />
        {downloadClient !== undefined && downloadClient === "qbittorrent" && (
          <TextField
            name="qbit_cate"
            value={p.qbit_cate}
            label="qbittorrent分类名称"
            fullWidth
            variant="outlined"
            helperText="使用qbittorrent自动管理模式，需要设置分类名，并和qbit中分类名一致"
            my={2}
            onChange={(e) => handleOnChange(i, e)}
          />
        )}
        <TextField
          name="source_dir"
          label="下载路径装载到容器的路径"
          fullWidth
          variant="outlined"
          error={Boolean(p.sourceDirError !== undefined && p.sourceDirError !== "")}
          helperText={(p.sourceDirError !== undefined && p.sourceDirError !== "" && p.sourceDirError) || "下载文件保存的路径，装载给容器的存储空间路径"}
          my={2}
          value={p.source_dir}
          onChange={(e) => handleOnChange(i, e)}
          onBlur={(e) => handleOnBlur(i, e)}
        />
        <TextField
          name="target_dir"
          label="下载完整理的目标路径"
          fullWidth
          variant="outlined"
          error={Boolean(p.targetDirError !== undefined && p.targetDirError !== "")}
          helperText={(p.targetDirError !== undefined && p.targetDirError !== "" && p.targetDirError) || "识别到影视信息的资源，会以名称(上映年份)保存在此路径"}
          my={2}
          value={p.target_dir}
          onChange={(e) => handleOnChange(i, e)}
          onBlur={(e) => handleOnBlur(i, e)}
          disabled={p.type === "xx" || p.type === "other"}
        />
        <FormControl m={4} fullWidth disabled={p.type === "xx" || p.type === "other"}>
          <Select
            name="file_process_mode"
            value={p.file_process_mode}
            displayEmpty
            onChange={(e) => handleOnChange(i, e)}
          >
            <MenuItem value="link">硬链接到目标路径</MenuItem>
            <MenuItem value="copy">复制到目标路径</MenuItem>
            <MenuItem value="move">移动到目标路径</MenuItem>
            {/*<MenuItem value="soft">软链接到目标路径</MenuItem>*/}
          </Select>
          <FormHelperText>{p.file_process_mode === "link" || p.file_process_mode === "soft" ? "对同一个存储区块做新的引用，不占额外空间，不影响源文件做种" : "将源文件直接复制到目标路径，产生额外的存储空间"}</FormHelperText>
        </FormControl>
        <FormControlLabel disabled={p.type === "xx" || p.type === "other"}
                          control={<Checkbox
                            checked={p.use_area_folder}
                            onChange={(e) => handleOnChange(i, e)}
                            name="use_area_folder"
                          />}
                          label="使用区域自动分类，开启后会在此文件夹下建立一些子文件夹（大陆、港台、日韩、欧美、其他）"
        />
      </CardContent>
    </Card>))) : null}
    <CardActions>
      <Button size="small" color="primary" onClick={() => {
        setPaths([...paths, { type: "movie", file_process_mode: "link", qbit_cate: "" }]);
      }}>
        加一个路径
      </Button>
    </CardActions>
    <Centered>
      <Button
        mr={2}
        size="medium"
        variant="contained"
        color="primary"
        onClick={() => {
          saveConfig(paths);
        }}
        disabled={nextButtonDisabled}
        fullWidth={!isInit}
      >
        保存
      </Button>
    </Centered>
  </Card>);
}

export default MediaPathConfigComponent;
