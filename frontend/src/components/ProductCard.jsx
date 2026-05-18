import { TrendingDown, TrendingUp, ExternalLink } from 'lucide-react';
import { formatPrice, formatRelativeTime } from '../utils/formatters';

const ProductCard = ({ product, onView, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(product.current_price, product.currency)}
            </span>
            {product.is_active ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
            ) : (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Inactive</span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last checked: {formatRelativeTime(product.last_checked)}
          </p>
        </div>
        {product.image_url && (
          <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded" />
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onView(product.id)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <ExternalLink size={20} />
        </a>
        <button
          onClick={() => onDelete(product.id)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
