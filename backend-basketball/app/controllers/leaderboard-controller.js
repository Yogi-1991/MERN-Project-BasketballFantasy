import FantasyPoints from "../modules/fantasyPoint-schema-module.js";
const leaderboardContrl = {};


leaderboardContrl.leaderboard = async(req,res)=>{
    const {contestId} = req.params;
    try{
        const leaderboard = await FantasyPoints.findOne({contestId:contestId})
            .populate('fantasyTeamId')
            .populate("userId", "name email")
            .sort({ totalPoints: -1 }) // descending

            if(!leaderboard){
                return res.status(404).json({error : "No data found for this contest"})
             }
             res.status(200).json(leaderboard);
             
    }catch(err){
        console.log(err);
        return res.status(500).json({error:'Somehting went wrong'});
    }


}

export default leaderboardContrl;