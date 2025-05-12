// functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const onBlogDeleted = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const blogId = req.body.id;
  if (!blogId) {
    res.status(400).send("Bad Request: Missing blog ID");
    return;
  }

  try {
    const snapshot = await db.collection("comments")
        .where("blogId", "==", blogId)
        .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    res.status(200).json({message: "Comments deleted"});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal Server Error"});
  }
});


