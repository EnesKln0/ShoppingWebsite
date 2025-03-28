import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ItemList from "./ItemList";
import SearchBar from "./SearchBar";
export default function SearchedItems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const searchUrl = searchParams.get("value");
  const navigate = useNavigate();

  useEffect(() => {
    const getItems = async () => {
      const response = await fetch(
        `http://localhost:3000/searched?searchParams=${searchUrl}`,
        {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok || response.status === 404) {
        const data = await response.json();
        setItems(data.items);
      } else if (response.status === 404) {
        const data = await response.json();
        setItems(data.items);
        console.log("Items not found");
      } else if (response.status === 403) {
        console.log("User is not authenticated");
        navigate("/login");
      } else {
        console.log("An error occurred", response.status);
      }
    };

    getItems();
  }, [searchParams]);

  const handleSearch = (inputValue) => {
    if (inputValue.trim() === "") {
      return;
    }
    setSearchParams({ value: inputValue });
  };

  return (
    <div className="bg-gradient-to-br from-green-500 via-orange-500 to-purple-500 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 min-h-screen px-6 py-12 lg:px-8">
      <SearchBar onSearch={handleSearch} initialValue={searchUrl} />
      {items ? (
        <ItemList items={items} />
      ) : (
        <div className="max-w-screen-xl m-auto text-white text-center bg-slate-600">
          ITEM NOT FOUND
        </div>
      )}
    </div>
  );
}
