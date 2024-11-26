import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Delete() {
  const { id } = useParams<{ id: string }>(); // للحصول على معرف المنتج من URL
  const [isDeleting, setIsDeleting] = useState(false); // حالة للحذف
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // لإظهار رسالة الخطأ
  const navigate = useNavigate();

  // وظيفة الحذف
  const handleDelete = async () => {
    const token = localStorage.getItem("token"); // الحصول على التوكن

    if (!token) {
      setErrorMessage("User is not authenticated.");
      return;
    }

    setIsDeleting(true); // أظهر حالة الانتظار

    try {
      await axios.delete(`https://test1.focal-x.com/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // التوكن للإذن
        },
      });

      navigate("/showall"); // الانتقال بعد الحذف
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred while deleting the item."
      );
    } finally {
      setIsDeleting(false); // إخفاء حالة الانتظار
    }
  };

  // وظيفة الإلغاء
  const handleCancel = () => {
    navigate("/showall"); // العودة عند الإلغاء
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
          Are you sure you want to delete this product?
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
        )}
        <div className="flex justify-around mt-6">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`w-24 h-10 text-white font-medium rounded ${
              isDeleting ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isDeleting ? "Deleting..." : "Yes"}
          </button>
          <button
            onClick={handleCancel}
            className="w-24 h-10 text-white font-medium bg-gray-500 rounded hover:bg-gray-600"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default Delete;
