const Role = require('../models/Role')
const constants = require('../utils/constants')
const ResponseDto = require('../dto/response_dto')


exports.createRole = (req, res) => {

    const roleName = req.body['name']

    if (!roleName) {
        return res.status(constants.UNPROCESSABLEENTITYCODE).json(new ResponseDto(constants.UNPROCESSABLEENTITYCODE, constants.UNPROCESSABLEENTITYMESSAGE, 'Error'));
    }

    Role.findOne({
        where: {
            name: roleName
        }
    }).then(result => {
        if (result) {
            return res.status(constants.DUPLICATEDATACODE).json(new ResponseDto(constants.DUPLICATEDATACODE, constants.DUPLICATEDATAMESSAGE, 'Role already exists'))
        } else {
            return Role.create({
                name: roleName
            })
        }
    }).then(result => {
        return res.status(constants.CREATEDCODE).json({statusCode: constants.CREATEDCODE, message: constants.CREATEDMESSAGE, data: result});
    }).catch(err => {
        console.log('Error with creation of role');
        // return res.status(constants.SERVERERRORCODE).json({statusCode: constants.SERVERERRORCODE, message: constants.SERVERERRORMESSAGE, data: err.toString()});
    })
}

exports.updateRole = (req, res) => {
    const roleId = req.params.roleId
    const roleName = req.body['name']

    if(!roleId || !roleName) {
        return res.status(constants.BADREQUESTCODE).json(new ResponseDto(constants.BADREQUESTCODE, constants.BADEQUESTMESSAGE, ""))
    }

    Role.findOne({
        where: {
            id: roleId
        }
    }).then(roleFound => {
        if (roleFound) {
            roleFound.name = roleName
            return roleFound.save();
        } else {
            return res.status(constants.BADREQUESTCODE).json(new ResponseDto(constants.BADREQUESTCODE, constants.BADEQUESTMESSAGE, ""))
        }
    }).then(savedRole => {
        return res.status(constants.SUCCESSCODE).json(new ResponseDto(constants.SUCCESSCODE, constants.SUCCESSMESSAGE, savedRole))
    }).catch(err => {
        return res.status(constants.UNPROCESSABLEENTITYCODE).json(new ResponseDto(constants.SERVERERRORCODE, constants.SERVERERRORMESSAGE, ""))
    })
}

exports.listRoles = (req, res) => {
    Role.findAll().then(allRoles => {
        return res.status(constants.SUCCESSCODE).json(new ResponseDto(constants.SUCCESSCODE, constants.SUCCESSMESSAGE, allRoles))
    }).catch(err => {
        return res.status(constants.SERVERERRORCODE).json(new ResponseDto(constants.SERVERERRORCODE, constants.SERVERERRORMESSAGE, ""))
    })
}