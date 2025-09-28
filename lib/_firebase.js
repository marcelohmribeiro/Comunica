import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";
import { getStorage } from "@react-native-firebase/storage";

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export { auth, db, storage };
