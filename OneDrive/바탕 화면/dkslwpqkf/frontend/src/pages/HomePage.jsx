import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">검 강화하기</h1>
      <p className="text-xl text-gray-600 mb-8">
        검을 강화하고 다른 유저들과 대전하세요!
      </p>
      
      <div className="flex flex-col space-y-4 max-w-md mx-auto">
        <Link
          to="/game"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          게임 시작하기
        </Link>
        
        <Link
          to="/leaderboard"
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          순위표 보기
        </Link>
        
        {!user && (
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            이미 계정이 있으신가요? 로그인하기
          </Link>
        )}
      </div>
      
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="pt-6">
          <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
            <div className="-mt-6">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                강화 시스템
              </h3>
              <p className="mt-5 text-base text-gray-500">
                검을 강화하여 더 강력한 힘을 얻으세요. 성공, 실패, 파괴의 짜릿한 경험을!
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
            <div className="-mt-6">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                보안
              </h3>
              <p className="mt-5 text-base text-gray-500">
                개인 키를 통한 안전한 로그인 시스템으로 계정을 안전하게 보호하세요.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
            <div className="-mt-6">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                순위 경쟁
              </h3>
              <p className="mt-5 text-base text-gray-500">
                다른 플레이어들과 경쟁하며 순위를 올려보세요. 최고의 검객이 되어보세요!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
