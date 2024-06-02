const ResponseDto = require('../dto/response_dto')
const Role = require('../models/Role')
const User = require('../models/User')
const constants = require('../utils/constants')
const bcrypt = require('bcryptjs')
const UserImage = require('../models/UserImage')

exports.registerUser = (req, res) => {
    const file = req.file;
    const firstName = req.body['firstname']
    const lastName = req.body['lastname']
    const password = req.body['password']
    const emailAddress = req.body['email']
    const role = req.body['role']
    const isAdmin = req.fromAdmin

    let encryptPassword = ""

    if (!firstName || !lastName || !password || !emailAddress || !role) {
        return res.status(constants.BADREQUESTCODE).json(new ResponseDto(constants.BADREQUESTCODE, constants.BADEQUESTMESSAGE, ''))
    }

    if (!isAdmin && role == 1) {
        return res.status(constants.BADREQUESTCODE).json(new ResponseDto(constants.UNAUTHORIZEDCODE, constants.UNAUTHORIZEDMESSAGE, 'You are not authorized to create an admin'))
    }

    Role.findOne({
        where: {
            id: role
        }
    }).then(foundRole => {
        if (foundRole) {
            return User.findOne({
                where: {
                    email: emailAddress
                }
            })
        } else {
            return res.status(constants.SERVERERRORCODE).json(new ResponseDto(constants.SERVERERRORCODE, constants.SERVERERRORMESSAGE, "Role does not exist"))
        }
    }).then(foundUser => {
        if (foundUser) {
            return res.status(constants.DUPLICATEDATACODE).json(new ResponseDto(constants.DUPLICATEDATACODE, constants.DUPLICATEDATAMESSAGE, 'User already exists'))
        } else {
             return bcrypt.hash(password, 12)
        }
    }).then(encryptedPassword => {
        encryptPassword =  encryptedPassword
        if (file) {
            return UserImage.create({
                filename: file.originalname,
                mimeType: file.mimetype,
                data: file.buffer
            })
        }
        return
    }).then(createdImage => {
        return User.create({
            firstname: firstName,
            lastname: lastName,
            email: emailAddress,
            password: encryptPassword,
            token: '',
            roleId: role,
            imageId: createdImage ? createdImage.id : null
        })
    }).then(createdUser => {
        res.status(constants.CREATEDCODE).json(new ResponseDto(constants.CREATEDCODE, constants.CREATEDMESSAGE, createdUser))
    }).catch(err => {
        console.log(`${firstName} ${lastName} ${emailAddress} ${encryptPassword} ${role} ${err.toString()}`);
        // return res.status(constants.SERVERERRORCODE).json(new ResponseDto(constants.SERVERERRORCODE, constants.SERVERERRORMESSAGE, err.toString()))
    })
}

exports.listUsers = (req, res) => {

    const isAdmin = req.fromAdmin

    if (!isAdmin) {
        return res.status(constants.BADREQUESTCODE).json(new ResponseDto(constants.UNAUTHORIZEDCODE, constants.UNAUTHORIZEDMESSAGE, 'You are not authorized to create an admin'))
    }

    User.findAll({
        include: [
            // { model: UserImage },
            { model: Role }
        ]
    }).then(allUsers => {
        return res.status(constants.SUCCESSCODE).json(new ResponseDto(constants.SUCCESSCODE, constants.SUCCESSMESSAGE, allUsers))
    }).catch(err => {
        // console.log('Error');
        return res.status(constants.SERVERERRORCODE).json(new ResponseDto(constants.SERVERERRORCODE, constants.SERVERERRORMESSAGE, ""))
    })
    
}