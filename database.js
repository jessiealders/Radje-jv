import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, set, get, update, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAl0HB_VLDTHTnoC-ma8y3oZltqF2NoGv4",
  authDomain: "jv-radje.firebaseapp.com",
  projectId: "jv-radje",
  storageBucket: "jv-radje.firebasestorage.app",
  messagingSenderId: "26847665059",
  appId: "1:26847665059:web:81aac41b919607db1fd816", 
  databaseURL: "https://jv-radje-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
window.myApp = window.myApp || {};
const alleNamen = ["Total", "Jasper", "Jeppe", "Jessie", "Kevin", "Laura", "Lowijs", "Milan", "Nasi", "Senne", "Sharon", "Steen", "Toto", "Zoe"]

initializeDatabase(false);

function initializeDatabase(reset) {
  alleNamen.forEach(listenName);
  if (reset) {
    alleNamen.forEach(setName);
  }
}

function setName(name) {
  set(ref(db, '/' + name), {count : 0, afwas: 0, bak: 0});
}

function listenName(name) {
  const nameRef = ref(db, name + "/count");
  onValue(nameRef, (snapshot) => {
    const currentCount = snapshot.val();
    console.log(name + " current count:", currentCount);
  });

  const afwasRef = ref(db, name + "/afwas");
  onValue(afwasRef, (snapshot) => {
    const currentCount = snapshot.val();
    console.log(name + " current afwas count:", currentCount);
  });

  const bakRef = ref(db, name + "/bak");
  onValue(bakRef, (snapshot) => {
    const currentCount = snapshot.val();
    console.log(name + " current bak count:", currentCount);
  });
}

window.myApp.increment = function(name, field) {
  const nameRef = ref(db, name + "/" + field);
  get(nameRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        update(ref(db, name), { [field]: snapshot.val() + 1 });
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error getting data:", error);
    });
}