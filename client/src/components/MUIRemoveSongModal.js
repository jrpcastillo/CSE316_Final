import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
// add
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIRemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleConfirmRemoveSong (event) {
        store.addRemoveSongTransaction();
    }

    function handleCancelRemoveSong (event) {
        store.setCurrentList(store.currentList._id);
    }
    /*
    let modalClass = "modal";
    if (store.isRemoveSongModalOpen()) {
        modalClass += " is-visible";
    }
    */
    let songTitle = "";
    if (store.currentSong) {
        songTitle = store.currentSong.title;
    }

    return (
        <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Remove '{songTitle}'?
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning">
                    Are you sure you wish to permanently remove '{songTitle}' from the playlist?
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirmRemoveSong}>Confirm</Button>
                <Button onClick={handleCancelRemoveSong} autoFocus>
                    Cancel
                </Button>
            </DialogActions>
      </Dialog>
    )

    /*
    return (
        <Modal
            open={true}
        >
            <Box sx={style}>
            <div
        id="remove-song-modal"
        //className={modalClass}
        data-animation="slideInOutLeft">
        <div className="modal-root" id='verify-remove-song-root'>
            <div className="modal-north">
                Remove {songTitle}?
            </div>
            <div className="modal-center">
                <div className="modal-center-content">
                    Are you sure you wish to permanently remove {songTitle} from the playlist?
                </div>
            </div>
            <div className="modal-south">
                <input type="button" 
                    id="remove-song-confirm-button" 
                    className="modal-button" 
                    onClick={handleConfirmRemoveSong} 
                    value='Confirm' />
                <input 
                    type="button" 
                    id="remove-song-cancel-button" 
                    className="modal-button" 
                    onClick={handleCancelRemoveSong} 
                    value='Cancel' />
            </div>
        </div>
    </div>
            </Box>
        </Modal>
    );
    */
}