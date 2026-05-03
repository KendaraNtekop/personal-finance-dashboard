let transactions = [];  //array to hold user transactions
let currentType = 'expense';

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

currentType = 'expense';

function setType(type) {
    currentType = type;
    const expenseBtn = document.getElementById('btn-expense');
    const incomeBtn  = document.getElementById('btn-income');
    expenseBtn.classList.remove('active');
  incomeBtn.classList.remove('active');

  if (type === 'expense') {
    expenseBtn.classList.add('active');
  } else {
    incomeBtn.classList.add('active');
  }

  if (type === 'income') {
    categoryInput.value = 'income';
  } else if (categoryInput.value === 'income') {
    categoryInput.value = 'food'; // reset to default expense cat
  }

}

const CAT_META = {
  food      : { label: 'Food',         icon: '🍽', bg: '#FEF3DC', color: '#7A4A00' },
  transport : { label: 'Transport',    icon: '🚌', bg: '#E3F5F1', color: '#0A5247' },
  airtime   : { label: 'Data/Airtime', icon: '📶', bg: '#EAF0FB', color: '#1A3A6B' },
  leisure   : { label: 'Leisure',      icon: '🎬', bg: '#FBEAF0', color: '#72243E' },
  income    : { label: 'Income',       icon: '💰', bg: '#E8F5EE', color: '#0F5E3A' },
  other     : { label: 'Other',        icon: '📌', bg: '#F0EFE9', color: '#5F5E5A' },
};

function renderList() {

  if (transactions.length === 0) {
    txList.innerHTML = `
      <div class="empty-state">
        <span class="icon">₦</span>
        <p>No transactions yet.<br/>Add your first one above.</p>
      </div>`;
    return;
  }
// This is where we build the HTML string.
  // We start empty and add to it in the loop.
  let html = '';

  // Loop through every transaction in the array
  transactions.forEach(function(tx) {

    // Look up the category display data
    // If category doesn't exist, fall back to 'other'
    const meta = CAT_META[tx.category] || CAT_META.other;

    // Income gets a + sign, expense gets a − sign
    const sign = tx.type === 'income' ? '+' : '−';

    // Format the amount with ₦ and commas
    // e.g. 45000 becomes ₦45,000
    const formattedAmount = '₦' + tx.amount.toLocaleString('en-NG');

    // Build the HTML for this one transaction
    // Notice we use tx.name, tx.amount etc —
    // pulling data OUT of the object

     html += `
      <div class="tx-item" id="tx-${tx.id}">

        <div class="tx-icon" style="background:${meta.bg}">
          ${meta.icon}
        </div>

        <div class="tx-body">
          <div class="tx-name">${tx.name}</div>
          <div class="tx-meta">
            <span class="tx-cat-tag" 
              style="background:${meta.bg}; color:${meta.color}">
              ${meta.label}
            </span>
            <span class="tx-date">${tx.date}</span>
          </div>
        </div>

        <div class="tx-amount ${tx.type}">
          ${sign}${formattedAmount}
        </div>

        <button class="tx-delete" onclick="deleteTransaction(${tx.id})">
          ✕
        </button>

      </div>`;
  });

  
  txList.innerHTML = html;
}


function deleteTransaction(id) {

  transactions = transactions.filter(function(tx) {
    return tx.id !== id;
  });

  
  renderList();
  updateSummary();
}


nameInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    addTransaction();
  }
});

dateInput.value = new Date().toISOString().split('T')[0];

