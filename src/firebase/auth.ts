import { auth } from "../firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
    onAuthStateChanged,
    type User,
} from "firebase/auth";

export const AuthAPI = {
    onChange(cb: (u: User | null) => void) {
        return onAuthStateChanged(auth, cb);
    },

    async register(email: string, password: string, displayName?: string) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) await updateProfile(user, { displayName });
        return user;
    },

    async login(email: string, password: string) {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        return user;
    },

    async logout() {
        await signOut(auth);
    },
};