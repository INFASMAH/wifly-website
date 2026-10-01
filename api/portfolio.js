const { db, ObjectId, isAdmin } = require("../lib/db");
const CATS = ["it", "design", "gift", "docs", "travel"];
module.exports = async (req, res) => {
  try {
    const col = (await db()).collection("works");
    if (req.method === "GET") {
      const items = await col.find().sort({ createdAt: -1 }).toArray();
      res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=60");
      return res.json({ items: items.map(({ _id, title, category, image }) => ({ id: String(_id), title, category, image })) });
    }
    if (!isAdmin(req)) return res.status(401).json({ error: "Wrong password" });
    if (req.method === "POST") {
      const { title, category, image } = req.body || {};
      if (!title || !CATS.includes(category)) return res.status(400).json({ error: "Title and category required" });
      if (image && !/^https:\/\/res\.cloudinary\.com\//.test(image)) return res.status(400).json({ error: "Bad image link" });
      await col.insertOne({ title: String(title).slice(0, 100), category, image: image || "", createdAt: new Date() });
      return res.json({ ok: true });
    }
    if (req.method === "DELETE") {
      await col.deleteOne({ _id: new ObjectId(String(req.query.id)) });
      return res.json({ ok: true });
    }
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error" }); }
};
