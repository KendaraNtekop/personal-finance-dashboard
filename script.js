let transactions = [];  //array to hold user transactions

//read values from here
const nameInput     = document.getElementById('tx-name');
const amountInput   = document.getElementById('tx-amount');
const dateInput     = document.getElementById('tx-date');
const categoryInput = document.getElementById('tx-category');

//write into these
const txList        = document.getElementById('tx-list');
const totalIncome   = document.getElementById('total-income');
const totalExpense  = document.getElementById('total-expense');
const totalBalance  = document.getElementById('total-balance');

const addBtn        = document.getElementById('add-btn');

//FUNCTIONS

function addTransaction() {
const name     = nameInput.value.trim();
const amount   = parseFloat(amountInput.value);
const date     = dateInput.value;
const category = categoryInput.value;

if (name === '') {
    alert('Please enter a description');
    return;   
  }

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  const newTransaction = {
    id       : Date.now(),  // unique number based on time
    name     : name,
    amount   : amount,
    date     : date,
    category : category,
    type     : currentType  
  };

  transactions.unshift(newTransaction);

  renderList();     // redraws the transaction list
  updateSummary();  // recalculates the totals

  nameInput.value   = '';
  amountInput.value = '';

}