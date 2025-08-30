// src/components/TeacherDashboard.js

import React from 'react';
import { User, Calendar, ShoppingCart, BarChart3, Settings, CheckCircle, Clock, CreditCard, Menu } from 'lucide-react';
import StudentManagement from './StudentManagement';
import MenuEditor from './MenuEditor';
import { doc, updateDoc } from "firebase/firestore"; // 导入 updateDoc
import { db } from '../firebase'; // 导入 db

export default function TeacherDashboard(props) {
  const {
    setCurrentUser, students, showStudentManagement, setShowStudentManagement,
    showMenuEditor, setShowMenuEditor, activeMenu, orderingEnabled,
    getCurrentMenu, customMenus, setCustomMenus, editingMenu, setEditingMenu,
    // ...其他所有学生管理 props...
    selectedStudents, batchDeleteStudents, setShowBatchAdd, showBatchAdd,
    batchStudentText, setBatchStudentText, batchAddStudents, newStudent,
    setNewStudent, showStudentPassword, setShowStudentPassword, addStudent,
    selectAllStudents, toggleStudentSelection, editingStudent, setEditingStudent,
    updateStudent, resetStudentPassword, deleteStudent, updatePaymentStatus
  } = props;

  // 【核心修改】这两个函数现在会更新 Firebase
  const handleMenuChange = async (menuType) => {
    try {
      const settingsDocRef = doc(db, "settings", "system");
      await updateDoc(settingsDocRef, {
        activeMenu: menuType,
        orderingEnabled: false // 切换菜单时，总是默认关闭订餐
      });
    } catch (error) {
      console.error("更新激活菜单失败: ", error);
    }
  };

  const toggleOrdering = async () => {
    if (!activeMenu) {
      alert('请先选择菜单');
      return;
    }
    try {
      const settingsDocRef = doc(db, "settings", "system");
      await updateDoc(settingsDocRef, {
        orderingEnabled: !orderingEnabled
      });
    } catch (error) {
      console.error("更新订餐状态失败: ", error);
    }
  };

  // --- 统计数据计算 (保持原样) ---
  const currentMenu = getCurrentMenu();
  const totalStudents = students.length;
  const totalOrders = students.reduce((acc, student) => acc + Object.values(student.orders || {}).filter(Boolean).length, 0);
  const paidStudents = students.filter(student => student.isPaid).length;
  const unpaidStudents = totalStudents - paidStudents;
  const totalRevenue = students.reduce((total, student) => {
      const studentTotal = currentMenu.reduce((sum, menuItem) => {
          return sum + ((student.orders && student.orders[menuItem.day]) ? menuItem.price : 0);
      }, 0);
      return total + studentTotal;
  }, 0);
  const paidRevenue = students.reduce((total, student) => {
      if (student.isPaid) {
          const studentTotal = currentMenu.reduce((sum, menuItem) => {
              return sum + ((student.orders && student.orders[menuItem.day]) ? menuItem.price : 0);
          }, 0);
          return total + studentTotal;
      }
      return total;
  }, 0);
  const unpaidRevenue = totalRevenue - paidRevenue;

  // --- 视图渲染逻辑 ---
  if (showStudentManagement) {
    return (
      <StudentManagement
        students={students}
        setShowStudentManagement={setShowStudentManagement}
        // ...传递所有学生管理需要的 props...
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
      />
    );
  }
  
  if (showMenuEditor) {
    return (
      <MenuEditor
        customMenus={customMenus}
        setCustomMenus={setCustomMenus}
        editingMenu={editingMenu}
        setEditingMenu={setEditingMenu}
        setShowMenuEditor={setShowMenuEditor}
      />
    );
  }

  // 默认显示主仪表盘
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg"> <Settings className="w-6 h-6 text-indigo-600" /> </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">5A班订餐管理系统</h1>
                <p className="text-sm text-gray-600">老师控制台</p>
              </div>
            </div>
            <button onClick={() => setCurrentUser(null)} className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md">
              退出登录
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Menu className="w-5 h-5 mr-2 text-indigo-600" />
              菜单管理
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              {Object.keys(customMenus).map(menuKey => (
                <button key={menuKey} onClick={() => handleMenuChange(menuKey)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeMenu === menuKey ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {menuKey.replace('_', ' ')}
                </button>
              ))}
              <div className="flex-1"></div>
              <button onClick={() => setShowMenuEditor(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                编辑菜单
              </button>
              <button onClick={toggleOrdering} disabled={!activeMenu} className={`px-4 py-2 rounded-lg font-medium transition-colors ${orderingEnabled ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'} disabled:bg-gray-400 disabled:cursor-not-allowed`}>
                {orderingEnabled ? '关闭订餐' : '开启订餐'}
              </button>
              <button onClick={() => setShowStudentManagement(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                学生管理
              </button>
            </div>
            {activeMenu && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  当前选择：{activeMenu.replace('_', ' ')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentMenu.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <h4 className="font-medium text-gray-800">{item.dayName}</h4>
                      <p className="text-sm text-gray-600">{item.meal}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                      <p className="text-sm font-semibold text-indigo-600">RM {item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* ... 统计卡片和订单详情表格的 JSX 保持原样 ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg"> <User className="w-6 h-6 text-blue-600" /> </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">总学生数</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg"> <ShoppingCart className="w-6 h-6 text-green-600" /> </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">本周总订单</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg"> <CreditCard className="w-6 h-6 text-green-600" /> </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">已付款学生</p>
                  <p className="text-2xl font-bold text-green-600">{paidStudents}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg"> <Clock className="w-6 h-6 text-orange-600" /> </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">未付款学生</p>
                  <p className="text-2xl font-bold text-orange-600">{unpaidStudents}</p>
                </div>
              </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg"> <BarChart3 className="w-6 h-6 text-purple-600" /> </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">订单总额</p>
                  <p className="text-2xl font-bold text-gray-900">RM {totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg"> <CheckCircle className="w-6 h-6 text-green-600" /> </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">已收金额</p>
                  <p className="text-2xl font-bold text-green-600">RM {paidRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg"> <Clock className="w-6 h-6 text-orange-600" /> </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">待收金额</p>
                  <p className="text-2xl font-bold text-orange-600">RM {unpaidRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-600" />
              学生订单详情
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学生姓名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单数量</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">应付金额</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">付款状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const orderCount = Object.values(student.orders || {}).filter(Boolean).length;
                    const studentTotal = currentMenu.reduce((sum, menuItem) => {
                      return sum + ((student.orders && student.orders[menuItem.day]) ? menuItem.price : 0);
                    }, 0);
                    const isPaid = student.isPaid || false;
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{orderCount} 份</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">RM {studentTotal.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isPaid ? '已付款' : '未付款'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => updatePaymentStatus(student.id)} className={`${isPaid ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}>
                            {isPaid ? '标记未付' : '标记已付'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}