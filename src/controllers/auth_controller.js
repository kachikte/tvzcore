const ResponseDto = require('../dto/response_dto')
const constants = require('../utils/constants')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const LoginUserDto = require('../dto/login_user_dto')

exports.login = (req, res) => {
    const emailAddress = req.body['email']
    const password = req.body['password']

    let activeUser

    if (!emailAddress || !password) {
        return res.status(constants.BADREQUESTCODE).json(new ResponseDto(constants.BADREQUESTCODE, constants.BADEQUESTMESSAGE, 'Email and Password required'))
    }

    User.findOne({
        where: {
            email: emailAddress
        },

    }).then(returnedUser => {
        console.log(`returned user - ${returnedUser}`);
        if (returnedUser) {
            activeUser = returnedUser
            return bcrypt.compare(password, returnedUser.password)
        } else {
            return res.status(constants.NOTFOUNDCODE).json(new ResponseDto(constants.NOTFOUNDCODE, constants.NOTFOUNDMESSAGE, 'User not found'))
        }
    }).then(passwordMatch => {
        if (passwordMatch) {
           const token = jwt.sign({email: emailAddress}, constants.SECRETKEY, { expiresIn: '1h'})
           activeUser.token = token
           return activeUser.save()
        } else {
            return res.status(constants.NOTFOUNDCODE).json(new ResponseDto(constants.NOTFOUNDCODE, constants.NOTFOUNDMESSAGE, 'Incorrect Password'))
        }
    }).then(saveUserToken => {
        // return res.status(constants.SUCCESSCODE).json(new ResponseDto(constants.SUCCESSCODE, constants.SUCCESSMESSAGE, new LoginUserDto(saveUserToken.firstname, saveUserToken.lastname, saveUserToken.email, saveUserToken.token)))

        return res.status(constants.SUCCESSCODE).json(new ResponseDto(constants.SUCCESSCODE, constants.SUCCESSMESSAGE, {'firstname': saveUserToken.firstname, 'lastname': saveUserToken.lastname, 'email': saveUserToken.email, 'token': saveUserToken.token, 'role': saveUserToken.roleId}))
    }).catch(err => {
        console.log('error')
        return res.json(new ResponseDto(constants.SERVERERRORCODE, constants.SERVERERRORMESSAGE, err.toString()))
        // return res.status(constants.SERVERERRORCODE).json(new ResponseDto(constants.SERVERERRORCODE, constants.SERVERERRORMESSAGE, err.toString()))
    })
}