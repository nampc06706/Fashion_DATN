import React from 'react';
import { Link } from 'react-router-dom';

const colors = [
  { id: 1, name: "Red", hex: "#FF0000" },
  { id: 2, name: "Green", hex: "#00FF00" },
  { id: 3, name: "Blue", hex: "#0000FF" },
  // Thêm các màu sắc khác tại đây
];

const ColorManagementPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý màu sắc</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Tên</th>
            <th className="py-2 px-4 border-b">Mã màu</th>
            <th className="py-2 px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((color) => (
            <tr key={color.id}>
              <td className="py-2 px-4 border-b">{color.name}</td>
              <td className="py-2 px-4 border-b">
                <div
                  className="w-6 h-6 inline-block"
                  style={{ backgroundColor: color.hex }}
                ></div>
              </td>
              <td className="py-2 px-4 border-b">
                <Link to={`/admin/color/${color.id}`} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                  Xem chi tiết
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ColorManagementPage;
