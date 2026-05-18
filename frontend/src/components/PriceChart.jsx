import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPrice, formatRelativeTime } from '../utils/formatters';

const PriceChart = ({ priceHistory, currency }) => {
  // Sort history newest first for the list display
  const sortedHistory = [...priceHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Format data chronological for the line chart
  const chartData = [...priceHistory]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map(item => {
      // Parse ISO to nice time label
      const dateStrUTC = item.timestamp.endsWith('Z') ? item.timestamp : `${item.timestamp}Z`;
      const date = new Date(dateStrUTC);
      const label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      return {
        date: label,
        price: item.price
      };
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Chart Section */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Price History Chart</h3>
        {chartData.length < 2 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
            Need at least 2 price points to plot history (try checking price now!).
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={12} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12} 
                tickLine={false}
                tickFormatter={(value) => formatPrice(value, currency)}
              />
              <Tooltip 
                formatter={(value) => [formatPrice(value, currency), 'Price']}
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.375rem', color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                activeDot={{ r: 8 }} 
                dot={{ strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* History Log Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col h-[382px]">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Price History Logs</h3>
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {sortedHistory.map((item, index) => {
            const currentPrice = item.price;
            const previousItem = sortedHistory[index + 1];
            const diff = previousItem ? currentPrice - previousItem.price : 0;
            
            return (
              <div 
                key={item.id || index} 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatPrice(currentPrice, currency)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(item.timestamp)}
                  </p>
                </div>
                {diff !== 0 && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${diff < 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {diff < 0 ? '↓' : '↑'} {formatPrice(Math.abs(diff), currency)}
                  </span>
                )}
                {!previousItem && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                    Added
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PriceChart;
