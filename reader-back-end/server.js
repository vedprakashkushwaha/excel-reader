const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors())
app.use(
    express.urlencoded({
      extended: true
    })
  )

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
        Records.insertMany(req.body.data).then(function(){
            return res.json({
                msg: 'records successfully created',
                status: 200,
                data: req.body.data
            });
        }).catch(function(error){
            return res.json({
                msg: 'unable to insert data!!',
                status: 500,
                error: error
            });
        });
    } catch(err){
        return res.json({
            msg: 'unable to create records',
            status: 500,
            error: err
        });
    } 
})

app.get('/get-records', async (req, res) => {
    const pageNo = isNaN(parseInt(req.query.pageNo)) ? 0 : parseInt(req.query.pageNo);
    const pageSize = isNaN(parseInt(req.query.pageSize)) ? 10 : parseInt(req.query.pageSize);
    try{
        const records = await Records
        .find()
        .skip(pageNo * pageSize)
        .limit(pageSize);

        return res.json({
            msg: 'data found successfully',
            status: 200,
            data: records
        })
    } catch(err){
        return res.json({
            msg: 'data not found',
            status: 500
        })
    }
})
app.listen(3000, ()=> {
    console.log('server is started on port:', 3000);
})