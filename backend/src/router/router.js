import express from 'express';
const router = express.Router();

import con from '../db/db.js';

// Get Add Data
router.get('/getAllData', async (req,res) => {
    try {
        const sql_query = 'SELECT * FROM "post"';
        const result = await con.query(sql_query);
        res.status(200).json(result.rows);
    }
    catch (err){
        res.status(404).json(err);
    }
});

// Get Selected Range
router.get('/getDataFromRange', async(req,res) => {
    try{
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'startDate and endDate are required' });
        }

        const queryText = `
            SELECT * FROM post
            WHERE date >= $1 AND date <= $2
            ORDER BY date ASC
        `;

        const queryValues = [startDate, endDate];
        const result = await con.query(queryText, queryValues);
        
        res.status(200).json(result.rows);
    }
    catch (err) {
        res.status(404).json(err);
    }
});

// Get From Tags
router.get('/getTag', async (req,res) => {
    try {
        const { tag } = req.query;

        let queryText = `SELECT * FROM post`
        let queryValues = [];
        if (tag) {
            if (!Array.isArray(tag)) {
                tag = [tag];
            }
            queryText = `SELECT * FROM post WHERE tag = ANY($1)`;
            queryValues = [tag]; 
        }
        
        const result = await con.query(queryText,queryValues);
        res.status(200).json(result.rows);
    }
    catch (err){
        res.status(404).json(err);
    }
});

export default router;