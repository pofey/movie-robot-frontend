import React from 'react';
import { Box } from "@mui/material";

const Empty = () => {
  return(
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '160px',
    }}>
      <h4>暂无数据</h4>
    </Box>
  );
}

export default Empty;
