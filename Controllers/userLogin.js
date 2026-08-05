import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userEmail = "sachin@gmail.com";
const userPassword = "$2b$10$cfyRzijqWqdEkzlQ0y31..gj92yHdGd.kqCRSu9d3kwNwSppVboh2"  //"sachin123#";
const saltRounds = 10;

export const userLogin = async (req, res) => {
    try {
        
        // const { loginData } = req.body;
        const { email, password } = req.body;
        // console.log('Received login request:', { email, password });

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        //get hashed password and email from db and compare with the user input
        
        const isPasswordMatch = await bcrypt.compare(password, userPassword);
        
        const token = jwt.sign(
        { id: "6a4a3718a44edb6e01aa4262" },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
        );

        if (email === userEmail && isPasswordMatch) {
            console.log('Login successful for user:', email);
            return res.status(200).json({ message: 'Login successful', token, id: "6a4a3718a44edb6e01aa4262"  });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during user login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
// console.log('Hashed Password:', hashedPassword);