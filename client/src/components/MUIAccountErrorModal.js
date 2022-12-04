import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AuthContext, { AuthActionType } from '../auth';
// add
import Alert from '@mui/material/Alert';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    p: 0,
};

export default function MUIAccountErrorModal() {
    const { auth } = useContext(AuthContext);
    let open = false;
    if (auth.errorMessage != "") {
        open = true;
    }
    return (
        <Modal
            open={open}
            disableScrollLock
        >
            <Box sx={{ ...style }}>
                <Alert
                    onClose={() => {auth.closeModal()}}
                    severity="error"
                >
                    {auth.errorMessage}
                </Alert>
            </Box>
        </Modal>
    );
}