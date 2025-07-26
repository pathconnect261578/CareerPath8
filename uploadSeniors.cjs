const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, getDocs, deleteDoc } = require('firebase/firestore');
const seniors = require('./seniors.json'); // Your JSON array

const firebaseConfig = {
  apiKey: "AIzaSyAEkGjL42tX9dareCmmmZbO_J-QjtggDhw",
  authDomain: "pathconnect-435e9.firebaseapp.com",
  projectId: "pathconnect-435e9",
  storageBucket: "pathconnect-435e9.firebasestorage.app",
  messagingSenderId: "686805370083",
  appId: "1:686805370083:web:7df76bcaecccbb3dfcb1d6",
  measurementId: "G-D2LE734CWM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function clearCollection() {
  const colRef = collection(db, 'seniors');
  const snapshot = await getDocs(colRef);
  for (const docSnap of snapshot.docs) {
    await deleteDoc(doc(db, 'seniors', docSnap.id));
    console.log(`Deleted: ${docSnap.id}`);
  }
  console.log('All previous seniors deleted!');
}

async function upload() {
  await clearCollection();
  for (const senior of seniors) {
    const id = slugify(senior.name);
    await setDoc(doc(db, 'seniors', id), senior);
    console.log(`Uploaded: ${senior.name}`);
  }
  console.log('All seniors uploaded!');
  console.log('Names uploaded:');
  seniors.forEach(s => console.log(s.name));
}

upload(); 