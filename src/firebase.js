// src/firebase.js

// 1. 我们只需要从 "firebase/app" 导入 initializeApp
import { initializeApp } from "firebase/app";
// 2. 我们需要导入 getFirestore 来连接数据库
import { getFirestore } from "firebase/firestore";

// 3. 你的配置信息，这部分是完全正确的，不需要动
const firebaseConfig = {
  apiKey: "AIzaSyD5UJdAENGt-d7zkH17LJZYzH06k3migbE",
  authDomain: "meal-ordering-system-1cfa5.firebaseapp.com",
  projectId: "meal-ordering-system-1cfa5",
  storageBucket: "meal-ordering-system-1cfa5.appspot.com", // 注意：这里我帮你修正了一个小拼写错误 .firebasestorage. -> .appspot.
  messagingSenderId: "877639754408",
  appId: "1:877639754408:web:f3a648dcdad7e66ed3d89d",
  measurementId: "G-1BCH4HDWX4"
};

// 4. 初始化 Firebase 应用
const app = initializeApp(firebaseConfig);

// 5. 初始化 Firestore 数据库并导出，这是最关键的一步
export const db = getFirestore(app);

// 6. 我们暂时不需要 Analytics，所以可以删除相关代码
// const analytics = getAnalytics(app); // <-- 这行我们不需要