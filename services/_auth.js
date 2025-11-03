import { auth } from "./_firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export const signUpEmail = async (email, password, name) => {
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    await updateProfile(cred.user, { displayName: name });
    return cred.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signInEmail = async (email, password) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    return cred.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signOutApp = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const sendVerificationEmail = async () => {
  try {
    if (!auth.currentUser) throw new Error("Sem usuário autenticado.");
    await sendEmailVerification(auth.currentUser);
  } catch (error) {
    console.error("Erro ao enviar verificação:", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    if (!auth.currentUser) throw new Error("Sem usuário autenticado.");
    await updateProfile(auth.currentUser, profileData);
    return auth.currentUser;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};
