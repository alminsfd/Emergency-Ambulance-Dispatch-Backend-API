
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import config from "./app/config";
import { AuthRoutes } from "./app/module/auth/auth.route";


// intialize app
const app: Application = express();
//cors handle
app.use(cors({
	origin: config.frontend_url,
	credentials:true
}));

//parser for middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/auth", AuthRoutes);



// Root Route
app.get("/", (_req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: "Welcome to Emergency Ambulance Dispatch API ",
	});
});


export default app;
