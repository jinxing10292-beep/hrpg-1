import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

const GamePage = () => {
  const { user } = useAuth();
  const [enhancementResult, setEnhancementResult] = useState(null);

  const { data: userData, refetch } = useQuery(
    ['user', user?.id],
    async () => {
      const { data } = await api.get('/api/auth/me');
      return data.user;
    },
    { enabled: !!user }
  );

  const handleEnhance = async () => {
    try {
      const { data } = await api.post('/api/game/enhance');
      setEnhancementResult(data);
      refetch();
    } catch (error) {
      console.error('Enhancement failed:', error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">검 강화하기</h1>
      
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">현재 검</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            +{userData.sword?.level || 0} 레벨
          </span>
        </div>
        
        <div className="text-center py-8">
          <div className="text-4xl font-bold mb-2">{userData.sword?.name || '기본 검'}</div>
          <div className="text-gray-600 mb-4">{userData.sword?.description || '평범한 검'}</div>
          <div className="text-2xl font-bold text-indigo-600">
            공격력: {userData.sword?.current_power || 0}
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleEnhance}
            disabled={!userData || userData.gold < 1000}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              userData?.gold >= 1000 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-gray-400 cursor-not-allowed'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            강화하기 (비용: 1,000G)
          </button>
        </div>
      </div>

      {enhancementResult && (
        <div className={`p-4 rounded-lg mb-6 ${
          enhancementResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <p className="font-medium">
            {enhancementResult.success ? '강화 성공!' : '강화 실패!'}
          </p>
          {enhancementResult.message && (
            <p className="mt-1">{enhancementResult.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">보유 골드</h3>
          <p className="text-2xl font-bold">{userData.gold?.toLocaleString() || 0}G</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">보유 머니</h3>
          <p className="text-2xl font-bold">{userData.money?.toLocaleString() || 0}M</p>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              강화에는 1,000G가 소모됩니다. 실패 시 일정 확률로 검의 레벨이 내려가거나 초기화될 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
