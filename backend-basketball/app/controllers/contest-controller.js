import {validationResult} from 'express-validator';
import Contest from "../modules/contest-schema-module.js";
import User from '../modules/user-schema-module.js';
import Schedule from '../modules/schedule-schema-module.js';
import {nanoid} from 'nanoid';
import FantasyTeams from '../modules/fantasyTeam-schema-module.js';

const contestControl = {};

contestControl.createPublicContest  = async(req,res)=>{
  const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }

    const {name,gameId,entryFee,prizePool,maxPlayers} = req.body;
    const userId = req.userId;

    try{
        const schedule = await Schedule.findById(gameId);
        if(!schedule){
            return res.status(404).json({error:'Match not found '})
        }

        const now = new Date();
        const matchStartTime = new Date(schedule.matchDate); 

        if (now >= matchStartTime) {
            return res.status(400).json({ notice: 'Cannot create team after match has started.' });
        }

        const contest = await Contest.create({name,gameId,entryFee,prizePool,maxPlayers,type:'public',createdBy:userId});
        return res.status(201).json(contest);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'});
    }
}

// controllers/contestController.js
contestControl.updateContest = async (req, res) => {
  const { id } = req.params;
  const { name, entryFee, prizePool, maxPlayers } = req.body;

  try {
    const contest = await Contest.findById(id);

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    // Check match time to block updates if already started
    const schedule = await Schedule.findById(contest.gameId);
    if (!schedule || new Date(schedule.matchDate) <= new Date()) {
      return res.status(400).json({ error: 'Cannot update contest after match has started' });
    }

    // Update fields
    contest.name = name;
    contest.entryFee = entryFee;
    contest.prizePool = prizePool;
    contest.maxPlayers = maxPlayers;

    await contest.save();

    return res.status(200).json({ message: 'Contest updated successfully', contest });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error while updating contest' });
  }
};

contestControl.contestById = async(req,res)=>{
    const {id} = req.params;

    const contest = await Contest.findById(id)
    if(!contest){
        return res.status(404).json({error:"Data not found"})
    }

    return res.status(200).json(contest);

}

contestControl.contestRemove = async(req,res)=>{
    const {id} = req.params;

    const contest = await Contest.findByIdAndDelete(id)
    if(!contest){
        return res.status(404).json({error:"Data not found"})
    }

    return res.status(200).json(contest);

}

contestControl.getParticipants = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate({
        path: 'participants.userId',
        select: 'name email',
      })
      .populate({
        path: 'participants.fantasyTeamId',
        select: 'teamName totalFantasyPoints',
      });

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    res.status(200).json(contest.participants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
};


contestControl.createPrivateContest = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }

    const {name,gameId,entryFee,prizePool,maxPlayers} = req.body;
    const userId = req.userId;
    const invitationCode = nanoid(8);
    try{
        const schedule = await Schedule.findById(gameId);
        if(!schedule){
            return res.status(404).json({error:'Match not found '})
        }
        const now = new Date();
        const matchStartTime = new Date(schedule.matchDate);       

        if (now >= matchStartTime) {
            return res.status(400).json({ notice: 'Cannot create contest after match has started.' });
        }

        const contest = await Contest.create({name,gameId,entryFee,prizePool,maxPlayers,type:'private',invitationCode,createdBy:userId});
        return res.status(201).json(contest);
    }catch(err){
        console.log(err);
        return res.status(500).json({error:'Something went wrong'});
    }

}

