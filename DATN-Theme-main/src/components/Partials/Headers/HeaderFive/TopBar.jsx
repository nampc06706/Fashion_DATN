import { Link } from "react-router-dom";

export default function TopBar({ className }) {
  return (
    <>
      <div
        className={`w-full bg-gray-900 h-10 shadow-lg border-b border-gray-800 ${
          className || ""
        }`}
      >
        <div className="container-x mx-auto h-full px-4">
          <div className="flex justify-between items-center h-full text-gray-300">
            {/* Logo & Navigation */}
            <div className="flex items-center space-x-8">
              <ul className="flex space-x-6">
                <li>
                  <Link to="/profile">
                    <span className="text-md font-medium hover:text-white transition-all duration-300">
                      Tài khoản
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/profile#order">
                    <span className="text-md font-medium hover:text-white transition-all duration-300">
                      Theo dõi đơn hàng
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
