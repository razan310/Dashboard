import { Outlet, NavLink, useNavigate } from "react-router-dom";
import logo from "./../../assets/img/dashbordLogo.svg";
import vector from "./../../assets/img/Vector.svg";
import markbook1 from "./../../assets/img/bookmark.svg";
import logout from "./../../assets/img/sign-out-alt 1.svg";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  const firstName = localStorage.getItem("first_name");
  const lastName = localStorage.getItem("last_name");
  const profileImageUrl = localStorage.getItem("profile_image_url");

  // حالة لتتبع إذا كانت القائمة المنسدلة مفتوحة أو مغلقة
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // دالة لتبديل حالة القائمة المنسدلة
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <nav className="bg-my-ofWhite flex flex-col justify-between lg:justify-evenly p-2 md:p-5 md:w-1/5 lg:w-1/6 md:h-full md:min-h-screen shadow-lg">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-10 md:w-20 h-auto md:mb-6" />
          <div className="flex flex-col items-center md:mb-6">
            {profileImageUrl && (
              <img
                src={profileImageUrl}
                alt="User"
                className="h-10 w-10 m-1 md:h-28 md:w-28 rounded-full md:mx-auto md:mb-3"
              />
            )}
            <h1 className="font-normal md:font-bold text-sm capitalize">{firstName} {lastName}</h1>
          </div>
        </div>

        {/* Button for small screens to toggle menu */}
        <button
          className="md:hidden text-sm font-medium p-2 rounded-md mb-4"
          onClick={toggleMenu}
        >
          Menu
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:block flex flex-col w-full space-y-4`}
        >
          <ul className="flex flex-col gap-4 w-full">
            <li>
              <NavLink
                to="/showall"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-my-yello text-white" : "hover:bg-gray-100"
                  }`
                }
              >
                <img src={vector} alt="Products" className="w-5 h-5" />
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-my-yello text-white" : "hover:bg-gray-100"
                  }`
                }
              >
                <img src={markbook1} alt="Favorites" className="w-5 h-5" />
                Favorites
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orderList"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-my-yello text-white" : "hover:bg-gray-100"
                  }`
                }
              >
                <img src={markbook1} alt="Order List" className="w-5 h-5" />
                Order List
              </NavLink>
            </li>
          </ul>

          {/* Logout */}
          <NavLink
            to="/logout"
            className="flex items-center gap-3 text-sm text-red-600 font-medium mt-auto py-2 px-4 hover:bg-gray-100 rounded-md"
          >
            Logout
            <img src={logout} alt="Logout" className="w-5 h-5" />
          </NavLink>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
