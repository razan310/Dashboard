import { useState, useEffect } from "react";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import upload from './../../assets/img/UploadIcon.png';
import { GrFormPrevious } from "react-icons/gr";

function AddNew() {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // حالة لتخزين رابط المعاينة
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!name || !price || !image) {
      setError("Please fill out all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);

    try {
      await axios.post("https://test1.focal-x.com/api/items", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setError(null);
      navigate("/addnew");
    } catch (error: any) {
      setError("Error adding item: " + error.response?.data?.message || error.message);
      setSuccess(false);
    }
  };

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImage(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile)); // إنشاء رابط معاينة للصورة
    }
  };

  // تنظيف رابط المعاينة عند إلغاء التحديد
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <>
      <div className="overflow-hidden flex flex-col h-screen w-screen gap-2 px-12 py-5">
        <button
          onClick={() => navigate("/showall")}
          className="text-5xl w-10 h-10 flex justify-center items-center border-solid border-2 border-gray-900 rounded-full"
        >
          <GrFormPrevious />
        </button>

        <span className="flex items-center text-6xl h-21.848 font-semibold ">
          ADD NEW ITEM
        </span>
        
          {error && <p className="text-red-500 text-sm mb-1">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-1">Item added successfully!</p>}
        
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-24 w-full">
          <div className="flex flex-row gap-8">
            <div className="flex flex-col w-35.544 gap-5 justify-between">
              <div className="flex flex-col">
                <label htmlFor="name" className="font-medium text-3xl text-my-gray1">Name</label>
                <input
                  type="text"
                  placeholder="Enter the product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 mt-3 border border-gray-300 rounded w-97"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="price" className="font-medium text-3xl text-my-gray1">Price</label>
                <input
                  type="text"
                  placeholder="Enter the product price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="p-2 mt-3 border border-gray-300 rounded w-97"
                />
              </div>
            </div>

            <div className="flex flex-col w-46.752">
              <label htmlFor="profileImage" className="font-medium text-3xl text-my-gray1">Profile Image</label>
              <input
                type="file"
                id="profileImage"
                name="profile_image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div
                onClick={() => document.getElementById('profileImage')?.click()}
                className="relative w-full p-2 mt-3 cursor-pointer flex flex-col items-center justify-center  h-52 border border-dashed rounded bg-my-white-200 border-gray-300"
              >
                {previewImage && (
                  <img src={previewImage} alt="Selected" className="absolute w-full h-full object-scale-down " />
                )}
                <img src={upload} alt="Upload Icon" className="w-30 h-25" />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="p-2 w-52 h-16 font-normal text-3xl bg-my-yello text-white rounded hover:bg-my-yello-200"
            >
              Save
            </button>
          </div>
        </form>
        <Outlet />
      </div>
    </>
  );
}

export default AddNew;
