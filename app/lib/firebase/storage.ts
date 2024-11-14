import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./client";

const storage = getStorage(app);

export async function uploadImage(file: File, path: string) {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
} 