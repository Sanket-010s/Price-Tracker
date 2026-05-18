import { useState, useEffect } from 'react';
import { getAlerts, createAlert, deleteAlert } from '../services/alerts';
import { getProducts } from '../services/products';
import AlertBadge from '../components/AlertBadge';
import { Plus, Trash2 } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    alert_type: 'absolute',
    target_price: '',
    percentage_drop: '',
    send_email: true,
    send_discord: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [alertsData, productsData] = await Promise.all([
        getAlerts(),
        getProducts()
      ]);
      setAlerts(alertsData);
      setProducts(productsData);
    } catch (err) {
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      // Convert string values to appropriate numbers for FastAPI/Pydantic
      payload.product_id = parseInt(payload.product_id, 10);
      
      if (payload.target_price) {
        payload.target_price = parseFloat(payload.target_price);
      } else {
        payload.target_price = null; // Send null instead of empty string
      }
      
      if (payload.percentage_drop) {
        payload.percentage_drop = parseFloat(payload.percentage_drop);
      } else {
        payload.percentage_drop = null; // Send null instead of empty string
      }

      await createAlert(payload);
      setShowForm(false);
      setFormData({ product_id: '', alert_type: 'absolute', target_price: '', percentage_drop: '', send_email: true, send_discord: false });
      fetchData();
    } catch (err) {
      alert('Failed to create alert. Check if you filled out the correct fields!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this alert?')) {
      await deleteAlert(id);
      fetchData();
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Price Alerts</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            New Alert
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Product</label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select a product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Alert Type</label>
                <select
                  value={formData.alert_type}
                  onChange={(e) => setFormData({ ...formData, alert_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="absolute">Absolute Price</option>
                  <option value="percentage">Percentage Drop</option>
                  <option value="any_drop">Any Price Drop</option>
                </select>
              </div>
              {formData.alert_type === 'absolute' && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Target Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.target_price}
                    onChange={(e) => setFormData({ ...formData, target_price: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}
              {formData.alert_type === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Percentage Drop (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.percentage_drop}
                    onChange={(e) => setFormData({ ...formData, percentage_drop: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}
              
              {/* Notification Channels */}
              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.send_email}
                    onChange={(e) => setFormData({ ...formData, send_email: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  Email Notification
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.send_discord}
                    onChange={(e) => setFormData({ ...formData, send_discord: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  Discord Notification
                </label>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Create Alert
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {alerts.map(alert => {
            const product = products.find(p => p.id === alert.product_id);
            return (
              <div key={alert.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{product?.name || 'Unknown Product'}</h3>
                  <div className="flex items-center gap-2">
                    <AlertBadge alert={alert} />
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${alert.send_email ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'}`}>
                      Email
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${alert.send_discord ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'}`}>
                      Discord
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
