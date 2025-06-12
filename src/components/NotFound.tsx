import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl mt-4 font-semibold">Không tìm thấy trang</h2>
      <p className="text-gray-600 mt-2">
        Trang bạn đang tìm có thể đã bị xóa hoặc không tồn tại.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
