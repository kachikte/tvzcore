class LoginUserDto {
    constuctor(firstName, lastName, emailAddress, authToken) {
        this.firstname = firstName
        this.lastname = lastName
        this.email = emailAddress
        this.token = authToken
    }
}

module.exports = LoginUserDto