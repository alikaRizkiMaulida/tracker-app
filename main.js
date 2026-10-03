/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []
let transactions = [];

// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()
function generateId() {
  return +new Date() + Math.round(Math.random() * 1000);
}

const STORAGE_KEY = 'expense-tracker-transactions';

function formatRupiah(value) {
  return value.toLocaleString('id-ID');
}

/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM
const incomeList = document.getElementById('incomeList');
const expenseList = document.getElementById('expenseList');
const transactionForm = document.getElementById('transactionForm');
const titleInput = document.getElementById('transactionFormTitleInput');
const amountInput = document.getElementById('transactionFormAmountInput');
const dateInput = document.getElementById('transactionFormDateInput');
const typeSelect = document.getElementById('transactionFormTypeSelect');
const submitButton = document.querySelector('[data-testid="transactionFormSubmitButton"]');
const searchInput = document.getElementById('searchTransactionFormTitleInput');
const searchTransactionForm = document.getElementById('searchTransactionForm');
const headerDateLabel = document.querySelector('.tracker-header__date');

function updateHeaderDate() {
  const now = new Date();
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  headerDateLabel.textContent = monthNames[now.getMonth()] + ' ' + now.getFullYear();
}

updateHeaderDate();

const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.appendChild(toastContainer);

const TOAST_ICONS = {
  success: '✓',
  edit: '✎',
  delete: '🗑',
};

