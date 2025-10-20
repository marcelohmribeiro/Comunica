import { auth } from "./_firebase";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from "firebase/auth";

export async function signInWithGoogle(idToken) {
  const credential = GoogleAuthProvider.credential(idToken);
  const { user } = await signInWithCredential(auth, credential);
  return user;
}

export async function signOutGoogle() {
  await signOut(auth);
}
