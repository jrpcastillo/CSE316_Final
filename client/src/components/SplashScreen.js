import { useContext } from 'react'
import logo from '../resources/Playlister.png';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    
    const handleRegister = () => {
        store.history.push('/register');
    }

    const handleLogin = () => {
        store.history.push('/login');
    }

    const handleGuest = () => {
        auth.loginGuest();
    }

    return (
        <div id="splash-screen">
            <Grid container sx={{height: '100%'}}>
                <Grid item container justifyContent='center' alignItems='flex-end' xs={12} sx={{ height: '50%' }}>
                    <Box
                        component="img"
                        src={logo}
                        sx={{ maxWidth: '50%' }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid item container justifyContent='center' alignItems='flex-start' xs={12}>
                        <Button
                            onClick={handleLogin}
                            variant='contained'
                            sx={{ width: '60%' }}
                        >
                            Login
                        </Button>
                    </Grid>
                    <Grid item columnSpacing={2} container justifyContent='center' alignItems='flex-start' xs={12}>
                        <Grid item  sx={{ width: '30%' }}>
                            <Button
                                onClick={handleGuest}
                                variant='contained'
                                sx={{ width: '100%' }}
                            >
                                Continue as Guest
                            </Button>
                        </Grid>
                        <Grid item  sx={{ width: '30%' }}>
                            <Button
                                onClick={handleRegister}
                                variant='contained'
                                sx={{ width: '100%' }}
                            >
                                Create an Account
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}