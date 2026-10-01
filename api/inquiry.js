const { db, ObjectId, isAdmin } = require("../lib/db");
const clip = (v, n) => String(v || "").slice(0, n);
module.exports = async (req, res) => {
  try {
    const col = (await db()).collection("inquiries");
    if (req.method === "POST") {
      const b = req.body || {};
      if (!b.name || !b.phone) return res.status(400).json({ error: "Name and phone required" });
      await col.insertOne({ name: clip(b.name, 100), phone: clip(b.phone, 30), email: clip(b.email, 100),
        service: clip(b.service, 100), message: clip(b.message, 2000), createdAt: new Date() });
      return res.json({ ok: true });
    }
    if (!isAdmin(req)) return res.status(401).json({ error: "Wrong password" });
    if (req.method === "GET") return res.json({ items: await col.find().sort({ createdAt: -1 }).limit(200).toArray() });
    if (req.method === "DELETE") {
      await col.deleteOne({ _id: new ObjectId(String(req.query.id)) });
      return res.json({ ok: true });
    }
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ error: "Server error" }); }
};
