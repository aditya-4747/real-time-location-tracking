import express from "express"
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const io = new Server(server);

app.use(express.static(join(__dirname,"public")));

io.on('connection', (socket) => {
    console.log("New User Connected");

    socket.on('send-location', (data) => {
        io.emit('receive-location', {id: socket.id, ...data});
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnected", {id: socket.id});
    });
});

app.get("/", (_,res) => {
    res.render("index.ejs");
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});