// src/components/StudentDashboard.js

import React from 'react';
import { User, Calendar, ShoppingCart, CreditCard, Lock, CheckCircle } from 'lucide-react';

export default function StudentDashboard(props) {
  const {
    currentUser,
    setCurrentUser,
    students,
    activeMenu,
    orderingEnabled,
    getCurrentMenu,
    toggleOrder
  } = props;

  // 从 students 数组中实时查找当前学生的信息
  const currentStudent = students.find(s => s.id === currentUser.id) || {};
  const studentOrders = currentStudent.orders || {};
  const isPaid = currentStudent.isPaid || false;
  const currentMenu = getCurrentMenu();

  const totalOrders = Object.values(studentOrders).filter(Boolean).length;
  const totalCost = currentMenu.reduce((sum, menuItem) => {
    return sum + (studentOrders[menuItem.day] ? menuItem.price : 0);
  }, 0);

  if (!orderingEnabled || currentMenu.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">订餐暂未开放</h2>
          <p className="text-gray-600 mb-4">老师尚未设置本周菜单或开启订餐功能</p>
          <button onClick={() => setCurrentUser(null)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            返回登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">{currentUser.name}</h1>
                <p className="text-sm text-gray-600">学生端 - {activeMenu === 'menu_A' ? '菜单A' : '菜单B'}</p>
              </div>
            </div>
            <button onClick={() => setCurrentUser(null)} className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md">
              退出登录
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">本周订单</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders} 份</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">需付金额</p>
                <p className="text-2xl font-bold text-gray-900">RM {totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${isPaid ? 'bg-green-100' : 'bg-orange-100'}`}>
                <CreditCard className={`w-6 h-6 ${isPaid ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">付款状态</p>
                <p className={`text-lg font-bold ${isPaid ? 'text-green-600' : 'text-orange-600'}`}>{isPaid ? '已付款' : '未付款'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
              本周菜单 ({activeMenu === 'menu_A' ? '菜单A' : '菜单B'})
            </h2>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {currentMenu.map((menu) => {
                const isOrdered = studentOrders[menu.day];
                return (
                  <div key={menu.day} className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${isOrdered ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-indigo-300'}`} onClick={() => toggleOrder(menu.day)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isOrdered ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                            {isOrdered && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{menu.dayName} - {menu.meal}</h3>
                            <p className="text-sm text-gray-600">{menu.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">RM {menu.price.toFixed(2)}</p>
                        <p className={`text-sm ${isOrdered ? 'text-green-600' : 'text-gray-500'}`}>{isOrdered ? '已订购' : '点击订购'}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}