export const socketConnection = io => {
    io.on("connection", socket => {
        console.log(">> CONNECTED TO SOCKET IO");
        // socket.broadcast.emit("t_c", { a_u: totalUsers });

        socket.on("setup", () => {
            socket.emit("connected");
        });

        socket.on("join_chat", chat_id => {
            console.log(socket.rooms, socket.id)
            socket.join(chat_id);
            socket.emit("chat_connected", chat_id);
        });
        socket.on("leave_chat", chat_id => {
            console.log(">>> leaving chat : ", chat_id)
            socket.leave(chat_id)
        })
        socket.on("private_message", (message, room_id) => {
            socket.to(room_id).emit("private_message_received", message, room_id);
        });
        socket.on("disconnect", () => {
            console.log("USER DISCONNECTED");
        });
    });
};
