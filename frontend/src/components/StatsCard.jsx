import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'indigo', 
  trend = null,
  loading = false 
}) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-gray-900">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              ) : (
                value
              )}
            </p>
            {trend && (
              <span className={`ml-2 text-sm font-medium ${
                trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
