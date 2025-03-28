import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ItemList from "./ItemList";
import SearchBar from "./SearchBar";
export default function Home() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const hasMounted = useRef(false);

  useEffect(() => {
    const getItems = async () => {
      const response = await fetch("http://localhost:3000/all", {
        credentials: "include",
      });

      if (response.ok) {
        console.log("User is authenticated");
        const data = await response.json();
        const items = data.items;
        setItems(items);
      } else {
        console.log("User is not authenticated");
        navigate("/login");
      }
    };
    getItems();
  }, []);

  useEffect(() => {
    if (hasMounted.current) {
      navigate(`/search?value=${searchTerm}`);
    } else {
      hasMounted.current = true;
    }
  }, [searchTerm]);

  const handleSearchTerm = (searchValue) => {
    if (searchValue.trim() === "") {
      return;
    }
    setSearchTerm(searchValue);
  };

  return (
    <div className="bg-gradient-to-br from-green-500 via-orange-500 to-purple-500 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 min-h-screen px-6 py-12 lg:px-8">
      <SearchBar placeholder="Search..." onSearch={handleSearchTerm} />
      <ItemList items={items} />
    </div>
  );
}
