# WiFly Admin Setup (Vercel + MongoDB + Cloudinary)
1. MongoDB Atlas: free M0 cluster -> Database Access (user+password) -> Network Access: 0.0.0.0/0 -> Connect -> copy connection string.
2. Cloudinary: free account -> note Cloud name -> Settings > Upload > Add upload preset -> Signing mode: **Unsigned** -> note the preset name.
3. Edit admin/index.html: set CLOUD and PRESET at the top of the script.
4. Vercel -> Project -> Settings -> Environment Variables: MONGODB_URI (connection string), ADMIN_PASSWORD (your admin password). Then Redeploy.
5. Open https://YOUR-SITE.vercel.app/admin
