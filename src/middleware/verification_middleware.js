const ResponseDto = require('../dto/response_dto')
const constants = require('../utils/constants')
const User = require('../models/User')
const Role = require('../models/Role')

exports.userVerification = (req, res, next) => {
    const totalToken = req.headers['authorization']

    if (totalToken) {
        const leadToken = totalToken.split(' ')[0]
        const authToken = totalToken.split(' ')[1]

        if ((leadToken == 'Bearer') && authToken) {
            User.findOne({
                where: {
                    token: authToken
                }
            }).then(returnedUser => {
                next()
            }).catch(err => {
                res.status(constants.UNAUTHORIZEDCODE).json(new ResponseDto(constants.UNAUTHORIZEDCODE, constants.UNAUTHORIZEDMESSAGE, 'No user with this token'))
            })
        } else {
            res.status(constants.UNAUTHORIZEDCODE).json(new ResponseDto(constants.UNAUTHORIZEDCODE, constants.UNAUTHORIZEDMESSAGE, 'Invalid token'))
        }
    } else {
        res.status(constants.UNAUTHORIZEDCODE).json(new ResponseDto(constants.UNAUTHORIZEDCODE, constants.UNAUTHORIZEDMESSAGE, 'Token required'))
    }
    
}

exports.adminVerification = (req, res, next) => {
    const totalToken = req.headers['authorization']

    if (totalToken) {
        const leadToken = totalToken.split(' ')[0]
        const authToken = totalToken.split(' ')[1]

        if (leadToken == 'Bearer' && authToken) {
            User.findOne({
                where: {
                    token: authToken
                }
            }).then(returnedUser => {
                return Role.findOne({
                    where: {
                        id: returnedUser.roleId
                    }
                })
            }).then(returnedRole => {
                if (returnedRole) {
                    if (returnedRole.name == constants.ADMIN) {
                        req.fromAdmin = true
                        next()
                    } else {
                        return res.status(constants.UNAUTHORIZEDCODE).json(new ResponseDto(constants.UNAUTHORIZEDCODE, constants.UNAUTHORIZEDMESSAGE, 'You must be an admin to acces this route'))
                    }
                } else {
                    return res.status(constants.UNAUTHORIZEDCODE).json(new ResponseDto(constants.UNAUTHORIZEDCODE, constants.UNAUTHORIZEDMESSAGE, 'Unidentified role'))
                }
            }).catch(err => {
                return res.status(constants.UNAUTHORIZEDCODE).json(new ResponseDto(constants.UNAUTHORIZEDCODE, constants.UNAUTHORIZEDMESSAGE, err.toString()))
            })
        } else {
            return res.status(constants.UNAUTHORIZEDCODE).json(new ResponseDto(constants.UNAUTHORIZEDCODE, constants.UNAUTHORIZEDMESSAGE, 'Invalid token'))
        }
    } else {
        return res.status(constants.UNAUTHORIZEDCODE).json(new ResponseDto(constants.UNAUTHORIZEDCODE, constants.UNAUTHORIZEDMESSAGE, 'Token required'))
    }
}