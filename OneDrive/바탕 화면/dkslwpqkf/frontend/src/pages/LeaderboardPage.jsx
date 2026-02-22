import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

const LeaderboardPage = () => {
  const { data: leaderboard, isLoading } = useQuery(['leaderboard'], async () => {
    const { data } = await api.get('/api/leaderboard');
    return data;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">순위표</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">강화 랭킹</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            가장 강력한 검을 가진 용사들의 순위입니다.
          </p>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-b-lg">
          <ul className="divide-y divide-gray-200">
            {leaderboard?.map((player, index) => (
              <li key={player.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-lg font-medium text-gray-900 w-8">
                      {index + 1}.
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {player.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {player.sword_name} (+{player.sword_level})
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {player.sword_power} 공격력
                    </div>
                    <div className="text-sm text-gray-500">
                      {player.wins}승 {player.losses}패
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
