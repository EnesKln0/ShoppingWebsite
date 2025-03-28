import { useState } from "react";
export default function SearchBar({
  placeholder,
  onSearch,
  initialValue = "",
}) {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form onSubmit={handleSearch} className="max-w-screen-xl mx-auto mb-2">
      <div className="flex rounded-sm border divide-x">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="text-white h-10 w-5/6 px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="h-10 w-1/6 text-center bg-transparent px-4 py-2 hover:bg-blue-600 transition duration-200 flex items-center justify-center"
        >
          <img src="/search.svg" alt="search_icon" />
        </button>
      </div>
    </form>
  );
}
