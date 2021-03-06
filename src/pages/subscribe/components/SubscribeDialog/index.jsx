import React, {useContext, useRef, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
} from '@mui/material';
import {useAddSubscribe} from '@/utils/subscribe';
import message from "@/utils/message";
import FilterForm from "@/components/Selectors/FilterForm";
import {FilterOptionsContext} from "@/components/Selectors/FilterOptionsProvider";


const SubscribeDialog = ({open, handleClose, data, onComplete}) => {
    const filterOptionsContextData = useContext(FilterOptionsContext)
    const myRef = useRef(null);
    const [filterName, setFilterName] = useState();
    const [showFilterForm, setShowFilterForm] = useState(false);
    const {name, year} = data;
    const {mutateAsync: addSubscribe, isLoading} = useAddSubscribe();
    let id;
    if (data.sub_id) {
        id = data.sub_id;
    } else {
        id = data.id;
    }
    const onChange = (e) => {
        setFilterName(e.target.value)
        if (e.target.value === 'system:newFilter') {
            setShowFilterForm(true)
        } else {
            setShowFilterForm(false)
        }
    }
    const handleSubmit = async () => {
        let filterConfig;
        if (filterName && filterName === 'system:newFilter') {
            await myRef.current.onSubmit()
            filterConfig = await myRef.current.getVal()
        }
        addSubscribe({id, filter_name: filterName, filter_config: filterConfig}, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    message.success(msg);
                    if (onComplete) {
                        onComplete(0);
                    }
                    handleClose();
                } else {
                    message.error(msg);
                    handleClose();
                }
            },
            onError: error => message.error(error)
        });
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="md"
            fullWidth={showFilterForm}
        >
            <DialogTitle id="alert-dialog-title">
                ??????????????? {name}{year ? "(" + year + ")" : ""} ??????
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <FormControl m={4} fullWidth>
                        <Select
                            name="filterName"
                            value={filterName}
                            onChange={onChange}
                            defaultValue="system:autoSelectFilter"
                        >
                            <MenuItem value="system:autoSelectFilter">?????????????????????</MenuItem>
                            <MenuItem value="system:unUseFilter">????????????????????????</MenuItem>
                            <MenuItem value="system:newFilter">?????????????????????</MenuItem>
                            <Divider/>
                            {filterOptionsContextData?.filter_name_list ? filterOptionsContextData?.filter_name_list.map((value, i) => (
                                <MenuItem key={value} value={value}>{value}</MenuItem>
                            )) : <MenuItem>???????????????????????????</MenuItem>}
                        </Select>
                        <FormHelperText>
                <span>
                    ??????????????????????????????????????????
                </span></FormHelperText>
                    </FormControl>
                    {showFilterForm &&
                    <FilterForm showFilterName={false} showApplyInfo={false} showFilterTemplate={true}
                                filterOptions={filterOptionsContextData} onSubmit={null} myRef={myRef}/>}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>??????</Button>
                <Button onClick={handleSubmit} autoFocus disabled={isLoading}>
                    ??????
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SubscribeDialog;
