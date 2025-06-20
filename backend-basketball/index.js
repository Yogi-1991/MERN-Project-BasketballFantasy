import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
console.log('Stripe Key:', process.env.STRIPE_SECRET_KEY);

import configDb from './config/db.js';
import userControl from './app/controllers/user-controller.js';
import { checkSchema } from 'express-validator';
import { userRegisterValidation, userLoginValidation } from './app/validations/user-register-login-validator.js';
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
import playerValidation from './app/validations/player-validation.js';
import playerControl from './app/controllers/player-controller.js';
import scheduleValidation from './app/validations/schedule-validation.js';
import scheduleControl from './app/controllers/schedule-controller.js';
import lineupValidation from './app/validations/lineup-validation.js';
import lineupControl from './app/controllers/lineup-controller.js';
import matchStatsValidation from './app/validations/matchStats-validation.js';
import matchStatsControl from './app/controllers/matchStats-controller.js';
import upload from './app/middlewares/upload.js';
import fantasyTeamControl from './app/controllers/fantasyTeam-controller.js';
import fantasyTeamValidation from './app/validations/fantasyTeam-validation.js';
import contestControl from './app/controllers/contest-controller.js';
import leaderboardContrl from './app/controllers/leaderboard-controller.js';
import walletControl from './app/controllers/wallet-controller.js'

import cors from 'cors';


const app = express();

const port = process.env.PORT_NUMBER;
configDb();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


//Register - Login
app.post('/register',checkSchema(userRegisterValidation),userControl.register);
app.post('/login',checkSchema(userLoginValidation),userControl.login);
app.get('/user',authenticate, userControl.account);
app.put('/user/profile',authenticate, checkSchema(userLoginValidation), userControl.update);
app.put('/user/profile/:id',authenticate, checkSchema(idValidation),authorization(['admin']), userControl.updatebyId);//Deactivate user isactive false
app.get('/users',authenticate,authorization(['admin']), userControl.userList)


//registred user wallet update
app.put('/user-wallet/:id',authenticate,userControl.walletUpdate)

//admin create/list data entry account
app.get('/admin/data-entry-users',authenticate,authorization(['admin']), userControl.DataEntryUserList)

app.post('/dataentry',authenticate,authorization(['admin']),checkSchema(userRegisterValidation),userControl.createDataEntryAccount);
app.put('/dataentry/:id',authenticate,authorization(['admin']),checkSchema(idValidation),userControl.createDataEntryAccountUpdate);

//League 
app.post('/league',authenticate,authorization(['admin']),checkSchema(leagueValidations),legaueControl.create);
app.get('/leagues',authenticate,legaueControl.listLeagues);
app.put('/league/:id',authenticate,authorization(['admin']),checkSchema(idValidation),checkSchema(leagueValidations),legaueControl.leagueUpdate);
app.delete('/league/:id',authenticate,authorization(['admin']),checkSchema(idValidation),legaueControl.leagueRemove)

//season 
app.post('/season',authenticate,authorization(['admin']),checkSchema(seasonValidations),seasonControl.create);
app.get('/seasons',authenticate,seasonControl.listseasons);
app.put('/season/:id',authenticate,authorization(['admin']),checkSchema(idValidation),checkSchema(seasonValidations),seasonControl.seasonUpdate);
app.delete('/season/remove/:id',authenticate,authorization(['admin']),checkSchema(idValidation),seasonControl.seasonRemove)

//Team 

app.post('/team',authenticate,authorization(['admin']),upload.single('logoImage'),checkSchema(teamValidation),teamControl.create);
app.put('/team/add-player',authenticate,dataEntryAuthorization('teams'),teamControl.addPlayerToTeamSeason);
app.get('/teams',authenticate,teamControl.listTeams);
app.get('/team/:id',authenticate,checkSchema(idValidation),teamControl.listTeamsByLeague);
app.put('/team/:id',authenticate,dataEntryAuthorization('teams'),checkSchema(idValidation),checkSchema(teamValidation),teamControl.teamUpdate);//added one more middleware dataEntryAuthorization to check data entry task
app.delete('/team/:id',authenticate,dataEntryAuthorization(['teams']),checkSchema(idValidation),teamControl.teamRemove);
app.put('/team/:teamId/player-remove',authenticate,dataEntryAuthorization(['teams']),teamControl.teamPlayerRemove);

