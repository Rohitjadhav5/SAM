import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Sidebar from "./components/Faculty/Sidebar.jsx";
import Topbar from "./components/Faculty/Topbar.jsx";
import Dashboard from "./pages/Faculty/Dashboard.jsx";
import Students from "./pages/Faculty/Students.jsx";
import Attendance from "./pages/Faculty/Attendance.jsx";
import Profile from "./pages/Faculty/Profile.jsx";

function FacultyLayout() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="faculty-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex min-h-screen flex-col">
        <Topbar />

        <main className="flex-1 bg-base-200 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side z-40">
        <label
          htmlFor="faculty-drawer"
          className="drawer-overlay"
          aria-label="Close sidebar"
        />

        <Sidebar />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/faculty" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
