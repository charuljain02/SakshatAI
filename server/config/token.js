import jwt from 'jsonwebtoken';

const genToken = async (userId) => {
    try {
        // userId is wrapped in an object for the payload
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return token;    
    } catch (error) {
        console.error("JWT Generation Error:", error);
        return null;
    }
}

export default genToken;