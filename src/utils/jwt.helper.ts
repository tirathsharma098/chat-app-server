import jwt from "jsonwebtoken";
const jwtSecret = process.env.SECRET_KEY;
interface JwtPayload {
    id: string;
}

function decodeToken(token: string) {
    return jwt.decode(token.replace("Bearer ", "")) as JwtPayload;
}

function getJWTToken(data: JwtPayload) {
    const token = `Bearer ${jwt.sign(data, jwtSecret)}`;
    return token;
}

export { decodeToken, getJWTToken };
