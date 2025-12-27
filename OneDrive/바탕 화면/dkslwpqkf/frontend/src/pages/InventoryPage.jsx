import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const InventoryPage = () => {
  const { user } = useAuth();

  const { data: inventory, isLoading } = useQuery(
    ['inventory', user?.id],
    async () => {
      const { data } = await api.get('/api/inventory');
      return data;
    },
    { enabled: !!user }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">인벤토리</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">현재 장착 중</h3>
        </div>
        
        {inventory?.equippedSword ? (
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">
                  {inventory.equippedSword.name} (+{inventory.equippedSword.level})
                </h4>
                <p className="text-sm text-gray-500">
                  공격력: <span className="font-medium">{inventory.equippedSword.current_power}</span>
                  {inventory.equippedSword.is_hidden && (
                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      히든 무기
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
            장착 중인 무기가 없습니다.
          </div>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">보유 중인 아이템</h3>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {inventory?.items?.length > 0 ? (
              inventory.items.map((item) => (
                <li key={item.id}>
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="min-w-0 flex-1 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {item.name} (+{item.level})
                            </p>
                            <p className="mt-1 flex items-center text-sm text-gray-500">
                              <span className="truncate">
                                {item.description || '설명이 없습니다.'}
                              </span>
                            </p>
                          </div>
                          <div className="hidden md:block">
                            <div>
                              <p className="text-sm text-gray-900">
                                공격력: <span className="font-medium">{item.current_power}</span>
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.is_hidden ? '히든 아이템' : '일반 아이템'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <button
                        type="button"
                        className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={async () => {
                          try {
                            await api.post(`/api/inventory/equip/${item.id}`);
                            // Refetch inventory data
                            queryClient.invalidateQueries(['inventory', user?.id]);
                          } catch (error) {
                            console.error('Failed to equip item:', error);
                          }
                        }}
                      >
                        장착
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                보유 중인 아이템이 없습니다.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
