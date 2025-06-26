const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json())
require('dotenv').config();
const cors = require('cors');
app.use(cors())
app.use(express.urlencoded({extended: true}));

const expenseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    }
})
 const Expense = mongoose.model('Expense',expenseSchema);


 mongoose.connect(process.env.MONGO_URI)
 .then(()=>{
    console.log("connced to mongodb");
 })
 .catch((err)=>{
    console.log('mongodb connection error: ',err);
 })


 app.post('/Expense' ,async(req,res)=>{
    try{
      const {title, amount}=req.body;
      const expense = new Expense({title, amount})
      await expense.save();
      res.status(201).json(expense)
    }catch(error){
      console.error('Error saving expense,error')
      res.status(500),json({error: "failed to save"});
    }
 })


 app.get('/Expense',async (req,res)=>{
    try{
       const expenses = await Expense.find();
       res.json(expenses)

    }catch(error){
      console.error('Error getting expense,error')
      res.status(500),json({error: "failed to load"});
    }
 });

 app.delete('/Expense/:userId', async(req,res)=>{
   try{
     const { userId } = req.params;
     const deleteExpense = await Expense.findByIdAndDelete(userId);
     if(!deleteExpense){
       return res.status(404).json({error : "not found"});
     }
     res.status(200).json({message:"expense deleted", deleteExpense});
   } catch(error){
     console.error('error deleting expense',error)
     res.status(500).json({error:'failed to delete'})
   }
 })
app.listen(process.env.PORT,()=>{
    console.log(`server is listening on port ${process.env.PORT}`)
})