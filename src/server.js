// require('dotenv').config();

require('./utils/constants')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');

const sequelize = require('./database/database');
const verificationMiddleware = require('./middleware/verification_middleware')
const imageUploadMiddleware = require('./middleware/image_upload_middleware')

const User = require('./models/User')
const Role = require('./models/Role')

const roleRoute = require('./routes/role_route')
const userRoute = require('./routes/user_route')
const authRoute = require('./routes/auth_route')
const codeAttemptRoute = require('./routes/code_attempt_route');
const CodeAttempt = require('./models/CodeAttempt');

const app = express()

//middlewares
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: '*'}))

//routes declaration
app.use('/role', verificationMiddleware.adminVerification, roleRoute)
app.use('/user', userRoute)
app.use('/admin', verificationMiddleware.adminVerification, userRoute)
app.use('/adminattempts', verificationMiddleware.adminVerification, codeAttemptRoute)
app.use('/auth', authRoute),
app.use('/code', verificationMiddleware.userVerification, codeAttemptRoute)

//Relationship declarations
User.belongsTo(Role)

// app.listen(4000, async () => {
//     try {
//       await sequelize.authenticate();
//       console.log('Database connected!');
//     } catch (error) {
//       console.error('Unable to connect to the database:', error);
//     }
//   });

// Synchronize database
sequelize.sync({ force: false }).then(result => {
    console.log('============== The database has been synchronized ====================');
    app.listen(process.env.PORT || 4000)
}).catch(err => {
    console.log('========== This is the error ==================');
    console.log(err);
})

// module.exports = app