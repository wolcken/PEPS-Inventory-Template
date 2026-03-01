import React, { createContext, useState, ReactNode } from 'react'

export interface AuthContextType {
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }