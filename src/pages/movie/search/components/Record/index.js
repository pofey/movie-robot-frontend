import {Box, Chip as MuiChip, Grid, Link, Skeleton, Stack, Typography as MuiTypography} from "@mui/material";
import styled, {css} from "styled-components/macro";
import {
    StyledCard as Card,
    StyledCardContent as CardContent,
    StyledIconHolder as IconHolder,
    StyledTypography as Typography
} from "./StyledComp.js";

import {ArrowDown, ArrowUp, Download, File} from "react-feather";
import React from "react";
import {rgba} from "polished";
import {deepOrange, green} from "@mui/material/colors";
import {coverSize} from "@/utils/PtUtils";

const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) => props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};
`;
const Percentage = styled(MuiTypography)`
  span {
    color: ${(props) => props.percentagecolor};
    font-weight: ${(props) => props.theme.typography.fontWeightBold};
    background: ${(props) => rgba(props.percentagecolor, 0.1)};
    padding: 2px;
    border-radius: 3px;
    margin-right: ${(props) => props.theme.spacing(2)};
  }

  ${(props) =>
    props.illustration &&
    props.theme.palette.mode !== "dark" &&
    css`
            color: ${(props) => rgba(props.theme.palette.primary.main, 0.85)};
          `}
`;
const COM = ({
                 onDownload,
                 subject,
                 details_url,
                 name,
                 site_name,
                 upload,
                 download,
                 media_source,
                 media_encoding,
                 resolution,
                 file_size,
                 download_volume_factor,
                 upload_volume_factor,
                 minimum_ratio,
                 free_desc
             }) => {
    let free = ''
    if (upload_volume_factor === 2) {
        free = "2x";
    }
    if (download_volume_factor !== 1) {
        switch (download_volume_factor) {
            case 0:
                free += "Free";
                break
            case 0.5:
                free += "50%";
                break
            case 0.3:
                free += "30%";
                break
            default:
                free += '';
                break
        }
    }
    return (<Card>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {subject || name ?
                        <Link target="_blank" href={details_url} color="inherit">{subject ? subject : name}</Link> :
                        <Skeleton/>}
                </Typography>
                <div>
                    <Stack direction="row" spacing={1}>
                        {media_source !== undefined ? (media_source ?
                                <Chip label={media_source} color="primary"/> : null) :
                            <Skeleton height={20} width={80}/>}
                        {resolution !== undefined ? (resolution ? <Chip label={resolution} color="success"/> : null) :
                            <Skeleton height={20} width={80}/>}
                        {media_encoding !== undefined ? (media_encoding ?
                                <Chip label={media_encoding} color="info"/> : null) :
                            <Skeleton height={20} width={80}/>}
                    </Stack>
                </div>
                <Typography mb={4} color="textSecondary" component="p">
                    {name ? `[${site_name}]${name}` : <Skeleton/>}
                </Typography>
                {upload !== undefined ? <Box sx={{display: "flex", alignItems: "flex-end"}}>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                            {upload}
                        </Grid>
                        <Grid item>
                            <IconHolder>
                                <ArrowUp/>
                            </IconHolder>
                        </Grid>
                        <Grid item>
                            {download}
                        </Grid>
                        <Grid item>
                            <IconHolder>
                                <ArrowDown/>
                            </IconHolder>
                        </Grid>
                        <Grid item>
                            {coverSize(file_size)}
                        </Grid>
                        <Grid item>
                            <IconHolder>
                                <File/>
                            </IconHolder>
                        </Grid>
                        {download_volume_factor !== 1 ? (
                            <Grid item>
                                <Percentage
                                    variant="subtitle2"
                                    color="textSecondary"
                                    percentagecolor={green[500]}
                                >
                                    <span>{free}</span> {free_desc ? "限时：" + free_desc : ''}
                                </Percentage>
                            </Grid>
                        ) : null}
                        {minimum_ratio > 0 ? (<Grid item>
                            <Percentage
                                variant="subtitle2"
                                color="textSecondary"
                                percentagecolor={deepOrange[500]}
                            >
                                <span>H&R</span>
                            </Percentage>
                        </Grid>) : null}
                    </Grid>
                    <Download onClick={onDownload}/>
                </Box> : <Box sx={{display: "flex", alignItems: "flex-end"}}>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                            <Skeleton width={30}/>
                        </Grid>
                        <Grid item>
                            <Skeleton width={30}/>
                        </Grid>
                        <Grid item>
                            <Skeleton width={30}/>
                        </Grid>
                    </Grid>
                    <Skeleton width={20} height={20}/>
                </Box>}
            </CardContent>
        </Card>
    );
};

export default COM;