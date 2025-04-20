import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(Cookies.get("token") || null);
    const [role, setRole] = useState(Cookies.get("role") || null);
    const [profile, setProfile] = useState(Cookies.get("profile") || null);
    const [id, setId] = useState(Cookies.get("id") || null);

    function login(newToken, newRole, newProfile,newId) {
        Cookies.set('token', newToken, { expires: 1 });
        Cookies.set('role', newRole, { expires: 1 });
        Cookies.set('profile', newProfile, { expires: 1 });
        Cookies.set('id', newId, { expires: 1 });


        setToken(newToken);
        setRole(newRole);
        setProfile(newProfile)
        setId(newId)
    }

    function logout() {
        Cookies.remove('token');
        Cookies.remove('role');
        Cookies.remove('profile');
        Cookies.remove('id')

        setToken(null);
        setRole(null);
        setProfile(null);
        setId(null)
    }

    return (
        <AuthContext.Provider value={{ token, role, profile,id, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default function useAuth() {
    return useContext(AuthContext);
}
