import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">
                검 강화하기
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/game"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                  >
                    게임하기
                  </Link>
                  <Link
                    to="/inventory"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                  >
                    인벤토리
                  </Link>
                  <Link
                    to="/leaderboard"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                  >
                    순위표
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">
                      {user.name}님 ({user.gold?.toLocaleString()}G)
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="px-3 py-1 bg-white text-indigo-600 hover:bg-gray-100 rounded text-sm font-medium"
                  >
                    로그인
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
