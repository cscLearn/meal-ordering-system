// src/App.js

import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";

import LoginScreen from './components/LoginScreen';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

const TEACHER_PASSWORD = 'teacher123';

export default function App() {
  // --- 所有 State Hooks 集中声明 ---
  const [students, setStudents] = useState([]);
  const [customMenus, setCustomMenus] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState('student');
  
  const [selectedPassword, setSelectedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [activeMenu, setActiveMenu] = useState(null);
  const [orderingEnabled, setOrderingEnabled] = useState(false);
  
  const [showStudentManagement, setShowStudentManagement] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: '', password: '123456' });
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  
  const [batchStudentText, setBatchStudentText] = useState('');
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [showBatchAdd, setShowBatchAdd] = useState(false);
  
  const [showMenuEditor, setShowMenuEditor] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  // --- 从 Firebase 加载所有初始数据 ---
  useEffect(() => {
    const fetchData = async () => {
      // 1. 获取学生数据
      try {
        const studentsSnapshot = await getDocs(collection(db, "students"));
        const studentList = studentsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setStudents(studentList);
      } catch (error) {
        console.error("从 Firebase 获取学生数据失败:", error);
      }

      // 2. 获取菜单数据
      try {
        const menusSnapshot = await getDocs(collection(db, "menus"));
        const menuData = {};
        menusSnapshot.forEach(doc => {
          menuData[doc.id] = doc.data().items;
        });
        setCustomMenus(menuData);
      } catch (error) {
        console.error("从 Firebase 获取菜单数据失败:", error);
      }
    };
    fetchData();
  }, []);

  // --- 辅助与数据操作函数 ---
  const getCurrentMenu = () => activeMenu ? customMenus[activeMenu] : [];

  const handleStudentLogin = () => {
    if (!selectedStudent) { setLoginError('请选择学生'); return; }
    const studentFromState = students.find(s => s.id === selectedStudent.id);
    if (selectedPassword !== studentFromState.password) { setLoginError('密码错误'); return; }
    if (!orderingEnabled) { setLoginError('老师尚未开启订餐功能'); return; }
    setCurrentUser(studentFromState);
    setLoginError('');
    setSelectedPassword('');
  };

  const handleTeacherLogin = () => {
    if (selectedPassword !== TEACHER_PASSWORD) { setLoginError('密码错误'); return; }
    setCurrentUser({ id: 'teacher', name: 'Teacher' });
    setLoginError('');
    setSelectedPassword('');
  };

  const addStudent = async () => {
    if (!newStudent.name.trim()) { alert('请输入学生姓名'); return; }
    try {
      const studentData = { name: newStudent.name.trim(), password: newStudent.password || '123456', orders: {}, isPaid: false };
      const newDocRef = await addDoc(collection(db, "students"), studentData);
      setStudents(prev => [...prev, { ...studentData, id: newDocRef.id }]);
      setNewStudent({ name: '', password: '123456' });
    } catch (error) { console.error("添加新学生失败: ", error); }
  };

  const updateStudent = async (studentId, updatedData) => {
    try {
      await updateDoc(doc(db, "students", studentId), updatedData);
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...updatedData } : s));
      setEditingStudent(null);
    } catch (error) { console.error("更新学生信息失败: ", error); }
  };

  const deleteStudent = async (studentId) => {
    if (window.confirm('确定要永久删除这个学生吗？')) {
      try {
        await deleteDoc(doc(db, "students", studentId));
        setStudents(prev => prev.filter(s => s.id !== studentId));
      } catch (error) { console.error("删除学生失败: ", error); }
    }
  };

  const resetStudentPassword = async (studentId) => {
    if (window.confirm('确定要重置密码为 "123456" 吗？')) {
      await updateStudent(studentId, { password: '123456' });
      alert('密码已成功重置');
    }
  };

  const batchAddStudents = async () => { /* ... 保持原样 ... */ };
  const batchDeleteStudents = async () => { /* ... 保持原样 ... */ };
  const toggleStudentSelection = (studentId) => { /* ... 保持原样 ... */ };
  const selectAllStudents = () => { /* ... 保持原样 ... */ };

  const toggleOrder = async (day) => {
    if (!currentUser) return;
    const currentStudent = students.find(s => s.id === currentUser.id);
    if(!currentStudent) return;
    const newOrders = { ...(currentStudent.orders || {}), [day]: !(currentStudent.orders && currentStudent.orders[day]) };
    await updateStudent(currentUser.id, { orders: newOrders });
  };
  
  const updatePaymentStatus = async (studentId) => {
    const studentToUpdate = students.find(s => s.id === studentId);
    if (!studentToUpdate) return;
    await updateStudent(studentId, { isPaid: !studentToUpdate.isPaid });
  };
  
  // createNewMenu 现在只在 MenuEditor 内部处理，这里不再需要
  // const createNewMenu = () => { ... };

  // --- 主渲染逻辑 ---
  if (!currentUser) {
    return (
      <LoginScreen
        userType={userType}
        setUserType={setUserType}
        students={students}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        selectedPassword={selectedPassword}
        setSelectedPassword={setSelectedPassword}
        handleStudentLogin={handleStudentLogin}
        handleTeacherLogin={handleTeacherLogin}
        loginError={loginError}
        setLoginError={setLoginError}
      />
    );
  }

  if (currentUser.id === 'teacher') {
    return (
      <TeacherDashboard
        setCurrentUser={setCurrentUser}
        students={students}
        showStudentManagement={showStudentManagement}
        setShowStudentManagement={setShowStudentManagement}
        showMenuEditor={showMenuEditor}
        setShowMenuEditor={setShowMenuEditor}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        orderingEnabled={orderingEnabled}
        setOrderingEnabled={setOrderingEnabled}
        getCurrentMenu={getCurrentMenu}
        customMenus={customMenus}
        setCustomMenus={setCustomMenus}
        editingMenu={editingMenu}
        setEditingMenu={setEditingMenu}
        // createNewMenu 函数现在由 MenuEditor 自己管理，不再从 App.js 传递
        selectedStudents={selectedStudents}
        batchDeleteStudents={batchDeleteStudents}
        setShowBatchAdd={setShowBatchAdd}
        showBatchAdd={showBatchAdd}
        batchStudentText={batchStudentText}
        setBatchStudentText={setBatchStudentText}
        batchAddStudents={batchAddStudents}
        newStudent={newStudent}
        setNewStudent={setNewStudent}
        showStudentPassword={showStudentPassword}
        setShowStudentPassword={setShowStudentPassword}
        addStudent={addStudent}
        selectAllStudents={selectAllStudents}
        toggleStudentSelection={toggleStudentSelection}
        editingStudent={editingStudent}
        setEditingStudent={setEditingStudent}
        updateStudent={updateStudent}
        resetStudentPassword={resetStudentPassword}
        deleteStudent={deleteStudent}
        updatePaymentStatus={updatePaymentStatus}
      />
    );
  }

  return (
    <StudentDashboard
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
      students={students}
      activeMenu={activeMenu}
      orderingEnabled={orderingEnabled}
      getCurrentMenu={getCurrentMenu}
      toggleOrder={toggleOrder}
    />
  );
}