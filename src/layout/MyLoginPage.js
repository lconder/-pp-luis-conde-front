import React, { useState} from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import LockIcon from '@material-ui/icons/Lock';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = () => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'url(https://source.unsplash.com/random/800x450)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },
    card: {
        minWidth: 300,
        marginTop: '6em',
    },
    button: {
        marginTop: '1em',

    },
    avatar: {
        margin: '1em',
        display: 'flex',
        justifyContent: 'center',
    },
    icon: {
        backgroundColor: '#6F4AF7',
    },
    hint: {
        marginTop: '1em',
        display: 'flex',
        justifyContent: 'center',
        color: '#6F4AF7'
    },
    form: {
        padding: '0 1em 1em 1em',
    },
    input: {
        marginTop: '1em',
        justifyContent: 'center',
        display: 'flex',
    },
    actions: {
        padding: '0 1em 1em 1em',
    },
});


const MyLoginPage = ({ theme, classes }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const submit = (e) => {
        e.preventDefault();
        login({ email, password })
            .catch(() => {
                alert('Credenciales incorrectas');
            });
    };

    return (

        <div className={classes.main}>

            <Card className={classes.card}>

                <div className={classes.avatar} >
                    <LockIcon />
                </div>

                <form onSubmit={submit}>

                    <div className={classes.hint}> Pack & Pack </div>

                    <div className={classes.form}>
                        <div className={classes.input}>
                            <TextField
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={classes.input}>
                            <TextField
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className={classes.input}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="inherit"
                            >
                                Entrar
                            </Button>
                        </div>
                    </div>

                </form>
            </Card>
        </div>
    );
};

export default withStyles(styles)(MyLoginPage);