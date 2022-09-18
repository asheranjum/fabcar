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



    async createVoterObj(
        ctx, 
        id,
        name,
        cnic,
        password,
        isVoted,
        voted_at,
        created_at) {
        console.info('============= START : Create Voter Object ===========');


        const voter = {
            id,
            name,
            docType: 'voter',
            cnic,
            password,
            isVoted,
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
        cnic,
        password,
        created_at) {
        console.info('============= START : Create Candidate Object ===========');


        const candidate = {
            candidateId,
            name,
            docType: 'candidate',
            cnic,
            password,
            created_at
        };

        // console.log(name);
        await ctx.stub.putState(candidateId, Buffer.from(JSON.stringify(candidate)));
        console.info('============= END : Candidate Object ===========');
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
