import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";

interface Item {
  id: number;
  name: string;
  price: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

function Products() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    } else {
      axios
        .get("https://test1.focal-x.com/api/items", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setItems(response.data);
          setFilteredItems(response.data);
        })
        .catch((error) => {
          setError("Error fetching items: " + error.message);
        });
    }
  }, [navigate]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchValue)
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const handleDelete = (item: Item) => {
    setSelectedItem(item);
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = (id: number) => {
    const token = localStorage.getItem("token") || "";
    axios
      .delete(`https://test1.focal-x.com/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        setFilteredItems((prevItems) =>
          prevItems.filter((item) => item.id !== id)
        );
        setShowDeletePopup(false);
      })
      .catch((error) => {
        setError("Error deleting item: " + error.message);
      });
  };

  const handleDeleteCancel = () => {
    setShowDeletePopup(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4">
      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full max-w-md mb-4">
        <input
          type="text"
          placeholder="Search product by name"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
      </div>

      <div className="w-full flex justify-end max-w-5xl mb-6">
        <button
          onClick={() => navigate("/addnew")}
          className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          ADD NEW PRODUCT
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/showitem/${item.id}`)}
              className="relative bg-white shadow-md rounded-lg overflow-hidden group cursor-pointer"
            >
              {/* Image */}
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-64 object-cover transition-transform transform group-hover:scale-105"
              />

              {/* Overlay with Buttons */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit/${item.id}`);
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Product Name */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4">
                <h3 className="text-lg font-medium">{item.name}</h3>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No items found.</p>
        )}
      </div>

      <div className="flex justify-center mt-6">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Prev
          </button>
        )}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 rounded ${
              index + 1 === currentPage
                ? "bg-yellow-500 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {index + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Next
          </button>
        )}
      </div>

      {showDeletePopup && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to delete "{selectedItem.name}"?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={() => handleDeleteConfirm(selectedItem.id)}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={handleDeleteCancel}
                className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Outlet />
    </div>
  );
}

export default Products;
