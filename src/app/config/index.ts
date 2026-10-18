import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	database_url: process.env.DATABASE_URL,
	port: process.env.PORT,
	clientId: process.env.GoogleClientId,
	nodeEnv: process.env.NODE_ENV,
	frontend_url: process.env.FontendUrl,
	google_client_id: process.env.GoogleClientId,
	jwt_access_secret:process.env.JWT_ACCESS_SECRET,
	jwt_refresh_secret:process.env.JWT_REFRESH_SECRET,
	jwt_refresh_expires_in:process.env.JWT_REFRESH_EXPIRES_IN,
	jwt_access_expires_in:process.env.JWT_ACCESS_EXPIRES_IN
};
