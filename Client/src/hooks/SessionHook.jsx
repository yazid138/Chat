import React, {createContext, useState, useEffect, useContext} from 'react';
import {useMutation} from "@tanstack/react-query";
import axios from "axios";

const SessionContext = createContext({
    isLoading: false,
    user: {name: '', id: -1, token: '', username: ''},
    login: ({username, password}) => {
    },
    error: null,
});

const url = 'http://localhost:5000'

const SessionProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [error, setError] = useState(null)
    const isAuthenticated = !!user;

    useEffect(() => {
        const userdata = localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"))
        setUser(userdata)
        // checkAuthStatus();
    }, []);

    const {
        mutate: loginUser,
        isLoading,
    } = useMutation((data) => axios.post(url + '/auth/login', data), {
        onSuccess: async ({data: result}) => {
            const {data: result2} = await axios.get(url + '/auth/detail', {
                headers: {
                    Authorization: 'Bearer ' + result.data.token
                }
            })
            console.log('tes')
            result2.data.token = result.data.token
            localStorage.setItem("user", JSON.stringify(result2.data))
            location.href = '/'
        },
        onError: (error) => {
            setError(error.response)
            console.log(error.response)
        }
    })

    const login = (data) => {
        loginUser(data)
    };

    const logout = async () => {
        await axios.delete(url + '/auth/logout', {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        setUser({})
        localStorage.clear()
    };

    const checkAuthStatus = () => {
    };

    return (
        <SessionContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
                checkAuthStatus,
                isLoading,
                error,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

const useSession = () => (useContext(SessionContext))

export {SessionProvider, useSession};
