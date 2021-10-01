let db;

//open a new databse titled "budget"
const request = indexedDB.open("budget", 1);

request.onupgradneeded = function (event) {
  //store reference to our db
  const db = event.target.result;
  //create object store titled "pending_transaction". set autoincrement to true
  db.createObjectStore("pending_transaction", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.taget.result;
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
