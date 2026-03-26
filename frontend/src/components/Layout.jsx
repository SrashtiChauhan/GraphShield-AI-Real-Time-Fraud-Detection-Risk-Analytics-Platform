import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">

        {/* Navbar */}
        <div className="flex-shrink-0">
          <Navbar />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>

      </div>
    </div>
  );
}