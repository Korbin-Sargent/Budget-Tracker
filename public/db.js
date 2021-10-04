// const indexedDB =
//   window.indexedDB ||
//   window.mozIndexedDB ||
//   window.webkitIndexedDB ||
//   window.msIndexedDB ||
//   window.shimIndexedDB;

//variable "db" will hold a reference to our database connection
let db;

//create a connection to IndexedDB databse titled "budget"
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  //store reference to our db
  const db = event.target.result;
  //create object store titled "pending_transaction". set autoincrement to true
  db.createObjectStore(["pending_transaction"], { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
  //varify app is online prior to interacting with db
  if (navigator.onLine) {
    checkDatabase();
  }
};

//console log error message if error
request.onerror = function (event) {
  console.log(
    "Oh great... something isn't working right!" + event.target.errorCode
  );
};

//If no internet connection, this f() runs to when submitting a new transaction
function saveRecord(record) {
  //start a new transaction with the database with read and write permissions
  const transaction = db.transaction(["pending_transaction"], "readwrite");
  //access the obj store
  const budgetObjStore = transaction.objectStore("pending_transaction");
  //adds record to store
  budgetObjStore.add(record);
}

function checkDatabase() {
  //open a transaction on the pending_transaction db
  const transaction = db.transaction(["pending_transaction"], "readwrite");
  //access your object store
  const budgetObjStore = transaction.objectStore("pending_transaction");
  //create a reference to all store transactions
  const getAll = budgetObjStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          const transaction = db.transaction(
            ["pending_transaction"],
            "readwrite"
          );
          //access "pending_transaction" object store
          const budgetObjStore = transaction.objectStore("pending_transaction");
          //clear all items in the store
          budgetObjStore.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}
function deletePending() {
  const transaction = db.transaction(["pending_transaction"], "readwrite");
  const store = transaction.objectStore("pending_transaction");
  store.clear();
}
//Listen for when the application comes online, call checkDatabase
window.addEventListener("online", checkDatabase);
