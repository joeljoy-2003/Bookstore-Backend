const users = require("../model/userModel");
const jwt = require('jsonwebtoken');

//register
exports.registerCotroller = async (req, res) => {
    console.log(`Inside Register Controller`);
    const { username, password, email } = req.body
    console.log(username, password, email);

    //logic 
    try {
        const existingUser = await users.findOne({ email: email })
        if (existingUser) {
            res.status(404).json(`User Already Exists....Please Login...`)
        } else {
            const newUser = new users({
                username, //username:username,
                email, //email:email,
                password //password:password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(500).json(error)
    }


}

//login
exports.loginCotroller = async (req, res) => {
    console.log(`Inside login Controller`);
    const { password, email } = req.body
    console.log(password, email);
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            if (existingUser.password == password) {
                const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.JWTSecretKey)
                res.status(200).json({ existingUser, token })
            } else {
                res.status(401).json(`Invalid Credentials`)
            }
        } else {
            res.status(404).json(`User Not found...Please Resgister`)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// google login
exports.googleLoginCotroller = async (req, res) => {
    console.log(`Inside Google login Controller`);
    const { password, email, username, profile } = req.body
    console.log(password, email, username, profile);

    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role },
                process.env.JWTSecretKey)
            res.status(200).json({ existingUser, token })
        } else {
            const newUser = new users({
                username, email, password, profile
            })
            await newUser.save()
            const token = jwt.sign({ userMail: newUser.email, role: existingUser.role },
                process.env.JWTSecretKey)
            res.status(200).json({ existingUser:newUser, token })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// update user profile
exports.updateUserProfileController = async (req, res) => {
    console.log(`Inside Update User Profile Controller`);
    //get data
    const { username, password, bio, role, profile } = req.body
    const email = req.payload
    console.log(username, password, bio, role);

    const uploadProfile = req.file ? req.file.filename : profile
    console.log(uploadProfile);

    try {
        const updateUser = await users.findOneAndUpdate({ email }, {
            username, email, password, bio,
            profile: uploadProfile, role
        }, { new: true } //{new:true} nthayalum kodukanam for updation
        )
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get all users in admin
exports.getAllUsersAdminController = async (req, res) => {
    const userMail = req.payload
    try {
        const allusers = await users.find({ email: { $ne: userMail } })
        res.status(200).json(allusers)

    } catch (error) {
        res.status(500).json(error)
    }
}


//update admin profile
exports.updateAdminProfileController = async (req, res) => {
    console.log(`Inside Admin Update Profile Controller`);
    //get data
    const { username, password, profile } = req.body
    const email = req.payload
    const role = req.role
    console.log(username, password, role);

    const uploadProfile = req.file ? req.file.filename : profile
    console.log(uploadProfile);

    try {
        const updateAdmin = await users.findOneAndUpdate({ email }, {
            username, email, password,
            profile: uploadProfile, role
        }, { new: true } //{new:true} nthayalum kodukanam for updation
        )
        res.status(200).json(updateAdmin)
    } catch (error) {
        res.status(500).json(error)
    }
}



