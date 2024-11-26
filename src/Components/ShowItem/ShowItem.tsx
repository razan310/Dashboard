import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import { GrFormPrevious } from "react-icons/gr";

// تعريف نوع البيانات التي يقدمها الـ API
interface Item {
  id: number;
  name: string;
  price: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

function ShowItem() {
  const { id } = useParams<{ id: string }>(); // استخدام useParams لاستخراج id من الـ URL
  const [item, setItem] = useState<Item | null>(null); // حالة لتخزين بيانات العنصر باستخدام النوع المحدد
  const [error, setError] = useState<string | null>(null); // حالة لتخزين الأخطاء
  const navigate = useNavigate(); // استخدام useNavigate للتوجيه

  useEffect(() => {
    const fetchItem = async () => {
      try {
        // احصل على التوكن من localStorage (أو من مكان آخر)
        const token = localStorage.getItem("token");

        // تأكد من أن التوكن موجود
        if (!token) {
          throw new Error("No token found, please log in.");
        }

        const response = await axios.get(`https://test1.focal-x.com/api/items/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // إضافة التوكن في الهيدر
          },
        });

        setItem(response.data); // تخزين البيانات في الحالة
      } catch (error: any) {
        // التحقق من تفاصيل الخطأ وإظهار رسالة مناسبة
        console.error("Error fetching item:", error.response || error.message);
        setError("Error fetching item: " + (error.response?.data?.message || error.message));
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]); // جلب البيانات عند تحميل المكون أو تغيير id

  // عرض رسالة خطأ إذا كان هناك خطأ
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // عرض رسالة التحميل إذا لم تكن البيانات متاحة بعد
  if (!item) {
    return <p>Loading...</p>;
  }

  // عرض تفاصيل العنصر
  return (
    <div className="overflow-hidden flex flex-col h-screen w-screen px-12 py-5">
      <button
        onClick={() => navigate("/showall")} // تغيير المسار إلى صفحة "show"
        className="text-5xl w-10 h-10 flex justify-center items-center border-solid border-2 border-gray-900 rounded-full mb-2"
      >
        <GrFormPrevious />
      </button>
      <span className="flex items-center text-6xl h-21.848 font-semibold mb-3">
        {item.name}
      </span>
      <div className="flex justify-center w-full h-41.444 mb-10">
        <img src={item.image_url} alt={item.name} className="mt-4 object-scale-down w-31.880" />
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-row items-center justify-between gap-10 ">
          <div className="text-lg">
            <span className="font-semibold lg:text-6xl md:text-3xl pr-3">Price:</span>
            <span className="font-medium lg:text-4xl md:text-2xl text-gray-400">{item.price}$</span>
          </div>
          <div className="mt-2 ">
            <span className="font-semibold lg:text-6xl md:text-3xl pr-3">Added At:</span>
            <span className="font-medium lg:text-4xl md:text-2xl text-gray-400">
              {new Date(item.created_at).toLocaleDateString()} {/* تعديل هنا لعرض التاريخ فقط */}
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-center items-baseline mt-2">
          <span className="font-semibold lg:text-6xl md:text-3xl pr-3">Updated At: </span>
          <span className="font-medium lg:text-4xl md:text-2xl text-gray-400">
             {new Date(item.updated_at).toLocaleDateString()} {/* تعديل هنا لعرض التاريخ فقط */}
          </span>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default ShowItem;