contestControl.joinContest = async(req,res)=>{

    
   
    console.log("Params:", req.params);          // contestId
    console.log("Body:", req.body);       

    const {contestId} = req.params;
    const { fantasyTeamId, invitationCode } = req.body;
    const userId = req.userId;

    if (typeof contestId !== 'string' || typeof fantasyTeamId !== 'string' || !contestId.trim() || !fantasyTeamId.trim()) {
        return res.status(400).json({ error: 'Invalid contestId or fantasyTeamId' });
      }

    try{

        if (!contestId || !fantasyTeamId) {
            return res.status(400).json({ error: 'contestId and fantasyTeamId are required' });
          }

    //checking contest in the db
    const contest = await Contest.findById(contestId).populate('gameId');
    if (!contest) {
        return res.status(404).json({ error: 'Contest not found' });
    }

    const now = new Date();
    const matchStartTime = new Date(contest.gameId.matchDate); 

    if (now >= matchStartTime) {
            return res.status(400).json({ error: 'Cannot create team after match has started.' });
        }

    const fantasyTeam = await FantasyTeams.findOne({_id:fantasyTeamId,userId:userId});
    if(!fantasyTeam){
        return res.status(404).json({ error: 'Invalid team found' });
    }
    //checking already joined the contest
    const alreadyParticipant = contest.participants.find((p)=>{
        return p.userId.toString() === userId.toString()
    })
    if(alreadyParticipant){
        return res.status(400).json({error:'You have already joined the contest'})
    }

    //checking to see whether contest is full
    if(contest.participants.length >= contest.maxPlayers){
        return res.status(400).json({error: 'contest is full'})
    }

    //checking invitation code if contest is private
    if(contest.type === 'private'){
        if(!invitationCode || invitationCode !== contest.invitationCode){
            return res.status(403).json({error: 'invalid code'})
        }
    }


    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({error:'user not found'});
    }

    //checking the wallet balance
    if(user.wallet.balance < contest.entryFee){
        return res.status(400).json({error:'Insufficient wallet balance'})
    }

    //deducting balance
    user.wallet.balance = user.wallet.balance - contest.entryFee;
    user.wallet.history.push({
        amount:contest.entryFee,
        type:'debit',
        description: `joined the contest ${contest.name}`,
        })

        await user.save();

    //adding the user to contest

    contest.participants.push({
        userId,
        fantasyTeamId
    })

    await contest.save();
    return res.status(200).json(contest);
    }catch(err){
        console.log(err);
        return res.status(500).json({error:'Something went wrong'});
    }
}

contestControl.getJoinedContests = async(req,res)=>{
    try{

        const contest = await Contest.find({'participants.userId': req.userId})
        .populate('gameId') // here retriving all fileds which pointing to the gameID
        .populate('participants.fantasyTeamId')
        return res.status(200).json(contest)
    }catch(err){
        console.log(err);
        return res.status(500).json({error:'Somehting went wrong'});
    }
}

contestControl.updateContestStatus = async(req,res)=>{

    const { contestId } = req.params;
    const { status } = req.body;

    try {
        const contest = await Contest.findById(contestId);
        if (!contest) {
          return res.status(404).json({ error: 'Contest not found' });
        }
    
        contest.status = status;
        await contest.save();
    
        return res.status(200).json(contest);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong' });
      }
}

contestControl.allContest = async (req, res) => {
  try {
    const contests = await Contest.find()
      .populate({
        path: 'gameId',
        select: 'matchDate homeTeam awayTeam',
        populate: [
          { path: 'homeTeam', select: 'teamName' },
          { path: 'awayTeam', select: 'teamName' }
        ]
      });

    if (contests.length === 0) {
      return res.status(404).json({ error: 'No contests created' });
    }

    return res.status(200).json(contests);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

contestControl.contestByGameId = async(req,res)=>{
    const {gameId} = req.params;
    try{
        const contest = await Contest.find({gameId})
        console.log("contets data",contest)
        if(contest.length === 0){
            return res.status(404).json({error:"No contest for the game"})
        }
        return res.status(200).json(contest);
    }catch(err){
        console.log(err)
        return res.status(500).json({error:"Something went wrong"})
    }

}

contestControl.contestByUser = async(req,res)=>{
        const {contestId} = req.params;
        const userId = req.userId
    try{
        const contestUser = await Contest.find({_id : contestId, 'participants.userId': userId})
        if(contestUser.length === 0){
            return res.status(404).json({error:"Not joined the contest yet"})
        }
        return res.status(200).json(contestUser)
    }catch(err){
            console.log(err)
            return res.status(500).json({error: "Something went wrong"})
    }
}

contestControl.distributeContestPrizes = async (req, res) => {
  try {
    const { contestId } = req.params;

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    if (contest.prizesDistributed) {
      return res.status(400).json({ message: 'Prizes already distributed' });
    }

    if (contest.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot distribute prizes before contest is completed' });
    }

    // Call your existing prize distribution logic
    await distributePrizes(contestId);

    return res.status(200).json({ message: 'Prizes distributed successfully' });
  } catch (err) {
    console.error('Error distributing prizes:', err);
    return res.status(500).json({ error: 'Failed to distribute prizes' });
  }
};

export default contestControl;