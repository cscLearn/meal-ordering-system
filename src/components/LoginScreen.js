// src/components/LoginScreen.js

import React from 'react';
import { ShoppingCart, Eye, EyeOff } from 'lucide-react';

export default function LoginScreen(props) {
  const {
    userType,
    setUserType,
    students,
    selectedStudent,
    setSelectedStudent,
    showPassword,
    setShowPassword,
    selectedPassword,
    setSelectedPassword,
    handleStudentLogin,
    handleTeacherLogin,
    loginError,
    setLoginError
  } = props;

  return (
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
                  const student = students.find(s => s.id === e.target.value);
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
}