function showToast(message, type = 'success', duration = 3000) {
  const toast = document.createElement('div');
  toast.classList.add('toast', 'toast--' + type);

  const icon = document.createElement('span');
  icon.classList.add('toast__icon');
  icon.textContent = TOAST_ICONS[type] || '✓';

  const text = document.createElement('span');
  text.classList.add('toast__message');
  text.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('toast__close');
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', () => {
    toast.classList.add('toast--hide');
    setTimeout(() => toast.remove(), 300);
  });

  toast.appendChild(icon);
  toast.appendChild(text);
  toast.appendChild(closeBtn);
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast--show');
  });

  setTimeout(() => {
    toast.classList.add('toast--hide');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
 */
function createTransactionCard(transaction) {
  const card = document.createElement('div');
  card.setAttribute('data-testid', 'transactionItem');
  card.classList.add('tracker-transaction-item');

  const icon = document.createElement('div');
  icon.classList.add('tracker-transaction-item__icon');
  if (transaction.type === 'income') {
    icon.classList.add('tracker-transaction-item__icon--income');
    icon.textContent = '↑';
  } else {
    icon.classList.add('tracker-transaction-item__icon--expense');
    icon.textContent = '↓';
  }

  const detail = document.createElement('div');
  detail.classList.add('tracker-transaction-item__detail');

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'transactionItemTitle');
  title.classList.add('tracker-transaction-item__title');
  title.textContent = transaction.title;

  const date = document.createElement('p');
  date.setAttribute('data-testid', 'transactionItemDate');
  date.classList.add('tracker-transaction-item__date');
  date.textContent = 'Tanggal: ' + transaction.date;

  detail.appendChild(title);
  detail.appendChild(date);

  const right = document.createElement('div');
  right.classList.add('tracker-transaction-item__right');

  const amount = document.createElement('p');
  amount.setAttribute('data-testid', 'transactionItemAmount');
  amount.classList.add('tracker-transaction-item__amount');
  if (transaction.type === 'income') {
    amount.classList.add('tracker-transaction-item__amount--income');
  } else {
    amount.classList.add('tracker-transaction-item__amount--expense');
  }
  amount.textContent = 'Nominal: Rp' + formatRupiah(transaction.amount);

  const type = document.createElement('p');
  type.setAttribute('data-testid', 'transactionItemType');
  type.textContent = 'Tipe: ' + (transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran');

  const actions = document.createElement('div');
  actions.classList.add('tracker-transaction-item__actions');

  const editTypeBtn = document.createElement('button');
  editTypeBtn.setAttribute('data-testid', 'transactionItemEditTypeButton');
  editTypeBtn.classList.add('tracker-transaction-item__btn');
  editTypeBtn.textContent = 'Ubah Tipe';
  editTypeBtn.addEventListener('click', () => {
    transaction.type = transaction.type === 'income' ? 'expense' : 'income';
    saveTransactions();
    document.dispatchEvent(new Event('transaction:updated'));
  });

  const editBtn = document.createElement('button');
  editBtn.setAttribute('data-testid', 'transactionItemEditButton');
  editBtn.classList.add('tracker-transaction-item__btn');
  editBtn.textContent = '✎';
  editBtn.addEventListener('click', () => {
    fillFormForEdit(transaction.id);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('data-testid', 'transactionItemDeleteButton');
  deleteBtn.classList.add('tracker-transaction-item__btn');
  deleteBtn.textContent = '🗑';
  deleteBtn.addEventListener('click', () => {
    const isConfirmed = confirm('Hapus transaksi "' + transaction.title + '" sebesar Rp' + formatRupiah(transaction.amount) + '?');
    if (!isConfirmed) return;
    transactions = transactions.filter((item) => item.id !== transaction.id);
    saveTransactions();
    document.dispatchEvent(new Event('transaction:updated'));
    showToast('Transaksi berhasil dihapus!', 'delete');
  });

  actions.appendChild(editTypeBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  right.appendChild(amount);
  right.appendChild(type);
  right.appendChild(actions);

  card.appendChild(icon);
  card.appendChild(detail);
  card.appendChild(right);

  return card;
}

function renderTransactions() {
  incomeList.innerHTML = '';
  expenseList.innerHTML = '';

  const keyword = searchInput.value.trim().toLowerCase();
  const displayedTransactions = keyword
    ? transactions.filter((transaction) =>
      transaction.title.toLowerCase().includes(keyword)
    )
    : transactions;

  for (const transaction of displayedTransactions) {
    const card = createTransactionCard(transaction);
    if (transaction.type === 'income') {
      incomeList.appendChild(card);
    } else {
      expenseList.appendChild(card);
    }
  }
}

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya
transactionForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const date = dateInput.value;
  const type = typeSelect.value;

  /**
   * TODO [Skilled]:
   * Tambahkan validasi input sebelum menyimpan data:
   *  - Tampilkan alert() dan hentikan proses jika judul kosong
   *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
   */
  if (title === '') {
    alert('Judul transaksi tidak boleh kosong!');
    return;
  }
  if (amount < 1) {
    alert('Nominal harus lebih dari 0!');
    return;
  }

  if (editingId !== null) {
    const index = transactions.findIndex((item) => item.id === editingId);
    if (index !== -1) {
      transactions[index] = { id: editingId, title: title, amount: amount, date: date, type: type };
    }
    resetForm();
    showToast('Transaksi berhasil diperbarui!', 'edit');
  } else {
    const newTransaction = {
      id: generateId(),
      title: title,
      amount: amount,
      date: date,
      type: type,
    };
    transactions.push(newTransaction);
    transactionForm.reset();
    showToast('Transaksi berhasil ditambahkan!', 'success');
  }

  saveTransactions();
  document.dispatchEvent(new Event('transaction:updated'));
});

/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
 */
function updateDashboard() {
  const balanceAmount = document.querySelector('.tracker-summary__balance-amount');
  const incomeAmount = document.querySelector('.tracker-summary__stat-amount--income');
  const expenseAmount = document.querySelector('.tracker-summary__stat-amount--expense');

  let totalIncome = 0;
  let totalExpense = 0;

  for (const transaction of transactions) {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
  }

  const balance = totalIncome - totalExpense;

  balanceAmount.textContent = 'Rp ' + formatRupiah(balance);
  incomeAmount.textContent = 'Rp ' + formatRupiah(totalIncome);
  expenseAmount.textContent = 'Rp ' + formatRupiah(totalExpense);
}


/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */
function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function loadTransactions() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */
let editingId = null;

function resetForm() {
  editingId = null;
  transactionForm.reset();
  submitButton.textContent = 'Simpan';
}

function fillFormForEdit(id) {
  const transaction = transactions.find((item) => item.id === id);
  if (!transaction) return;
  editingId = id;
  titleInput.value = transaction.title;
  amountInput.value = transaction.amount;
  dateInput.value = transaction.date;
  typeSelect.value = transaction.type;
  submitButton.textContent = 'Update';
  transactionForm.scrollIntoView({ behavior: 'smooth' });
}

/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */
document.addEventListener('transaction:updated', () => {
  renderTransactions();
  updateDashboard();
});

transactions = loadTransactions();
document.dispatchEvent(new Event('transaction:updated'));


/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */
// Tombol "Ubah Tipe" dibuat di dalam createTransactionCard() di atas

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */
searchInput.addEventListener('input', renderTransactions);

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */
searchTransactionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  renderTransactions();
});