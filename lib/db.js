const { MongoClient, ObjectId } = require("mongodb");
const crypto = require("crypto");
let conn;
exports.db = async () => {
  conn = conn || new MongoClient(process.env.MONGODB_URI).connect();
  return (await conn).db("wifly");
};
exports.ObjectId = ObjectId;
const h = s => crypto.createHash("sha256").update(String(s)).digest();
exports.isAdmin = req => {
  const real = process.env.ADMIN_PASSWORD || "";
  return real.length > 0 && crypto.timingSafeEqual(h(req.headers["x-admin-password"] || ""), h(real));
};