//player
app.post('/player',authenticate,dataEntryAuthorization('players'),upload.single('logoImage'),checkSchema(playerValidation),playerControl.create)
app.get('/players',authenticate,playerControl.listplayers);
app.get('/player/:id',authenticate,checkSchema(idValidation),playerControl.listplayersById);
app.put('/player/:id',authenticate,dataEntryAuthorization('player'),checkSchema(idValidation),checkSchema(playerValidation),playerControl.playerUpdate); 
app.delete('/player/:id',authenticate,authorization(['player']),checkSchema(idValidation),playerControl.playerRemove)

//Schedule
app.post('/schedule',authenticate,dataEntryAuthorization('schedule'),checkSchema(scheduleValidation),scheduleControl.create)
app.get('/schedule',authenticate,scheduleControl.listschedules);
app.get('/schedule/upcoming',authenticate,scheduleControl.upcomingSchedule);
app.get('/schedule/:id',authenticate,checkSchema(idValidation),scheduleControl.listschedulesById);
app.put('/schedule/:id',authenticate,dataEntryAuthorization('schedule'),checkSchema(idValidation),checkSchema(scheduleValidation),scheduleControl.scheduleUpdate);
app.delete('/schedule/:id',authenticate,authorization(['schedule']),checkSchema(idValidation),scheduleControl.scheduleRemove)

//lineups
app.post('/lineup',authenticate,dataEntryAuthorization('lineup'),checkSchema(lineupValidation),lineupControl.create)
app.get('/lineup',authenticate,lineupControl.listLineupByGameId);
app.put('/lineup/:id',authenticate,dataEntryAuthorization('lineup'),checkSchema(idValidation),checkSchema(lineupValidation),lineupControl.lineupUpdate); 
app.delete('/lineup/',authenticate,authorization(['lineup']),checkSchema(idValidation),lineupControl.lineupRemovebyGameID)

//matchStats
app.post('/match-stats',authenticate,dataEntryAuthorization('matchStats'),matchStatsControl.create)
app.put('/match-stats/:gameId/:playerId',authenticate,dataEntryAuthorization('matchStats'),matchStatsControl.matchStatsUpdate)

//Fantasy Team

app.post('/fantasy-team',authenticate,checkSchema(fantasyTeamValidation),fantasyTeamControl.createFantasyTeam);
app.put('/fantasy-team/:teamId',authenticate,checkSchema(fantasyTeamValidation),fantasyTeamControl.updateFantasyTeam);
app.get('/fantasy-team/:gameId',authenticate,fantasyTeamControl.myteam);
app.get('/fantasy-contest',authenticate,fantasyTeamControl.myContest);
//try to load the players to create the fantasy team 
app.get('/fantasy/players/:gameId',authenticate,fantasyTeamControl.getPlayersForMatch)
app.get('/fantasy-team-user',authenticate,fantasyTeamControl.getFantasyTeamByUser)


//contest
app.post('/contest-public',authenticate,authorization(['admin']),contestControl.createPublicContest);
app.post('/contest-private',authenticate,contestControl.createPrivateContest);
app.put('/join-contest/:contestId',authenticate,contestControl.joinContest); 
app.get('/contest/joined',authenticate,contestControl.getJoinedContests);
app.put('/contest-status/:contestId',authenticate,authorization(['admin']),contestControl.updateContestStatus);
app.get('/contest',authenticate,contestControl.allContest)
app.get('/contest/:gameId',authenticate,contestControl.contestByGameId)
app.get('/contest-user/:contestId',authenticate,contestControl.contestByUser)


//Leaderboard
app.get('/leaderboard/:contestId',authenticate,checkSchema(idValidation),leaderboardContrl.leaderboard);

// Stripe payment
app.post('/createPaymentIntent',authenticate,walletControl.createPaymentIntent)
app.post('/confirmPayment',authenticate,walletControl.confirmPayment)


app.listen(port,()=>{
    console.log('Server is running on the Port number', port)
});