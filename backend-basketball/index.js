import express from 'express';
import dotenv from 'dotenv';
import configDb from './config/db.js';
import userControl from './app/controllers/user-controller.js';
import { checkSchema } from 'express-validator';
import { userRegisterValidation, userLoginValidation } from './app/validations/user-register-login-validator.js';
// import {  } from './app/validations/user-register-login-validator.js';
import authenticate from './app/middlewares/authenticate.js';
import authorization from './app/middlewares/authorization.js';
import idValidation from './app/validations/idValidation.js';

const app = express();
dotenv.config();
const port = process.env.PORT_NUMBER;
configDb();
app.use(express.json());

//Register - Login
app.post('/register',checkSchema(userRegisterValidation),userControl.register);
app.post('/login',checkSchema(userLoginValidation),userControl.login);
app.get('/user/profile',authenticate, userControl.account);
app.put('/user/profile',authenticate, checkSchema(userLoginValidation), userControl.update);
app.put('/user/profile/:id',authenticate, checkSchema(idValidation),authorization(['admin']), userControl.updatebyId);//Deactivate user isactive false
app.get('/users',authenticate,authorization(['admin']), userControl.userList)

//admin create data entry account
app.post('/dataentry/create',authenticate,authorization(['admin']),checkSchema(userRegisterValidation),userControl.createDataEntryAccount);
app.put('/dataentry/update/:id',authenticate,authorization(['admin']),checkSchema(idValidation),userControl.createDataEntryAccountUpdate);



app.listen(port,()=>{
    console.log('Server is running on the Port number', port)
});