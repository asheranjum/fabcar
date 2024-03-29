/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        // console.info('============= START : Initialize Ledger ===========');
        // const voter = [
        //     {
        //         id: '1',
        //         name: 'Asher',
        //         docType: 'voter',
        //         isVoted: false,
        //     },
          
        // ];

        // for (let i = 0; i < voter.length; i++) {
        //     voter[i].docType = 'voter';
        //     await ctx.stub.putState('VOTE' + i, Buffer.from(JSON.stringify(voter[i])));
        //     console.info('Added <--> ', voter[i]);
        // }
        console.info('============= END : Initialize Ledger ===========');
    }



    async createAdminUserObj(
        ctx, 
        id,
        name,
        email,
        phone,
        cnic,
        state,
        city , 
        role ,
        user_id,
        password,
        created_at) {
        console.info('============= START : Admin User Object ===========');

        const AdmniUser = {
            id,
            name,
            docType: 'AdminUser',
            cnic,
            state,
            email , 
            phone ,
            city,
            role,
            user_id,
            password,
            created_at
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(AdmniUser)));
        console.info('============= END : Admin User Enrolled ===========');
    }
    
    async createVoterObj(
        ctx, 
        id,
        name,
        cnic,
        phone, 
        state, 
        city , 
        district,
        template1 , 
        template2 ,
        fingerprintMatchStatus,
        password,
        isVoted,
        user_id,
        voted_at,
        created_at) {
        console.info('============= START : Create Voter Object ===========');


        const voter = {
            id,
            name,
            docType: 'voter',
            cnic,
            phone, 
            state,
            city , 
            district,
            template1 , 
            template2 ,
            fingerprintMatchStatus,
            password,
            isVoted,
            user_id,
            voted_at,
            created_at
        };

        // console.log(name);
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(voter)));
        console.info('============= END : Voter Object ===========');
    }






    async createCandidatesObj(
        ctx, 
        candidateId,
        name,
        vison,
        chairman_name ,
        chairman_cnic ,
        vice_chairman_name ,
        vice_chairman_cnic ,
        secretary_name ,
        secretary_cnic ,
        attacment,
        password,
        user_id,
        created_at) {
        console.info('============= START : Create Candidate Object ===========');


        const candidate = {
            candidateId,
            name,
            vison,
            chairman_name ,
            chairman_cnic ,
            vice_chairman_name ,
            vice_chairman_cnic ,
            secretary_name ,
            secretary_cnic ,
            docType: 'candidate',
            attacment,
            password,
            user_id,
            created_at
        };

        // console.log(name);
        await ctx.stub.putState(candidateId, Buffer.from(JSON.stringify(candidate)));
        console.info('============= END : Candidate Object ===========');
    }


    async createElectionObj(
        ctx, 
        electionID,
        title,
        startTime,
        endTime,
        isStarted,
        candidatesIDs ,
        created_at) {

        console.info('============= START : Create Election Object ===========');


        const electionData = {
            electionID,
            title,
            docType: 'election',
            startTime,
            endTime,
            isStarted,
            candidates:candidatesIDs,
            created_at
        };

        console.log(electionData);
        await ctx.stub.putState(electionID, Buffer.from(JSON.stringify(electionData)));

        console.info('============= END : Election Generated Object ===========');
    }



    async setStartElectionByID(
        ctx, 
        StartelectionID,
        electionID,
        created_at) {

        console.info('============= START : Create Election Object ===========');


        const electionData = {
            StartelectionID,
            electionID,
            docType: 'Startelection',
            created_at
        };

        // console.log(electionData);

        
        const updateElection = await ctx.stub.getState(electionID); 
        if (!updateElection || updateElection.length === 0) {
            throw new Error(`${updateElection} does not exist`);
        }

        const electionRec = JSON.parse(updateElection.toString());
        electionRec.isStarted = 'true';

        await ctx.stub.putState(electionID, Buffer.from(JSON.stringify(electionRec)));



        await ctx.stub.putState(StartelectionID, Buffer.from(JSON.stringify(electionData)));

        console.info('============= END : Election Generated Object ===========');
    }


    async queryElection(ctx, electionID) {
        const getElectionId = await ctx.stub.getState(electionID); // get the car from chaincode state
        if (!getElectionId || getElectionId.length === 0) {
            throw new Error(`${electionID} does not exist`);
        }
        console.log(getElectionId.toString());
        return getElectionId.toString();
    }

    
    async queryVoter(ctx, voterID) {
        const getVoter = await ctx.stub.getState(voterID); // get the car from chaincode state
        if (!getVoter || getVoter.length === 0) {
            throw new Error(`${getVoter} does not exist`);
        }
        console.log(getVoter.toString());
        return getVoter.toString();
    }

    async queryAllVoter(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async createVotingCasting(
        ctx, 
        castID,
        candidateId,
        voterID,
        electionId,
        created_at) {

        console.info('============= START : Create Election Object ===========');


        const CastData = {
            castID,
            candidateId,
            docType: 'voteCast',
            voterID,
            electionId,
            created_at
        };

        console.log(CastData);
        await ctx.stub.putState(castID, Buffer.from(JSON.stringify(CastData)));
        console.info('============= END : Vote Casted Object ===========');
    }



    async getVoted(ctx, voterID, voted_at) {
        console.info('============= START : VoterObjectUpdate ===========');

        const voterData = await ctx.stub.getState(voterID); // get the car from chaincode state
        if (!voterData || voterData.length === 0) {
            throw new Error(`${voterID} does not exist`);
        }
        const voter = JSON.parse(voterData.toString());
        voter.isVoted = 'true';
        voter.voted_at = voted_at;

        await ctx.stub.putState(voterID, Buffer.from(JSON.stringify(voter)));
        console.info('============= END : VoterObjectUpdate ===========');


        return JSON.stringify(voter);

    }



        async getVoted(ctx, voterID, voted_at) {
        console.info('============= START : VoterObjectUpdate ===========');

        const voterData = await ctx.stub.getState(voterID); // get the car from chaincode state
        if (!voterData || voterData.length === 0) {
            throw new Error(`${voterID} does not exist`);
        }
        const voter = JSON.parse(voterData.toString());
        voter.isVoted = 'true';
        voter.voted_at = voted_at;

        await ctx.stub.putState(voterID, Buffer.from(JSON.stringify(voter)));
        console.info('============= END : VoterObjectUpdate ===========');


        return JSON.stringify(voter);

    }


    async resetElection(ctx, voterID) {
        console.info('============= START : changeCarOwner ===========');

        const VoterData = await ctx.stub.getState(voterID); // get the car from chaincode state
        if (!VoterData || VoterData.length === 0) {
            throw new Error(`${voterID} does not exist`);
        }
        const voter = JSON.parse(VoterData.toString());
        voter.isVoted = '';
        voter.voted_at = '';

        await ctx.stub.putState(voterID, Buffer.from(JSON.stringify(voter)));
        console.info('============= END : changeCarOwner ===========');
    }



    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createCar(ctx, carNumber, make, model, color, owner) {
        console.info('============= START : Create Car ===========');

        const car = {
            color,
            docType: 'car',
            make,
            model,
            owner,
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
    }

    async queryAllCars(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = FabCar;
