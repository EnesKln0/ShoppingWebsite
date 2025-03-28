import { Link } from "react-router-dom";

export default function ItemCard({ item, onLike, onAddToCart, liked }) {
  return (
    <div className="border p-4 rounded shadow">
      <Link to={`/items/${item.item_id}`} className="block overflow-hidden">
        <img
          className="w-full h-full max-h-48 min-h-48 object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
          src={item.image_path}
          alt={item.item_name}
        />
      </Link>
      <div className="font-semibold">{item.item_name}</div>
      <div className="font-semibold">$ {item.item_price}</div>
      <div className="flex justify-between mt-4 items-center">
        <button
          onClick={() => onAddToCart(item)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
        <button
          onClick={() => onLike(item.item_id)}
          className={`text-xl ${liked ? "text-red-500" : "text-gray-500"}`}
        >
          {liked ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}
