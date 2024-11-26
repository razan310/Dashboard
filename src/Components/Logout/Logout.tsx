import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    // إرسال طلب تسجيل الخروج
    axios
      .post(
        "https://test1.focal-x.com/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      )
      .then(() => {
        // إزالة التوكن من localStorage
        localStorage.removeItem("token");
        // إعادة التوجيه إلى صفحة تسجيل الدخول
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        // في حال وجود خطأ، يمكن عرض رسالة للمستخدم هنا
      });
  }, [navigate]);

  return (
    <div className="w-screen h-screen flex flex-col items-center pt-28 ">
      <p>Logging out...</p>
    </div>
  );
}

export default Logout;
