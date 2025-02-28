import jwt from "jsonwebtoken"
//import crypto from "crypto"

const generateTokenAndSetCookies = (userId, res) => {
    const token = jwt.sign(
       { userId },
       process.env.JWT_SECRET,
       { expiresIn: "15d" }
    )

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
    })

    return token
}
//console.log(crypto.randomBytes(64).toString("hex"));




export default generateTokenAndSetCookies