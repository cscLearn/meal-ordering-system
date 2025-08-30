import React, { useState, useEffect } from 'react';
import { User, Calendar, ShoppingCart, BarChart3, Settings, CheckCircle, Clock, CreditCard, Menu, Eye, EyeOff, Lock } from 'lucide-react';

// 学生数据和密码
const initialStudents = [
  { id: 1, name: 'CHONG ZI JUN', password: '123456' },
  { id: 2, name: 'EONG WEN XIN', password: '123456' },
  { id: 3, name: 'GAVIN HOW GUAN CHEN', password: '123456' },
  { id: 4, name: 'JOYANN SU CIAO XUN', password: '123456' },
  { id: 5, name: 'LEE HENG', password: '123456' },
  { id: 6, name: 'LEE HONG THAI', password: '123456' },
  { id: 7, name: 'LEE JUN FONG', password: '123456' },
  { id: 8, name: 'LIM WEN WEN', password: '123456' },
  { id: 9, name: 'NG REN QIAN', password: '123456' }
];

// 老师密码
const TEACHER_PASSWORD = 'teacher123';

// 菜单选项
const menuOptions = {
  menu_A: [
    { day: 'monday', dayName: '周一', meal: '椰浆饭+鸡蛋', description: 'Nasi Lemak + Telur', price: 3.00 },
    { day: 'tuesday', dayName: '周二', meal: '星洲米粉', description: 'Bihun Singapore', price: 3.00 },
    { day: 'wednesday', dayName: '周三', meal: '鸡饭', description: 'Nasi Ayam', price: 3.00 },
    { day: 'thursday', dayName: '周四', meal: '鸡蛋汉堡', description: 'Bun Telur', price: 3.00 },
    { day: 'friday', dayName: '周五', meal: '酱油炒饭', description: 'Nasi Goreng Kicap', price: 3.00 }
  ],
  menu_B: [
    { day: 'monday', dayName: '周一', meal: '咖喱鸡饭', description: 'Nasi Kari Ayam', price: 3.50 },
    { day: 'tuesday', dayName: '周二', meal: '云吞面', description: 'Wanton Mee', price: 3.50 },
    { day: 'wednesday', dayName: '周三', meal: '叻沙', description: 'Laksa', price: 4.00 },
    { day: 'thursday', dayName: '周四', meal: '炒粿条', description: 'Char Kuey Teow', price: 3.50 },
    { day: 'friday', dayName: '周五', meal: '海南鸡饭', description: 'Hainanese Chicken Rice', price: 4.00 }
  ]
};

