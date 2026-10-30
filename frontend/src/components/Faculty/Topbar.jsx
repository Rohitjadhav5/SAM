import { Bell, Menu, UserCircle } from "lucide-react";

function Topbar() {
  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-4 sticky top-0 z-30">
      <div className="navbar-start gap-2">
        <label
          htmlFor="faculty-drawer"
          className="btn btn-square btn-ghost lg:hidden"
        >
          <Menu size={22} />
        </label>

        <h2 className="font-semibold text-lg">Faculty Portal</h2>
      </div>

      <div className="navbar-end gap-2">
        <button className="btn btn-ghost btn-circle" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2">
          <UserCircle size={26} />
          <span className="hidden sm:inline text-sm font-medium">Faculty</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
