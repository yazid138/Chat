import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

const url = 'http://localhost:5000/auth'

export const authOptions = {
    pages: {
        signIn: "/auth/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type: "text"},
                password: {label: "Password", type: "password"},
            },
            authorize: async(credentials, req) => {
                try {
                    const {data: token} = await axios.post(`${url}/login`, credentials)
                    if (token?.data) {
                        const {data: user} = await axios.get(`${url}/detail`, {headers: {Authorization: `Bearer ${token.data.token}`}})
                        if (user?.data) return {...user.data, token: token.data.token}
                    }
                    return null
                } catch (e) {
                    throw new Error(e.response.data.message)
                }
            }
        },)
    ],
    callbacks: {
        jwt: ({ user, token }) => {
            if (user) token.user = user;
            return token;
        },
        session: ({ session, token }) => {
            session.user = token.user;
            return session;
        },
    }
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}

