const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/excel_reader', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
    console.log("success")
});


const excelRecords = new mongoose.Schema({
   name: String,
   age: Number,
   contact: String 
})

const Records = mongoose.model('Records', excelRecords)

app.post('/insert', async(req, res) =>{
    try{
        const record = new Records({
            name: 'xyz',
            age: 20,
            contact: '987654320'
        })
        await record.save((err, record) =>{
            console.log('new records created: ', record)
            return res.json({
                msg: 'records successfully created',
                status: 200,
                data: record
            });
        })
    } catch(err){
        return res.json({
            msg: 'unable to create records',
            status: 500,
        });
    } 
})

app.get('/get-records', async (req, res) => {
    try{
        const records = await Records.find();
        return res.json({
            mag: 'data found successfully',
            status: 200,
            data: records
        })
    } catch(err){
        return res.json({
            mag: 'data not found',
            status: 500
        })
    }
})
app.listen(3000, ()=> {
    console.log('server is started on port:', 3000);
})



