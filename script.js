let transactions = [];  //array to hold user transactions
let savingsGoals = [];
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


//ADD TRANSACTION
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
    id       : Date.now(),
    name     : name,
    amount   : amount,
    date     : date,
    category : category,
    type     : currentType  
  };

  // ✅ Each of these appears ONCE only
  transactions.unshift(newTransaction);
  renderList();
  updateSummary();
  renderRecentList();

  nameInput.value   = '';
  amountInput.value = '';
}

currentType = 'expense';


//SETS TYPE OF TRANSACTION - INCOME OR EXPENSE
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


//OBJECT LIST FOR RENDERING
const CAT_META = {
  food      : { label: 'Food',         icon: '🍽', bg: '#FEF3DC', color: '#7A4A00' },
  transport : { label: 'Transport',    icon: '🚌', bg: '#E3F5F1', color: '#0A5247' },
  airtime   : { label: 'Data/Airtime', icon: '📶', bg: '#EAF0FB', color: '#1A3A6B' },
  leisure   : { label: 'Leisure',      icon: '🎬', bg: '#FBEAF0', color: '#72243E' },
  income    : { label: 'Income',       icon: '💰', bg: '#E8F5EE', color: '#0F5E3A' },
  other     : { label: 'Other',        icon: '📌', bg: '#F0EFE9', color: '#5F5E5A' },
};


//RENDER FUNCTION - DISPLAYS TRANSACTION ON SCREEN, LOOPS THROUGH EACH TRANSACTION AND BUILDS HTML
function renderList() {

  if (transactions.length === 0) {
    txList.innerHTML = `
      <div class="empty-state">
        <span class="icon">₦</span>
        <p>No transactions yet.<br/>Add your first one above.</p>
      </div>`;
    return;
  }

  let html = '';

  transactions.forEach(function(tx) {

 
    const meta = CAT_META[tx.category] || CAT_META.other;

    const sign = tx.type === 'income' ? '+' : '−';

   
    const formattedAmount = '₦' + tx.amount.toLocaleString('en-NG');

    

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


//DELETE TRANSACTION FUNCTION
function deleteTransaction(id) {

  transactions = transactions.filter(function(tx) {
    return tx.id !== id;
  });

  
  renderList();
  updateSummary();
}

// CALCULATES INCOME, SPENT AND BALANCE

function updateSummary() {

  
  const incomeTransactions  = transactions.filter(function(tx) {
    return tx.type === 'income';
  });

  const expenseTransactions = transactions.filter(function(tx) {
    return tx.type === 'expense';
  });


  const totalIncomeAmount  = incomeTransactions.reduce(function(sum, tx) {
    return sum + tx.amount;
  }, 0);
  // if there are no income transactions, reduce returns 0 ✅

  const totalExpenseAmount = expenseTransactions.reduce(function(sum, tx) {
    return sum + tx.amount;
  }, 0);

  const balance = totalIncomeAmount - totalExpenseAmount;


  
  const fmt = function(amount) {
    return '₦' + Math.abs(amount).toLocaleString('en-NG');
  };
  

  totalIncome.textContent  = fmt(totalIncomeAmount);
  totalExpense.textContent = fmt(totalExpenseAmount);
  totalBalance.textContent = fmt(balance);


  

  if (balance > 0) {
    totalBalance.style.color = '#0F5E3A';   
  } else if (balance < 0) {
    totalBalance.style.color = '#8B2020';   
  } else {
    totalBalance.style.color = '';          
  }
}




nameInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    addTransaction();
  }
});

dateInput.value = new Date().toISOString().split('T')[0];

// NAVIGATION — show and hide views

function showView(viewName, btn) {

  document.querySelectorAll('.view').forEach(function(view) {
    view.classList.remove('active');
  });

  document.querySelectorAll('.nav-btn').forEach(function(b) {
    b.classList.remove('active');
  });

  document.getElementById('view-' + viewName).classList.add('active');

  // Highlight the clicked nav button
  if (btn) btn.classList.add('active');

  // If switching to overview, refresh the recent list
  if (viewName === 'overview') {
    renderRecentList();
  }
}


// RECENT LIST — shows last 3 on overview page

function renderRecentList() {
  const recentList = document.getElementById('recent-list');

  if (transactions.length === 0) {
    recentList.innerHTML = `
      <div class="empty-state">
        <span class="icon">₦</span>
        <p>No transactions yet.</p>
      </div>`;
    return;
  }

  
  const recent = transactions.slice(0, 3);
  let html = '';

  recent.forEach(function(tx) {
    const meta = CAT_META[tx.category] || CAT_META.other;
    const sign = tx.type === 'income' ? '+' : '−';
    const formattedAmount = '₦' + tx.amount.toLocaleString('en-NG');

    html += `
      <div class="tx-item">
        <div class="tx-icon" style="background:${meta.bg}">${meta.icon}</div>
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
      </div>`;
  });

  recentList.innerHTML = html;
}

function addGoal() {
  const name   = document.getElementById('goal-name').value.trim();
const amount = parseFloat(document.getElementById('goal-target').value);

  if (name === '') {
    alert('Please enter a description');
    return;   
  }

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  const newGoal = {
    id       : Date.now(),
    name     : name,
    target   : amount,
    saved    : 0 
  };

  // ✅ Each of these appears ONCE only
  savingsGoals.unshift(newGoal);
  
  renderGoals();

   document.getElementById('goal-name').value   = '';
  document.getElementById('goal-target').value = '';
}

function renderGoals() {

  
  const select = document.getElementById('goal-select');
  select.innerHTML = '<option value="">-- choose a goal --</option>';

  savingsGoals.forEach(function(goal) {
    const option = document.createElement('option');
    option.value = goal.id;
    option.textContent = goal.name;
    select.appendChild(option);
  });


  const container = document.getElementById('goals-list');

  if (savingsGoals.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="icon">🎯</span>
        <p>No goals yet.<br/>Add your first one above.</p>
      </div>`;
    return;
  }

  
  let html = '';

  savingsGoals.forEach(function(goal) {

    const percentage = Math.min((goal.saved / goal.target) * 100, 100);
    const savedFmt   = '₦' + goal.saved.toLocaleString('en-NG');
    const targetFmt  = '₦' + goal.target.toLocaleString('en-NG');

    html += `
      <div class="tx-item">

        <div class="tx-body">
          <div class="tx-name">${goal.name}</div>
          <div class="tx-meta">
            <span class="tx-date">${savedFmt} saved of ${targetFmt}</span>
          </div>
          <div class="goal-track">
            <div class="goal-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="goal-pct">${Math.round(percentage)}% complete</div>
        </div>

        <div class="tx-amount income">${savedFmt}</div>

        <button class="tx-delete" onclick="deleteGoal(${goal.id})">✕</button>

      </div>`;
  });

  container.innerHTML = html;
}

function logSavings() {

  
  const goalId = document.getElementById('goal-select').value;
  const amount = parseFloat(document.getElementById('savings-amount').value);

  
  if (goalId === '') {
    alert('Please select a goal');
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  
  const myGoal = savingsGoals.find(function(goal) {
    return goal.id === Number(goalId);
  });

  
  myGoal.saved += amount;

  
  renderGoals();
  document.getElementById('savings-amount').value = '';
  document.getElementById('goal-select').value = '';
}


function deleteGoal(id) {
  savingsGoals = savingsGoals.filter(function(goal) {
    return goal.id !== id;
  });
  renderGoals();
}


// SET TODAY'S DATE in the topbar

document.getElementById('topbar-date').textContent =
  new Date().toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

