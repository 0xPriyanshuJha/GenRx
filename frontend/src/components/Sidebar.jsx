import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function NavbarWithSidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 text-xl font-bold">My Sidebar</div>
        <nav className="mt-4">
          <Link href="/Scan" className="block px-4 py-2 text-base hover:bg-gray-700">
            Scans Analysis
          </Link>
          <Link href="/Prescription" className="block px-4 py-2 text-base hover:bg-gray-700">
            Prescription Analysis
          </Link>
          <Link href="/Scan" className="block px-4 py-2 text-base hover:bg-gray-700">
            Chronic Disease Remedies
          </Link>
          <Link href="/Contact" className="block px-4 py-2 text-base hover:bg-gray-700">
            Contact Us
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        {/* Navbar */}
        <nav className="bg-gray-800 px-4 py-2.5">
          <div className="flex items-center justify-between">
            {/* Hamburger Menu */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>

            {/* Title */}
            <div className="text-white text-xl font-bold">My App</div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="User Profile"
                />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg dark:bg-gray-700 ${
                  isDropdownOpen ? "block" : "hidden"
                }`}
              >
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  <div className="font-medium">Neil Sims</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    neil.sims@flowbite.com
                  </div>
                </div>
                <hr className="border-gray-200 dark:border-gray-600" />
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Dashboard
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Earnings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-grow p-4">
          <h1 className="text-2xl font-bold">Welcome to My App</h1>
          <p className="mt-2 text-gray-600">
            Use the sidebar to navigate or the dropdown for user actions.
          </p>
        </main>
      </div>
    </div>
  );
}

export default NavbarWithSidebar;
