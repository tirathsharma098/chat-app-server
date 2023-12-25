import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import apiRoutes from "./src/api/routes";
import { AppDataSource } from "./src/database/config";
import cors from "cors";
import helmet from "helmet";
// import fs from "fs";
// import https from "https";
import { errorHandler } from "./src/utils/errorHandler";
import { settingHeader } from "./src/utils/setHeader";
import { Server } from "socket.io";
import { socketConnection } from "./src/socket/connection";
const PORT = process.env.PORT;

const app: Application = express();
// Setting cors
app.use(cors());
// app.all("*", function (req, res, next) {
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "X-Requested-With, content-type, Authorization, Accept"
//     );
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Expose-Headers", "Authorization");
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//     );
//     next();
// });
app.all("*", settingHeader);
app.use(helmet());
app.use(express.json());
// Setting public static folder
app.set("trust proxy", true);
// All Routes
app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "🏡 Hello 🏡",
    });
});
app.use("/api/v1", apiRoutes);
// Error Handler
app.use(errorHandler);

// const options = {
//     key: fs.readFileSync('/etc/letsencrypt/live/erp.codebuster.io/privkey.pem'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/erp.codebuster.io/cert.pem')
// };

AppDataSource.initialize()
    .then(() => {
        console.log(">>> CONNECTED WITH DB");
        // const app1 = https.createServer(options, app);
    })
    .catch(e => {
        console.log("ERROR OCCURRED WHILE CONNECTING WITH DB : ", e);
    });

const appServer = app.listen(PORT, () =>
    console.log(`App is running: 🚀 http://localhost:${PORT} 🚀`)
);

const io = new Server(appServer, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_DOMAIN,
    }
});
socketConnection(io);