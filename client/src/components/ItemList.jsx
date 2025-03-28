import { useState, useEffect } from "react";
import ItemCard from "./ItemCard";

export default function ItemList({ items }) {
  const [likedItems, setLikedItems] = useState([]);

  useEffect(() => {
    const storedLikedItems =
      JSON.parse(localStorage.getItem("likedItems")) || [];
    setLikedItems(storedLikedItems);
  }, []);

  useEffect(() => {
    localStorage.setItem("likedItems", JSON.stringify(likedItems));
  }, [likedItems]);

  const handleLike = (itemId) => {
    setLikedItems((prevLiked) => {
      if (prevLiked.includes(itemId)) {
        return prevLiked.filter((id) => id !== itemId);
      } else {
        return [...prevLiked, itemId];
      }
    });
  };

  const handleAddToCart = (item) => {
    console.log("Add to cart:", item);
  };

  return (
    <div className="text-white max-w-screen-xl m-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
        {items.map((item) => (
          <ItemCard
            key={item.item_id}
            item={item}
            onLike={handleLike}
            onAddToCart={handleAddToCart}
            liked={likedItems.includes(item.item_id)}
          />
        ))}
      </div>
    </div>
  );
}
