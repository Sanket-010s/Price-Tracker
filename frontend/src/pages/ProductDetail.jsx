import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { usePriceHistory } from '../hooks/usePriceHistory';
import PriceChart from '../components/PriceChart';
import { formatPrice, formatRelativeTime } from '../utils/formatters';
import { checkProductPrice } from '../services/products';
import { useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error, refetch } = usePriceHistory(id);
  const [checking, setChecking] = useState(false);

  const handleCheckPrice = async () => {
    setChecking(true);
    try {
      await checkProductPrice(id);
      refetch();
    } catch (err) {
      alert('Failed to check price: ' + err.message);
    } finally {
      setChecking(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;
  if (error) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><p className="text-red-500">Error: {error}</p></div>;
  if (!product) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><p className="text-gray-500">Product not found</p></div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-green-600">
                  {formatPrice(product.current_price, product.currency)}
                </span>
                <span className={`px-3 py-1 rounded ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Last checked: {formatRelativeTime(product.last_checked)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleCheckPrice}
                  disabled={checking}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
                >
                  <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
                  {checking ? 'Checking...' : 'Check Price Now'}
                </button>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  View Product
                </a>
              </div>
            </div>
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="w-32 h-32 object-cover rounded" />
            )}
          </div>
        </div>

        {product.price_history && product.price_history.length > 0 && (
          <PriceChart priceHistory={product.price_history} currency={product.currency} />
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
