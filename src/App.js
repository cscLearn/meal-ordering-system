// src/App.js

import React, { useState, useEffect } from 'react';
import { db } from './firebase';
// 【重要】从 firestore 导入 onSnapshot
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";

import LoginScreen from './components/LoginScreen';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

const TEACHER_PASSWORD = 'teacher123';

export default function App() {
  // --- 所有 State Hooks 保持不变 ---
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

  // ===================================================================
  // 【核心修改】使用 onSnapshot 进行实时数据监听
  // ===================================================================
  useEffect(() => {
    // 监听 students 集合
    const studentsCollectionRef = collection(db, "students");
    const unsubscribeStudents = onSnapshot(studentsCollectionRef, (querySnapshot) => {
      const studentList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setStudents(studentList);
      console.log("实时学生数据已更新:", studentList);
    }, (error) => {
      console.error("监听学生数据失败:", error);
    });

    // 监听 menus 集合
    const menusCollectionRef = collection(db, "menus");
    const unsubscribeMenus = onSnapshot(menusCollectionRef, (querySnapshot) => {
      const menuData = {};
      querySnapshot.forEach(doc => {
        menuData[doc.id] = doc.data().items;
      });
      setCustomMenus(menuData);
      console.log("实时菜单数据已更新:", menuData);
    }, (error) => {
      console.error("监听菜单数据失败:", error);
    });

    // 清理函数：当组件卸载时，取消监听，防止内存泄漏
    return () => {
      unsubscribeStudents();
      unsubscribeMenus();
    };
  }, []); // 空依赖数组确保监听器只在组件挂载时设置一次

  // --- 辅助与数据操作函数 (所有函数保持原样) ---
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
      await addDoc(collection(db, "students"), studentData);
      // setStudents 不再需要，onSnapshot 会自动更新
      setNewStudent({ name: '', password: '123456' });
    } catch (error) { console.error("添加新学生失败: ", error); }
  };

  const updateStudent = async (studentId, updatedData) => {
    try {
      await updateDoc(doc(db, "students", studentId), updatedData);
      // setStudents 不再需要，onSnapshot 会自动更新
      setEditingStudent(null);
    } catch (error) { console.error("更新学生信息失败: ", error); }
  };

  const deleteStudent = async (studentId) => {
    if (window.confirm('确定要永久删除这个学生吗？')) {
      try {
        await deleteDoc(doc(db, "students", studentId));
        // setStudents 不再需要，onSnapshot 会自动更新
      } catch (error) { console.error("删除学生失败: ", error); }
    }
  };

  const resetStudentPassword = async (studentId) => {
    if (window.confirm('确定要重置密码为 "123456" 吗？')) {
      await updateStudent(studentId, { password: '123456' });
      alert('密码已成功重置');
    }
  };

  const batchAddStudents = async () => {
    const lines = batchStudentText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return;
    try {
      // 批量添加依然需要手动处理，因为 onSnapshot 不会一次性返回所有新 ID
      const addPromises = lines.map(line => {
        const name = line.trim();
        if(name) {
          const studentData = { name, password: '123456', orders: {}, isPaid: false };
          return addDoc(collection(db, "students"), studentData);
        }
        return null;
      }).filter(Boolean);
      
      await Promise.all(addPromises);
      
      setBatchStudentText('');
      setShowBatchAdd(false);
      alert(`成功添加 ${lines.length} 名学生`);
    } catch (error) { console.error("批量添加学生失败: ", error); }
  };

  const batchDeleteStudents = async () => {
    if (selectedStudents.size === 0) return;
    if (window.confirm(`确定要删除选中的 ${selectedStudents.size} 名学生吗？`)) {
      try {
        const deletePromises = Array.from(selectedStudents).map(id => deleteDoc(doc(db, "students", id)));
        await Promise.all(deletePromises);
        // setStudents 和 setSelectedStudents 不再需要，onSnapshot 会自动更新
        setSelectedStudents(new Set());
      } catch (error) { console.error("批量删除失败: ", error); }
    }
  };

  const toggleStudentSelection = (studentId) => {
    const newSelected = new Set(selectedStudents);
    newSelected.has(studentId) ? newSelected.delete(studentId) : newSelected.add(studentId);
    setSelectedStudents(newSelected);
  };

  const selectAllStudents = () => {
    setSelectedStudents(selectedStudents.size === students.length ? new Set() : new Set(students.map(s => s.id)));
  };

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
  
  // --- 主渲染逻辑 (保持原样) ---
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