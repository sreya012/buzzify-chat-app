const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const signup = async (req, res) => {
    try {
        const {fullName, username, password, phoneNumber} = req.body;
        //creating a random userID for each new user
        const userId = crypto.randomBytes(16).toString('hex');//it will create a random sequence of 16 hexadecimal digits
        //We will use connect() from getStream to connect to the server
        const serverClient = connect(api_key, api_secret, app_id);
        //We will use the serverClient to create a new user token
        const hashedPassword = await bcrypt.hash(password, 10);//10 is the level of encryption. This line is basically turning our plain text password to the hashed password
        const token = serverClient.createUserToken(userId);
        //Returing the data to the frontend as it is more secure
        res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber })
    } catch(error) {
        console.log(error);
        res.status(500).json({message: error})
    }
};

const login = async (req, res) => {//req : contains the information what we send from the frontend
    try {
        const { username, password } = req.body;
        const serverClient = connect(api_key, api_secret, app_id);
        //Creating a new instance of a stream chat. We are passing the api_key and the api_secret as we want to query all the users from the database that match this specific username
        const client = StreamChat.getInstance(api_key, api_secret);
        const {users} = await client.queryUsers({name: username});
        if(!users.length) return res.status(400).json({message: 'User not found'});
        //If the user exists we have to decrypt the password and see if it matches the one that the user created the account with
        const success = await bcrypt.compare(password, users[0].hashedPassword);
        //We will now create a token and we will no longer pass just a regular userid. We will pass that specific user's id
        const token = serverClient.createUserToken(users[0].id);
        if(success) {
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id });
        } else {
            res.status(500).json({ message: 'Incorrect Password' });
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({message: error})
    }
};

//exporting our controllers so that it can be imported in the routes
module.exports = { signup, login };

