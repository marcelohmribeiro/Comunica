import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@react-native-firebase/auth";
import { auth } from "@/lib/_firebase";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);

  return { user, initializing };
};

export { useAuth };