export default function MealOrderingSystem() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState('student');
  const [orders, setOrders] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});
  const [students, setStudents] = useState(initialStudents);
  const [selectedPassword, setSelectedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // 菜单管理状态
  const [activeMenu, setActiveMenu] = useState(null);
  const [orderingEnabled, setOrderingEnabled] = useState(false);
  
  // 学生管理状态
  const [showStudentManagement, setShowStudentManagement] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: '', password: '123456' });
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  
  // 批量学生管理状态
  const [batchStudentText, setBatchStudentText] = useState('');
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [showBatchAdd, setShowBatchAdd] = useState(false);
  
  // 菜单编辑状态
  const [showMenuEditor, setShowMenuEditor] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [customMenus, setCustomMenus] = useState(menuOptions);

  // 获取当前活跃菜单
  const getCurrentMenu = () => {
    return activeMenu ? customMenus[activeMenu] : [];
  };

  // 初始化订单和付款状态数据
  useEffect(() => {
    const initialOrders = {};
    const initialPayments = {};
    
    students.forEach(student => {
      initialOrders[student.id] = {};
      initialPayments[student.id] = false;
      
      // 为所有可能的菜单项初始化
      Object.values(menuOptions).forEach(menu => {
        menu.forEach(menuItem => {
          if (!initialOrders[student.id][menuItem.day]) {
            initialOrders[student.id][menuItem.day] = false;
          }
        });
      });
    });
    
    setOrders(initialOrders);
    setPaymentStatus(initialPayments);
  }, [students]);

  // 重置订单当菜单改变时
  const resetOrdersForNewMenu = () => {
    const resetOrders = {};
    students.forEach(student => {
      resetOrders[student.id] = {};
      getCurrentMenu().forEach(menu => {
        resetOrders[student.id][menu.day] = false;
      });
    });
    setOrders(resetOrders);
    
    // 重置付款状态
    const resetPayments = {};
    students.forEach(student => {
      resetPayments[student.id] = false;
    });
    setPaymentStatus(resetPayments);
  };

  // 处理学生登录
  const handleStudentLogin = () => {
    if (!selectedStudent) {
      setLoginError('请选择学生');
      return;
    }
    
    if (selectedPassword !== selectedStudent.password) {
      setLoginError('密码错误');
      return;
    }

    if (!orderingEnabled) {
      setLoginError('老师尚未开启订餐功能');
      return;
    }
    
    setCurrentUser(selectedStudent);
    setLoginError('');
    setSelectedPassword('');
  };

  // 处理老师登录
  const handleTeacherLogin = () => {
    if (selectedPassword !== TEACHER_PASSWORD) {
      setLoginError('密码错误');
      return;
    }
    
    setCurrentUser({ id: 'teacher', name: 'Teacher' });
    setLoginError('');
    setSelectedPassword('');
  };

  // 学生管理功能
  const addStudent = () => {
    if (!newStudent.name.trim()) {
      alert('请输入学生姓名');
      return;
    }
    
    const newId = Math.max(...students.map(s => s.id), 0) + 1;
    const student = {
      id: newId,
      name: newStudent.name.trim(),
      password: newStudent.password || '123456'
    };
    
    setStudents(prev => [...prev, student]);
    setNewStudent({ name: '', password: '123456' });
  };

  const updateStudent = (studentId, updatedData) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, ...updatedData }
        : student
    ));
    setEditingStudent(null);
  };

  const deleteStudent = (studentId) => {
    if (window.confirm('确定要删除这个学生吗？删除后相关的订单数据也会被清除。')) {
      setStudents(prev => prev.filter(student => student.id !== studentId));
      // 清除相关订单和付款数据
      setOrders(prev => {
        const newOrders = { ...prev };
        delete newOrders[studentId];
        return newOrders;
      });
      setPaymentStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[studentId];
        return newStatus;
      });
    }
  };

  const resetStudentPassword = (studentId) => {
    if (window.confirm('确定要重置这个学生的密码为123456吗？')) {
      updateStudent(studentId, { password: '123456' });
      alert('密码已重置为123456');
    }
  };

  // 批量学生管理功能
  const batchAddStudents = () => {
    const lines = batchStudentText.split('\n').filter(line => line.trim());
    const newStudents = [];
    let startId = Math.max(...students.map(s => s.id), 0) + 1;
    
    lines.forEach((line, index) => {
      const name = line.trim();
      if (name) {
        newStudents.push({
          id: startId + index,
          name: name,
          password: '123456'
        });
      }
    });
    
    if (newStudents.length > 0) {
      setStudents(prev => [...prev, ...newStudents]);
      setBatchStudentText('');
      setShowBatchAdd(false);
      alert(`成功添加 ${newStudents.length} 名学生`);
    }
  };

  const batchDeleteStudents = () => {
    if (selectedStudents.size === 0) {
      alert('请先选择要删除的学生');
      return;
    }
    
    if (window.confirm(`确定要删除选中的 ${selectedStudents.size} 名学生吗？删除后相关的订单数据也会被清除。`)) {
      setStudents(prev => prev.filter(student => !selectedStudents.has(student.id)));
      
      // 清除相关订单和付款数据
      setOrders(prev => {
        const newOrders = { ...prev };
        selectedStudents.forEach(studentId => {
          delete newOrders[studentId];
        });
        return newOrders;
      });
      
      setPaymentStatus(prev => {
        const newStatus = { ...prev };
        selectedStudents.forEach(studentId => {
          delete newStatus[studentId];
        });
        return newStatus;
      });
      
      setSelectedStudents(new Set());
      alert(`成功删除 ${selectedStudents.size} 名学生`);
    }
  };

  const toggleStudentSelection = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const selectAllStudents = () => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map(s => s.id)));
    }
  };

  // 菜单编辑功能
  const saveMenu = (menuKey, menuData) => {
    setCustomMenus(prev => ({
      ...prev,
      [menuKey]: menuData
    }));
  };

  const addMenuItem = (menuKey) => {
    const newItem = {
      day: `custom_${Date.now()}`,
      dayName: '新项目',
      meal: '新菜品',
      description: 'New Item',
      price: 3.00
    };
    
    setCustomMenus(prev => ({
      ...prev,
      [menuKey]: [...(prev[menuKey] || []), newItem]
    }));
  };

  const removeMenuItem = (menuKey, itemIndex) => {
    setCustomMenus(prev => ({
      ...prev,
      [menuKey]: prev[menuKey].filter((_, index) => index !== itemIndex)
    }));
  };

  const updateMenuItem = (menuKey, itemIndex, updatedItem) => {
    setCustomMenus(prev => ({
      ...prev,
      [menuKey]: prev[menuKey].map((item, index) => 
        index === itemIndex ? updatedItem : item
      )
    }));
  };

  const createNewMenu = () => {
    const newMenuKey = `menu_${Object.keys(customMenus).length + 1}`;
    setCustomMenus(prev => ({
      ...prev,
      [newMenuKey]: [
        { day: 'monday', dayName: '周一', meal: '新菜品1', description: 'New Item 1', price: 3.00 },
        { day: 'tuesday', dayName: '周二', meal: '新菜品2', description: 'New Item 2', price: 3.00 },
        { day: 'wednesday', dayName: '周三', meal: '新菜品3', description: 'New Item 3', price: 3.00 },
        { day: 'thursday', dayName: '周四', meal: '新菜品4', description: 'New Item 4', price: 3.00 },
        { day: 'friday', dayName: '周五', meal: '新菜品5', description: 'New Item 5', price: 3.00 }
      ]
    }));
    return newMenuKey;
  };

  // 登录组件
  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">5A班订餐系统</h1>
          <p className="text-gray-600">选择您的身份登录</p>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-gray-200 rounded-lg p-1">
            <div className="flex bg-gray-100 rounded-md">
              <button
                onClick={() => {
                  setUserType('student');
                  setLoginError('');
                  setSelectedPassword('');
                  setSelectedStudent(null);
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  userType === 'student' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                学生端
              </button>
              <button
                onClick={() => {
                  setUserType('teacher');
                  setLoginError('');
                  setSelectedPassword('');
                  setSelectedStudent(null);
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  userType === 'teacher' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                老师端
              </button>
            </div>
          </div>

          {userType === 'student' ? (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">选择学生</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={selectedStudent?.id || ''}
                onChange={(e) => {
                  const student = students.find(s => s.id === parseInt(e.target.value));
                  setSelectedStudent(student);
                  setLoginError('');
                }}
              >
                <option value="">请选择学生</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
              
              {selectedStudent && (
                <>
                  <label className="block text-sm font-medium text-gray-700">输入密码</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={selectedPassword}
                      onChange={(e) => setSelectedPassword(e.target.value)}
                      className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="请输入密码"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <button
                    onClick={handleStudentLogin}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    学生登录
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">输入老师密码</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={selectedPassword}
                  onChange={(e) => setSelectedPassword(e.target.value)}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="请输入老师密码"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              <button
                onClick={handleTeacherLogin}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                老师登录
              </button>
            </div>
          )}

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{loginError}</p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>使用说明：</strong>学生需要输入密码登录，只有老师开启订餐功能后学生才能订餐
          </p>
          <div className="mt-2 text-xs text-gray-600">
            <p>默认学生密码：123456</p>
            <p>老师密码：teacher123</p>
          </div>
        </div>
      </div>
    </div>
  );

  // 学生界面
  const StudentDashboard = () => {
    const currentMenu = getCurrentMenu();
    
    const toggleOrder = (day) => {
      setOrders(prev => ({
        ...prev,
        [currentUser.id]: { 
          ...prev[currentUser.id], 
          [day]: !prev[currentUser.id][day] 
        }
      }));
    };

    const totalOrders = Object.values(orders[currentUser.id] || {}).filter(Boolean).length;
    const totalCost = currentMenu.reduce((sum, menuItem) => {
      return sum + (orders[currentUser.id]?.[menuItem.day] ? menuItem.price : 0);
    }, 0);
    const isPaid = paymentStatus[currentUser.id] || false;

    if (!orderingEnabled || currentMenu.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">订餐暂未开放</h2>
            <p className="text-gray-600 mb-4">老师尚未设置本周菜单或开启订餐功能</p>
            <button
              onClick={() => setCurrentUser(null)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              返回登录
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* 顶部栏 */}
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
              <button
                onClick={() => setCurrentUser(null)}
                className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* 统计卡片 */}
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
                  <p className={`text-lg font-bold ${isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                    {isPaid ? '已付款' : '未付款'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 本周菜单 */}
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
                  const isOrdered = orders[currentUser.id]?.[menu.day];
                  return (
                    <div
                      key={menu.day}
                      className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                        isOrdered 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      onClick={() => toggleOrder(menu.day)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isOrdered 
                                ? 'border-green-500 bg-green-500' 
                                : 'border-gray-300'
                            }`}>
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
                          <p className={`text-sm ${isOrdered ? 'text-green-600' : 'text-gray-500'}`}>
                            {isOrdered ? '已订购' : '点击订购'}
                          </p>
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
  };

  // 学生管理组件
  const StudentManagement = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-600" />
            学生管理
          </h2>
          <button
            onClick={() => setShowStudentManagement(false)}
            className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md"
          >
            返回
          </button>
        </div>
      </div>
      
      {/* 批量操作按钮 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">批量操作</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowBatchAdd(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              批量添加
            </button>
            <button
              onClick={batchDeleteStudents}
              disabled={selectedStudents.size === 0}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              批量删除 ({selectedStudents.size})
            </button>
          </div>
        </div>

        {/* 批量添加模态框 */}
        {showBatchAdd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">批量添加学生</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    学生姓名（每行一个）
                  </label>
                  <textarea
                    value={batchStudentText}
                    onChange={(e) => setBatchStudentText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="8"
                    placeholder="请输入学生姓名，每行一个：&#10;张三&#10;李四&#10;王五"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={batchAddStudents}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    确认添加
                  </button>
                  <button
                    onClick={() => {
                      setShowBatchAdd(false);
                      setBatchStudentText('');
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 添加新学生 */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">添加单个学生</h3>
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">学生姓名</label>
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="请输入学生姓名"
            />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">初始密码</label>
            <div className="relative">
              <input
                type={showStudentPassword ? "text" : "password"}
                value={newStudent.password}
                onChange={(e) => setNewStudent(prev => ({ ...prev, password: e.target.value }))}
                className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="默认123456"
              />
              <button
                type="button"
                onClick={() => setShowStudentPassword(!showStudentPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            onClick={addStudent}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            添加学生
          </button>
        </div>
      </div>

      {/* 学生列表 */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">学生列表 ({students.length}人)</h3>
          <button
            onClick={selectAllStudents}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            {selectedStudents.size === students.length ? '取消全选' : '全选'}
          </button>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedStudents.size === students.length && students.length > 0}
                    onChange={selectAllStudents}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">密码</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">付款状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const studentOrders = orders[student.id] || {};
                const orderCount = Object.values(studentOrders).filter(Boolean).length;
                const isPaid = paymentStatus[student.id] || false;
                
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStudents.has(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStudent === student.id ? (
                        <input
                          type="text"
                          defaultValue={student.name}
                          className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-1"
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              updateStudent(student.id, { name: e.target.value.trim() });
                            } else {
                              setEditingStudent(null);
                            }
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.target.blur();
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="text-sm text-gray-900 cursor-pointer hover:text-indigo-600"
                          onClick={() => setEditingStudent(student.id)}
                        >
                          {student.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-mono">{'*'.repeat(student.password.length)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        orderCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {orderCount} 份订单
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isPaid ? '已付款' : '未付款'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => resetStudentPassword(student.id)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        重置密码
                      </button>
                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
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
  );

  // 菜单编辑组件
  const MenuEditor = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Menu className="w-5 h-5 mr-2 text-indigo-600" />
            菜单编辑
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const newMenuKey = createNewMenu();
                setEditingMenu(newMenuKey);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              创建新菜单
            </button>
            <button
              onClick={() => setShowMenuEditor(false)}
              className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md"
            >
              返回
            </button>
          </div>
        </div>
      </div>
      
      {/* 菜单列表 */}
      <div className="p-6">
        <div className="grid gap-6">
          {Object.entries(customMenus).map(([menuKey, menuItems]) => (
            <div key={menuKey} className="border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  {menuKey === 'menu_A' ? '菜单A' : menuKey === 'menu_B' ? '菜单B' : `自定义菜单 (${menuKey})`}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingMenu(editingMenu === menuKey ? null : menuKey)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    {editingMenu === menuKey ? '完成编辑' : '编辑'}
                  </button>
                  {!['menu_A', 'menu_B'].includes(menuKey) && (
                    <button
                      onClick={() => {
                        if (window.confirm('确定要删除这个菜单吗？')) {
                          const newMenus = { ...customMenus };
                          delete newMenus[menuKey];
                          setCustomMenus(newMenus);
                          if (editingMenu === menuKey) setEditingMenu(null);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      删除菜单
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                {editingMenu === menuKey ? (
                  <div className="space-y-4">
                    {menuItems.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                            <input
                              type="text"
                              value={item.dayName}
                              onChange={(e) => {
                                const updatedItem = { ...item, dayName: e.target.value };
                                updateMenuItem(menuKey, index, updatedItem);
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">菜品名称</label>
                            <input
                              type="text"
                              value={item.meal}
                              onChange={(e) => {
                                const updatedItem = { ...item, meal: e.target.value };
                                updateMenuItem(menuKey, index, updatedItem);
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">英文描述</label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => {
                                const updatedItem = { ...item, description: e.target.value };
                                updateMenuItem(menuKey, index, updatedItem);
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">价格 (RM)</label>
                            <input
                              type="number"
                              step="0.50"
                              min="0"
                              value={item.price}
                              onChange={(e) => {
                                const updatedItem = { ...item, price: parseFloat(e.target.value) || 0 };
                                updateMenuItem(menuKey, index, updatedItem);
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeMenuItem(menuKey, index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          删除此项
                        </button>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => addMenuItem(menuKey)}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                    >
                      + 添加菜品
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {menuItems.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-medium text-gray-800">{item.dayName}</h4>
                        <p className="text-sm text-gray-600">{item.meal}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                        <p className="text-sm font-semibold text-indigo-600">RM {item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 老师界面
  const TeacherDashboard = () => {
    const currentMenu = getCurrentMenu();
    const totalStudents = students.length;
    
    const totalOrders = Object.values(orders).reduce((acc, studentOrders) => 
      acc + Object.values(studentOrders).filter(Boolean).length, 0
    );
    
    const totalRevenue = Object.values(orders).reduce((acc, studentOrders) => {
      return acc + currentMenu.reduce((sum, menuItem) => {
        return sum + (studentOrders[menuItem.day] ? menuItem.price : 0);
      }, 0);
    }, 0);

    const paidStudents = Object.values(paymentStatus).filter(Boolean).length;
    const unpaidStudents = totalStudents - paidStudents;

    const paidRevenue = students.reduce((acc, student) => {
      if (paymentStatus[student.id]) {
        return acc + currentMenu.reduce((sum, menuItem) => {
          return sum + (orders[student.id]?.[menuItem.day] ? menuItem.price : 0);
        }, 0);
      }
      return acc;
    }, 0);

    const unpaidRevenue = totalRevenue - paidRevenue;

    const togglePaymentStatus = (studentId) => {
      setPaymentStatus(prev => ({
        ...prev,
        [studentId]: !prev[studentId]
      }));
    };

    const handleMenuChange = (menuType) => {
      setActiveMenu(menuType);
      setOrderingEnabled(false);
      resetOrdersForNewMenu();
    };

    const toggleOrdering = () => {
      if (!activeMenu) {
        alert('请先选择菜单');
        return;
      }
      setOrderingEnabled(!orderingEnabled);
    };

    if (showStudentManagement) {
      return (
        <div className="min-h-screen bg-gray-50">
          {/* 顶部栏 */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Settings className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-800">5A班订餐管理系统</h1>
                    <p className="text-sm text-gray-600">老师控制台 - 学生管理</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-8">
            <StudentManagement />
          </div>
        </div>
      );
    }

    if (showMenuEditor) {
      return (
        <div className="min-h-screen bg-gray-50">
          {/* 顶部栏 */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Settings className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-800">5A班订餐管理系统</h1>
                    <p className="text-sm text-gray-600">老师控制台 - 菜单编辑</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md"
                >
                  退出登录
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-8">
            <MenuEditor />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* 顶部栏 */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Settings className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-800">5A班订餐管理系统</h1>
                  <p className="text-sm text-gray-600">老师控制台</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentUser(null)}
                className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 菜单管理 */}
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
                  <button
                    key={menuKey}
                    onClick={() => handleMenuChange(menuKey)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeMenu === menuKey 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {menuKey === 'menu_A' ? '菜单A' : menuKey === 'menu_B' ? '菜单B' : `菜单${menuKey.split('_')[1] || ''}`}
                  </button>
                ))}
                <div className="flex-1"></div>
                <button
                  onClick={() => setShowMenuEditor(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  编辑菜单
                </button>
                <button
                  onClick={toggleOrdering}
                  disabled={!activeMenu}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    orderingEnabled 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {orderingEnabled ? '关闭订餐' : '开启订餐'}
                </button>
                <button
                  onClick={() => setShowStudentManagement(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  学生管理
                </button>
              </div>
              
              {activeMenu && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    当前选择：{activeMenu === 'menu_A' ? '菜单A' : activeMenu === 'menu_B' ? '菜单B' : `菜单${activeMenu.split('_')[1] || ''}`}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentMenu.map((menu, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-medium text-gray-800">{menu.dayName}</h4>
                        <p className="text-sm text-gray-600">{menu.meal}</p>
                        <p className="text-xs text-gray-500">{menu.description}</p>
                        <p className="text-sm font-semibold text-indigo-600">RM {menu.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 统计概览 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">总学生数</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">本周总订单</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">已付款学生</p>
                  <p className="text-2xl font-bold text-green-600">{paidStudents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">未付款学生</p>
                  <p className="text-2xl font-bold text-orange-600">{unpaidStudents}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 收入统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">订单总额</p>
                  <p className="text-2xl font-bold text-gray-900">RM {totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">已收金额</p>
                  <p className="text-2xl font-bold text-green-600">RM {paidRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">待收金额</p>
                  <p className="text-2xl font-bold text-orange-600">RM {unpaidRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 学生订单详情 */}
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
                      const studentOrders = orders[student.id] || {};
                      const orderCount = Object.values(studentOrders).filter(Boolean).length;
                      const studentTotal = currentMenu.reduce((sum, menuItem) => {
                        return sum + (studentOrders[menuItem.day] ? menuItem.price : 0);
                      }, 0);
                      const isPaid = paymentStatus[student.id] || false;
                      
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
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isPaid 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {isPaid ? '已付款' : '未付款'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => togglePaymentStatus(student.id)}
                              className={`${
                                isPaid 
                                  ? 'text-red-600 hover:text-red-900' 
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                            >
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
  };

  // 根据当前用户状态渲染界面
  if (!currentUser) {
    return <LoginScreen />;
  }

  if (currentUser.id === 'teacher') {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
}
