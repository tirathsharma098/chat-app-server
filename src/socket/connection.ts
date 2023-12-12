let totalUsers = 0;

export const socketConnection = io => {
    io.on("connection", socket => {
        console.log(">> CONNECTED TO SOCKET IO");
        ++totalUsers;
        socket.broadcast.emit("t_c", { a_u: totalUsers });

        socket.on("setup", userData => {
            socket.join(userData);
            socket.emit("connected");
        });

        socket.on('b_m', (m)=> {
            socket.broadcast.emit("b_m", m);
        })

        socket.on("disconnect", () => {
            --totalUsers;
            console.log("USER DISCONNECTED");
        });
    });
};
