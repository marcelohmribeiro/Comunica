import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  getAuth,
  updateProfile,
  sendEmailVerification,
  createUserWithEmailAndPassword,
} from "@react-native-firebase/auth";

const auth = getAuth();

export const signUpEmail = async (email, password, name) => {
  const cred = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  if (name && name.trim()) {
    await updateProfile({ displayName: name.trim() });
  }

  try {
    await sendEmailVerification();
  } catch (e) {
    console.log("Erro ao enviar verificação:", e);
  }
  return cred.user;
};

export const signInEmail = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
};

export const resetPassword = async (email) => {
  return sendPasswordResetEmail(auth, email.trim());
};

export const signOutApp = async () => {
  return await signOut(auth);
};
