import { useContext } from 'react'
import WorkspaceScreen from './WorkspaceScreen'
import AuthContext from '../auth'
import GlobalStoreContext from '../store';
import { useHistory } from 'react-router-dom'

export default function WorkspaceWrapper() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    console.log("WorkspaceWrapper auth.loggedIn: " + auth.loggedIn);

    store.history = useHistory();

    if (auth.loggedIn)
        return <WorkspaceScreen />
    else
        return "";
}