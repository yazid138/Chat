"use client"

import {
    Avatar,
    Button,
    TextField,
    Paper,
    Box,
    Grid,
    Typography,
    Link,
    Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useForm} from "react-hook-form";
import {signIn} from 'next-auth/react'
import {useState} from "react";

const Copyright = (props) => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" to="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const SignInPage = () => {
    const [error, setError] = useState()
    const {register, handleSubmit} = useForm()

    const onSubmit = handleSubmit(async(data) => {
        const result = await signIn('credentials', {
            username: data.username,
            password: data.password,
            redirect: false,
        })
        if (result.error) setError(result.error)
        else location.href = '/'
    })

    return (
        <Grid container component="main" sx={{height: '100vh'}}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" method="POST" noValidate onSubmit={onSubmit} sx={{mt: 1}}>
                        {error && (
                            <Alert sx={{width: '100%'}} variant="filled" severity="error">
                                {error}
                            </Alert>
                        )}
                        <TextField
                            {...register('username', {required: true})}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            {...register('password', {required: true})}
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        <Copyright sx={{mt: 5}}/>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default SignInPage;