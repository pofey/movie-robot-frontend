import React, {useEffect} from "react";
import styled from "styled-components/macro";

import {
    Breadcrumbs as MuiBreadcrumbs,
    Button,
    Checkbox,
    Chip as MuiChip,
    Divider as MuiDivider,
    IconButton,
    Paper as MuiPaper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import {Edit,} from "@mui/icons-material";
import {spacing} from "@mui/system";
import {useGetMediaLibrary} from "@/api/MediaServerApi";
import message from "@/utils/message";
import RefreshIcon from '@mui/icons-material/Refresh';

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Spacer = styled.div`
  flex: 1 1 100%;
`;
const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
`;
const getStatus = (status) => {
    if (status === 0) {
        return (<Chip label="待识别" color="primary"/>)
    } else if (status === 1) {
        return (<Chip label="处理中" color="secondary"/>)
    } else if (status === 2) {
        return (<Chip label="整理完成" color="success"/>)
    } else if (status === 3) {
        return (<Chip label="识别失败" color="error"/>)
    } else {
        return (<Chip label="未知" color="warning"/>)
    }
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => ({
        el,
        index,
    }));
    stabilizedThis.sort((a, b) => {
        const order = comparator(a.el, b.el);
        if (order !== 0) return order;
        return a.index - b.index;
    });
    return stabilizedThis.map((element) => element.el);
}

const headCells = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "名称", sort: true
    },
    {id: "media_type", numeric: true, disablePadding: false, label: "类型", sort: true},
    {id: "media_name", numeric: true, disablePadding: false, label: "影片名", sort: true},
    {id: "release_date", numeric: true, disablePadding: false, label: "发行日期", sort: true},
    {id: "status", numeric: true, disablePadding: false, label: "状态", sort: true},
    {id: "option", numeric: true, disablePadding: false, label: "操作", sort: false},
];

const EnhancedTableHead = (props) => {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{"aria-label": "select all desserts"}}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.sort ? <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel> : headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

const EnhancedTableToolbar = (props) => {
    // Here was 'let'
    const {numSelected, onLink} = props;

    return (
        <Toolbar>
            <div>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1" width={80}>
                        选中{numSelected}个
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle" width={80}>
                        本地资源
                    </Typography>
                )}
            </div>
            <Spacer/>
            <div>
                {numSelected > 0 ? (
                    <Stack direction="row" spacing={2}>
                        <Tooltip title="开始分析选中的资源影视信息，然后整理到对应目录">
                            <Button variant="contained" startIcon={<RefreshIcon/>} onClick={onLink}>
                                整理
                            </Button>
                        </Tooltip>
                    </Stack>
                ) : null}
            </div>
        </Toolbar>
    );
};

function MediaTable({path, linkPath}) {
    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("calories");
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const {mutateAsync: getMediaLibrary, isLoading} = useGetMediaLibrary();
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.path);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, path) => {
        const selectedIndex = selected.indexOf(path);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, path);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const onLink = () => {
        if (!linkPath) {
            message.error('请选择整理后的路径，才能开始整理！')
            return;
        }
        console.log(selected);
    }
    useEffect(() => {
        if (path) {
            getMediaLibrary({path: path}, {
                onSuccess: resData => {
                    const {code, message: msg, data} = resData;
                    if (code === 0) {
                        setRows((data || []).map((item) => {
                            return {
                                name: item.name,
                                file_type_desc: item.file_type_desc,
                                status: item.status,
                                release_date: item?.recognition_result?.metadata ? item.recognition_result.metadata.release_date : "未知",
                                media_name: item?.recognition_result?.metadata ? item.recognition_result.metadata.name : "未知",
                                media_type: item?.recognition_result?.metadata ? item.recognition_result.metadata.media_type : "未知",
                                path: item.path
                            }
                        }));
                    } else {
                        message.error(msg);
                    }
                },
                onError: error => message.error(error)
            });
        }
    }, [path])
    return (
        <Paper>
            <EnhancedTableToolbar numSelected={selected.length} onLink={onLink}/>
            <TableContainer>
                <Table
                    aria-labelledby="tableTitle"
                    size="medium"
                    aria-label="enhanced table"
                >
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.path);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.path)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.name}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isItemSelected}
                                                inputProps={{"aria-labelledby": labelId}}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            <Tooltip title={row.path} arrow>
                                                <Button variant="text">{row.name}</Button>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell
                                            align="right">{row.media_type === "Movie" ? "电影" : "剧集"}</TableCell>
                                        <TableCell
                                            align="right">{row.media_name}</TableCell>
                                        <TableCell
                                            align="right">{row.release_date}</TableCell>
                                        <TableCell align="right">{getStatus(row.status)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="info"
                                                aria-label="编辑"
                                                size="small"
                                                disabled={[0, 1].includes(row.status)}
                                            >
                                                <Edit/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow style={{height: (53) * emptyRows}}>
                                <TableCell colSpan={6}/>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export default MediaTable;