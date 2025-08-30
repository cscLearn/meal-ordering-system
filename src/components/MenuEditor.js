// src/components/MenuEditor.js

import React from 'react';
import { Menu } from 'lucide-react';
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase';

export default function MenuEditor(props) {
  const {
    customMenus,
    setCustomMenus,
    editingMenu,
    setEditingMenu,
    setShowMenuEditor,
  } = props;

  const updateAndSyncMenus = async (newMenus, menuKeyToDelete = null) => {
    setCustomMenus(newMenus);
    try {
      for (const menuKey in newMenus) {
        const menuDocRef = doc(db, "menus", menuKey);
        await setDoc(menuDocRef, { items: newMenus[menuKey] });
      }
      if (menuKeyToDelete) {
        const menuDocRefToDelete = doc(db, "menus", menuKeyToDelete);
        await deleteDoc(menuDocRefToDelete);
      }
      console.log("菜单已成功同步到 Firebase!");
    } catch (error) {
      console.error("更新 Firebase 菜单失败:", error);
    }
  };

  const updateMenuItem = (menuKey, itemIndex, updatedItem) => {
    const newMenus = {
      ...customMenus,
      [menuKey]: customMenus[menuKey].map((item, index) =>
        index === itemIndex ? updatedItem : item
      )
    };
    updateAndSyncMenus(newMenus);
  };

  const removeMenuItem = (menuKey, itemIndex) => {
    const newMenus = {
      ...customMenus,
      [menuKey]: customMenus[menuKey].filter((_, index) => index !== itemIndex)
    };
    updateAndSyncMenus(newMenus);
  };

  const addMenuItem = (menuKey) => {
    const newItem = {
      day: `day_${Date.now()}`, // 生成一个唯一的 day ID
      dayName: '新日期',
      meal: '新菜品',
      description: 'New Item',
      price: 3.00
    };
    const newMenus = {
      ...customMenus,
      [menuKey]: [...(customMenus[menuKey] || []), newItem]
    };
    updateAndSyncMenus(newMenus);
  };
  
  const createNewMenu = () => {
    const newMenuKey = `menu_${Date.now()}`;
    const newMenus = {
        ...customMenus,
        [newMenuKey]: [
            { day: 'monday', dayName: '周一', meal: '新菜品1', description: 'New Item 1', price: 3.00 },
        ]
    };
    updateAndSyncMenus(newMenus);
    setEditingMenu(newMenuKey);
  };

  const deleteMenu = (menuKey) => {
    if (window.confirm('确定要永久删除这个菜单吗？')) {
        const newMenus = { ...customMenus };
        delete newMenus[menuKey];
        updateAndSyncMenus(newMenus, menuKey);
        if (editingMenu === menuKey) setEditingMenu(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Menu className="w-5 h-5 mr-2 text-indigo-600" />
            菜单编辑
          </h2>
          <div className="flex space-x-2">
            <button onClick={createNewMenu} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              创建新菜单
            </button>
            <button onClick={() => setShowMenuEditor(false)} className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md">
              返回
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid gap-6">
          {Object.entries(customMenus).map(([menuKey, menuItems]) => (
            <div key={menuKey} className="border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{menuKey.replace(/_/g, ' ')}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => setEditingMenu(editingMenu === menuKey ? null : menuKey)} className="text-indigo-600 hover:text-indigo-800 text-sm">
                    {editingMenu === menuKey ? '完成编辑' : '编辑'}
                  </button>
                  {!['menu_A', 'menu_B'].includes(menuKey) && (
                    <button onClick={() => deleteMenu(menuKey)} className="text-red-600 hover:text-red-800 text-sm">
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
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                          {/* 【新】Day (ID) 列 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Day (ID)</label>
                            <input
                              type="text"
                              value={item.day}
                              onChange={(e) => updateMenuItem(menuKey, index, { ...item, day: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                              placeholder="e.g., monday"
                            />
                          </div>
                          {/* 日期列 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                            <input
                              type="text"
                              value={item.dayName}
                              onChange={(e) => updateMenuItem(menuKey, index, { ...item, dayName: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              placeholder="例如：周一"
                            />
                          </div>
                          {/* 菜品名称列 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">菜品名称</label>
                            <input type="text" value={item.meal} onChange={(e) => updateMenuItem(menuKey, index, { ...item, meal: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg" />
                          </div>
                          {/* 英文描述列 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">英文描述</label>
                            <input type="text" value={item.description} onChange={(e) => updateMenuItem(menuKey, index, { ...item, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg" />
                          </div>
                          {/* 价格列 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">价格 (RM)</label>
                            <input type="number" step="0.50" min="0" value={item.price} onChange={(e) => updateMenuItem(menuKey, index, { ...item, price: parseFloat(e.target.value) || 0 })} className="w-full p-2 border border-gray-300 rounded-lg" />
                          </div>
                        </div>
                        <button onClick={() => removeMenuItem(menuKey, index)} className="text-red-600 hover:text-red-800 text-sm">删除此项</button>
                      </div>
                    ))}
                    <button onClick={() => addMenuItem(menuKey)} className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"> + 添加菜品 </button>
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
}