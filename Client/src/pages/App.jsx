import {makeStyles} from '@mui/styles';
import {
    Fab,
    Avatar,
    ListItemText,
    ListItemIcon,
    ListItem,
    List,
    TextField,
    Divider,
    Grid,
    Paper,
    ListItemButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useEffect, useMemo, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {socket} from "../socket.js";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '100vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '87vh',
        overflowY: 'auto'
    }
});

const url = 'http://localhost:5000'

const App = () => {
    const user = localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"))
    const [isConnected, setIsConnected] = useState(false)
    const [messages, setMessages] = useState([])
    const [selectedUser, setSelectedUser] = useState(-1)
    const [message, setMessage] = useState('')
    const [typing, setTyping] = useState(false)
    const {
        data: res,
        isLoading
    } = useQuery([], () => axios.get(url + '/message/receivers', {headers: {Authorization: 'Bearer ' + user?.token}}))
    const classes = useStyles();
    const {mutate: addMessage} = useMutation((data) => axios.post(url + '/message/create', data, {headers: {Authorization: 'Bearer ' + user?.token}}), {
        onSuccess: (res) => {
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
        }
    })
    const {setValue, handleSubmit, reset} = useForm({
        defaultValues: {
            message: '',
        },
        values: {
            message,
        }
    })

    const users = useMemo(() => res?.data?.data || [], [res])

    useEffect(() => {
        if (selectedUser !== -1) {
            const getMessage = async () => {
                const {data: res} = await axios.get(url + '/message/' + selectedUser, {
                    headers: {
                        Authorization: 'Bearer ' + user?.token
                    }
                })
                setMessages(res?.data || [])
            }

            getMessage()
        }
    }, [selectedUser]);

    const onSubmit = handleSubmit((data) => {
        reset()
        socket.emit('chat-message', {
            sender: user.id,
            content: data.message
        })
    })

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    useEffect(() => {
        if (message.length > 0) socket.emit('typing')
        else socket.emit('idle')
        socket.on('typing', (data) => {
            setTyping(data)
        })
    }, [message]);

    useEffect(() => {
        socket.on('chat-message', (data) => {
            setMessages([...messages, data])
        })
    }, [messages])

    if (isLoading) return 'Loading...';
    console.log(messages)
    return (
        <div>
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={3} className={classes.borderRight500}>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <Avatar alt={user?.name} src={`https://ui-avatars.com/api/?name=${user?.name}`}/>
                            </ListItemIcon>
                            <ListItemText primary={user?.name}></ListItemText>
                            {isConnected && <ListItemText secondary="online" align="right"></ListItemText>}
                        </ListItem>
                    </List>
                    <Divider/>
                    <Grid item xs={12} style={{padding: '10px'}}>
                        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth/>
                    </Grid>
                    <Divider/>
                    <List>
                        {users.map((e) => (
                            <ListItemButton key={e.id} onClick={() => {
                                socket.emit('leave-room')
                                setSelectedUser(e.id)
                                socket.emit('join-room', e.messageId)
                            }}>
                                <ListItemIcon>
                                    <Avatar alt={e.name} src={`https://ui-avatars.com/api/?name=${e.name}`}/>
                                </ListItemIcon>
                                <ListItemText primary={e.name}></ListItemText>
                                {/*<ListItemText secondary="online" align="right"></ListItemText>*/}
                            </ListItemButton>
                        ))}

                    </List>
                </Grid>
                <Grid item xs={9}>
                    {selectedUser !== -1 ? (<>
                        <List className={classes.messageArea}>
                            {messages?.length ? messages?.map(e => (
                                <ListItem key={e.id}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <ListItemText align={e.User.id === user.id ? 'right' : 'left'}
                                                          primary={e.content}></ListItemText>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <ListItemText align={e.User.id === user.id ? 'right' : 'left'}
                                                          secondary={e.createdAt}></ListItemText>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            )) : 'Tidak ada'}
                            {typing ? <ListItem>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <ListItemText align="left"
                                                      primary="Typing..."></ListItemText>
                                    </Grid>
                                </Grid>
                            </ListItem> : ''}
                        </List>
                        <div>
                            <Divider/>
                            <Grid component="form" onSubmit={onSubmit} container style={{padding: '20px'}}>
                                <Grid item xs={11}>
                                    <TextField onChange={(e) => {
                                        setMessage(e.target.value)
                                        setValue("message", e.target.value)
                                    }} id="outlined-basic-email"
                                               label="Type Something" fullWidth/>
                                </Grid>
                                <Grid component="button" type="submit" xs={1} align="right">
                                    <Fab color="primary" aria-label="add"><SendIcon/></Fab>
                                </Grid>
                            </Grid>
                        </div>
                    </>) : 'kosong'}
                </Grid>
            </Grid>
        </div>
    );
}

export default App