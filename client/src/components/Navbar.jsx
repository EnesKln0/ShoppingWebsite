import ToggleDarkMode from "./ToggleDarkMode";
export default function Navbar() {
  return (
    <div className="z-10 fixed top-1 w-64">
      <ToggleDarkMode />
    </div>
  );
}
