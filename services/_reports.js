import { auth, db } from "./_firebase";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  getDocsFromServer,
  orderBy,
  startAfter,
  limit as fsLimit,
} from "firebase/firestore";
import { uploadToCloudinary } from "./_upload-cloudinary";

export const createReport = async ({
  category,
  imageUri,
  location,
  description,
}) => {
  try {
    const user = auth.currentUser;
    if (!user?.uid) throw new Error("Usuário não autenticado");
    if (!category && !imageUri && !location && !description) {
      throw new Error("Os campos são obrigatórios.");
    }
    const reportsCol = collection(db, "reports");
    const reportRef = doc(reportsCol);
    const reportId = reportRef.id;

    const { secure_url: url } = await uploadToCloudinary(imageUri);

    const data = {
      id: reportId,
      description: description,
      category: category,
      imageUrl: url,
      userId: user.uid,
      status: "aberta",
      location: location,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(reportRef, data);
    return { id: reportId, ...data };
  } catch (error) {
    console.error("Erro ao criar denúncia:", error);
  }
};

export const getUserReports = async ({ limit, cursor = null }) => {
  try {
    const user = auth.currentUser;
    if (!user.uid) return [];

    const reportsCol = collection(db, "reports");
    let q = query(
      reportsCol,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    if (cursor) q = query(q, startAfter(cursor));
    if (limit) q = query(q, fsLimit(limit));

    let snap;
    try {
      snap = await getDocsFromServer(q);
    } catch (e) {
      snap = await getDocs(q);
    }

    const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const nextCursor = snap.docs.length
      ? snap.docs[snap.docs.length - 1]
      : null;
    return { items, nextCursor };
  } catch (error) {
    console.error("Erro ao buscar denúncias pelo userId:", error);
    throw error;
  }
};
