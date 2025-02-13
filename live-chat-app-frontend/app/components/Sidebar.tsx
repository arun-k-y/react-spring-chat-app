import React from "react";
import SVG from "../lib/SVGs/SVG";
import Menu from "./Menu";

interface SidebarProps {
  isSearchOpen: boolean;
  setIsSearchOpen: any;
  setSearchQuery: any;
  searchQuery: any;
  setMenuOpen: any;
  menuOpen: any;
  filteredUsers: any;
  activeIndex: any;
  handleLogout: any;
  handleChatSelect: any;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSearchOpen,
  handleChatSelect,
  setIsSearchOpen,
  setSearchQuery,
  setMenuOpen,
  menuOpen,
  filteredUsers,
  activeIndex,
  searchQuery,
  handleLogout,
  isMobile,
}) => {
  return (
    <section className="bg-white h-screen w-full md:w-[320px] flex-shrink-0 border-r">
      <div className="py-4 px-4 border-b">
        {isSearchOpen ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              Online Members
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <SVG.SearchIcon />
              </button>
              <div className="md:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <SVG.ThreeDotMenu />
                </button>
                {menuOpen && (
                  <div className="absolute top-16 right-4">
                    <Menu onClickLogout={handleLogout} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-y-auto h-[calc(100vh-70px)]">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user: any) => (
            <div
              key={user.nickName}
              className={`px-4 py-3 flex gap-4 cursor-pointer hover:bg-gray-50 ${
                activeIndex === user.nickName ? "bg-gray-100" : ""
              }`}
              onClick={() => handleChatSelect(user)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  // src="assets/avatar1.png"
                  src={user.avatarUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user.nickName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user.realName}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            {searchQuery ? (
              <>
                <svg
                  className="w-16 h-16 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p>No users found</p>
                <p className="text-sm">Try a different search term</p>
              </>
            ) : (
              <p>No online users</p>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4 md:w-[290px]">
        {!isMobile && (
          <button
            onClick={handleLogout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 transition duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </section>
  );
};

export default Sidebar;
