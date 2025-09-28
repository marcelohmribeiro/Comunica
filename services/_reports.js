import { auth, db, storage } from "@/lib/_firebase";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocsFromServer,
} from "@react-native-firebase/firestore";

async function uploadReportImage({ userId, reportId, imageUri }) {
  try {
    if (!imageUri) return null;

    const ext = imageUri.split(".").pop()?.split("?")[0] || "jpg";
    const path = `reports/${userId}/${reportId}.${ext}`;
    const ref = storage.ref(path);

    await ref.putFile(imageUri);
    return await ref.getDownloadURL();
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
  }
}

export async function createReport({
  title,
  description,
  category,
  imageUri,
  location = null,
}) {
  try {
    const user = auth.currentUser;
    if (!user?.uid) throw new Error("Usuário não autenticado");

    const reportsCol = collection(db, "reports");
    const reportRef = doc(reportsCol);
    const reportId = reportRef.id;

    const imageUrl = await uploadReportImage({
      userId: user.uid,
      reportId,
      imageUri,
    });

    const data = {
      id: reportId,
      title: title,
      description: description,
      category: category,
      imageUrl: imageUrl || null,
      userId: user.uid,
      status: "aberta",
      location: location || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(reportRef, data);
    return { id: reportId, ...data };
  } catch (error) {
    console.error("Erro ao criar denúncia:", error);
  }
}

export async function getUserReports() {
  try {
    const user = auth.currentUser;
    if (!user.uid) return [];

    const reportsCol = collection(db, "reports");

    // só filtra pelo userId
    const q = query(reportsCol, where("userId", "==", user.uid));

    const snap = await getDocsFromServer(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar denúncias pelo userId:", error);
    return [];
  } finally {
  }
}
