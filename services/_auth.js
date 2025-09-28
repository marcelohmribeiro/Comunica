import { auth } from "@/lib/_firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  updateProfile,
} from "@react-native-firebase/auth";

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
  }
};

export const signInEmail = async (email, password) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    return cred.user;
  } catch (error) {
    console.error(error);
  }
};

export const signOutApp = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error(error);
  }
};

export const sendVerificationEmail = async () => {
  try {
    if (!auth.currentUser) throw new Error("Sem usuário autenticado.");
    await sendEmailVerification(auth.currentUser);
  } catch (error) {
    console.error("Erro ao enviar verificação:", error);
  }
};
