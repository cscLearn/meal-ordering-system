// src/components/StudentManagement.js

import React from 'react';
import { User, Eye, EyeOff } from 'lucide-react';

export default function StudentManagement(props) {
  const {
    students,
    setShowStudentManagement,
    selectedStudents,
    batchDeleteStudents,
    setShowBatchAdd,
    showBatchAdd,
    batchStudentText,
    setBatchStudentText,
    batchAddStudents,
    newStudent,
    setNewStudent,
    showStudentPassword,
    setShowStudentPassword,
    addStudent,
    selectAllStudents,
    toggleStudentSelection,
    editingStudent,
    setEditingStudent,
    updateStudent,
    resetStudentPassword,
    deleteStudent
  } = props;

  return (
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
                  <input type="checkbox" checked={students.length > 0 && selectedStudents.size === students.length} onChange={selectAllStudents} className="rounded border-gray-300" />
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
                const orderCount = Object.values(student.orders || {}).filter(Boolean).length;
                const isPaid = student.isPaid || false;
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" checked={selectedStudents.has(student.id)} onChange={() => toggleStudentSelection(student.id)} className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStudent === student.id ? (
                        <input type="text" defaultValue={student.name} className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-1" onBlur={(e) => { if (e.target.value.trim()) { updateStudent(student.id, { name: e.target.value.trim() }); } else { setEditingStudent(null); } }} onKeyPress={(e) => { if (e.key === 'Enter') { e.target.blur(); } }} autoFocus />
                      ) : (
                        <div className="text-sm text-gray-900 cursor-pointer hover:text-indigo-600" onClick={() => setEditingStudent(student.id)}>
                          {student.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-mono">{'*'.repeat(String(student.password).length)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${orderCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {orderCount} 份订单
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isPaid ? '已付款' : '未付款'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => resetStudentPassword(student.id)} className="text-orange-600 hover:text-orange-900"> 重置密码 </button>
                      <button onClick={() => deleteStudent(student.id)} className="text-red-600 hover:text-red-900"> 删除 </button>
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
}