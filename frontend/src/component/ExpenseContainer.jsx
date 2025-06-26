import React, { useEffect, useState } from 'react'
import Expenceform from './Expenseform.jsx'
import History from './History.jsx'
import BalanceContainer from './BalanceContainer.jsx';

import {v4 as uid} from "uuid";
function ExpenseContainer(){
  
const [expense,setExpense]=useState([])

const fetchExpense = async()=>{
  try {
    const response=await fetch('http://localhost:4000/Expense')
    const data=await response.json()
    setExpense(data.map(item => ({ ...item, id: item._id })))
    
  } catch (error) {
    console.error('failed to fetch data',error)
  }
}
useEffect(()=>{
  fetchExpense();
},[]);

const addExpense=async(title,amount)=>{
  try {
    const response=await fetch('http://localhost:4000/Expense',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({title,amount}),
    })
    if(response.ok){
      const newItem =await response.json();
      setExpense((prev)=>[...prev,newItem])
    }else{
       console.log('failed to fetch')
    }
  } catch (error) {
   console.error("Failed to add expense",error)
  }

}

const deleteExpense = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/Expense/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setExpense(expense.filter((exp) => exp.id !== id));
    } else {
      console.error('Failed to delete expense');
    }
  } catch (error) {
    console.error('Failed to delete expense', error);
  }
}
console.log(expense[0])
  return (
    <div className='expense-container'>
      <BalanceContainer expense={expense}/>
        <History expense={expense} deleteExpense={deleteExpense}/>
        <Expenceform addExpense={addExpense}/>
    </div>
  )
}
export default ExpenseContainer