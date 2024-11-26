import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GrFormPrevious } from "react-icons/gr";

interface Item {
  id: number;
  name: string;
  price: string;
  image_url: string;
}

function Edit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<Item>({
    id: 0,
    name: "",
    price: "",
    image_url: "",
  });
  const [originalItem, setOriginalItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    } else {
      axios
        .get(`https://test1.focal-x.com/api/items/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setItem(response.data);
          setOriginalItem(response.data);
          setPreviewImage(response.data.image_url);
        })
        .catch((error) => {
          setError("Error fetching item data: " + error.message);
        });
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setItem((prevItem) => ({
      ...prevItem,
      [name]: value.trim() !== ""
        ? value
        : originalItem
        ? originalItem[name as keyof Item]
        : prevItem[name as keyof Item],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const nameValue = item.name.trim();
    const priceValue = parseFloat(item.price);

    if (!nameValue || isNaN(priceValue) || priceValue <= 0) {
      setError(
        !nameValue
          ? "Name is required."
          : isNaN(priceValue) || priceValue <= 0
          ? "Price must be a positive number."
          : null
      );
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    } else {
      const formData = new FormData();
      formData.append("name", nameValue);
      formData.append("price", priceValue.toString());

      if (image) {
        formData.append("image", image);
      }

      formData.append("_method", "PUT");

      axios
        .post(`https://test1.focal-x.com/api/items/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setIsSubmitting(false);
          navigate("/showall");
        })
        .catch((error) => {
          if (error.response) {
            const errors = error.response.data.errors;
            let errorMessage = error.response.data.message;
            if (errors) {
              if (errors.name) errorMessage += `\nName Error: ${errors.name[0]}`;
              if (errors.price) errorMessage += `\nPrice Error: ${errors.price[0]}`;
            }
            setError(errorMessage);
          } else {
            setError("Error updating item: " + error.message);
          }
          setIsSubmitting(false);
        });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImage(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <div className="overflow-hidden flex flex-col h-screen w-screen gap-2 px-12 py-5">
      <button
        onClick={() => navigate("/showall")}
        className="text-5xl w-10 h-10 flex justify-center items-center border-solid border-2 border-gray-900 rounded-full"
      >
        <GrFormPrevious />
      </button>
      <span className="flex items-center text-6xl h-21.848 font-semibold mb-3">
        Edit Item
      </span>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <div className="flex flex-row gap-8">
          <div className="flex flex-col w-35.544 gap-5 justify-between">
            <div className="flex flex-col">
              <label htmlFor="name" className="font-medium text-3xl text-my-gray1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={item.name}
                onChange={handleChange}
                className="p-2 mt-3 border border-gray-300 rounded w-97"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="price" className="font-medium text-3xl text-my-gray1">Price</label>
              <input
                type="text"
                id="price"
                name="price"
                value={item.price}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          <div className="flex flex-col w-46.752">
            <label htmlFor="profileImage" className="font-medium text-3xl text-my-gray1">Profile Image</label>
            <input
              type="file"
              id="profileImage"
              name="image"
              onChange={handleImageChange}
              className="hidden"
            />
            <div
              onClick={() => document.getElementById('profileImage')?.click()}
              className="relative w-full p-2 mt-3 cursor-pointer flex flex-col items-center justify-center h-52 border border-dashed rounded bg-my-white-200 border-gray-300"
            >
              {previewImage && (
                <img src={previewImage} alt="Selected" className="absolute w-full h-full object-scale-down" />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
            <button
              type="submit"
              className={`p-2 w-52 h-16 font-normal text-3xl bg-my-yello text-white rounded hover:bg-my-yello-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
                Save
            </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
