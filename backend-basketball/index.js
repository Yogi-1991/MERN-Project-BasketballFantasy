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
import leagueValidations from './app/validations/league-validation.js';
import legaueControl from './app/controllers/league-controller.js'
import seasonValidations from './app/validations/season-validation.js';
import seasonControl from './app/controllers/season-controller.js';
import teamControl from './app/controllers/team-comtroller.js';
import teamValidation from './app/validations/team-validation.js';
import dataEntryAuthorization from './app/middlewares/dataEntryAuthorization.js';
import upload from './app/middlewares/upload.js';


const app = express();
dotenv.config();
const port = process.env.PORT_NUMBER;
configDb();
app.use(express.json());
app.use('/uploads', express.static('uploads'));


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

//League 
app.post('/league/create',authenticate,authorization(['admin']),checkSchema(leagueValidations),legaueControl.create);
app.get('/leagues',authenticate,legaueControl.listLeagues);
app.put('/league/:id',authenticate,authorization(['admin']),checkSchema(idValidation),checkSchema(leagueValidations),legaueControl.leagueUpdate);
app.delete('/league/remove/:id',authenticate,authorization(['admin']),checkSchema(idValidation),legaueControl.leagueRemove)

//season 
app.post('/season/create',authenticate,authorization(['admin']),checkSchema(seasonValidations),seasonControl.create);
app.get('/seasons',authenticate,seasonControl.listseasons);
app.put('/season/:id',authenticate,authorization(['admin']),checkSchema(idValidation),checkSchema(seasonValidations),seasonControl.seasonUpdate);
app.delete('/season/remove/:id',authenticate,authorization(['admin']),checkSchema(idValidation),seasonControl.seasonRemove)

//Team 
app.post('/team/create',authenticate,authorization(['admin']),upload.single('logoImage'),checkSchema(teamValidation),teamControl.create)
app.get('/teams',authenticate,teamControl.listTeams);
app.get('/team/:id',authenticate,checkSchema(idValidation),teamControl.listTeamsByLeague);
app.put('/team/:id',authenticate,dataEntryAuthorization('teams'),checkSchema(idValidation),checkSchema(teamValidation),teamControl.teamUpdate);//I have wrote dataEntryAuthorization 
app.delete('/team/:id',authenticate,authorization(['admin']),checkSchema(idValidation),teamControl.teamRemove)

app.listen(port,()=>{
    console.log('Server is running on the Port number', port)
});