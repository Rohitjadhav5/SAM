import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  User,
  GraduationCap,
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/faculty", icon: LayoutDashboard },
  { name: "My Students", path: "/faculty/students", icon: Users },
  { name: "Attendance", path: "/faculty/attendance", icon: ClipboardCheck },
  { name: "My Profile", path: "/faculty/profile", icon: User },
];

function Sidebar() {
  return (
    <aside className="min-h-full w-72 bg-base-100 border-r border-base-300">
      <div className="flex items-center gap-3 p-6 border-b border-base-300">
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-xl w-11">
            <GraduationCap size={25} />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold">SAM</h2>
          <p className="text-sm text-base-content/60">Faculty Panel</p>
        </div>
      </div>

      <ul className="menu p-4 gap-2">
        <li className="menu-title">
          <span>MAIN MENU</span>
        </li>

        {links.map((link) => {
          const Icon = link.icon;

          return (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.path === "/faculty"}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <Icon size={19} />
                {link.name}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
