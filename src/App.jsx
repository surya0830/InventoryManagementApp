import { useState } from 'react';
import { useInventory } from './context/InventoryContext';
import AddItemModal from './components/AddItemModal';
import InventoryCard from './components/InventoryCard';
import ShoppingList from './components/ShoppingList';

function App() {
  const { items, spaces, addSpace, getStatus } = useInventory();
  const [activeTab, setActiveTab] = useState(spaces[0] || 'Home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingSpace, setIsAddingSpace] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on active context
  const contextItems = items.filter(item => item.context === activeTab);

  // Get unique categories for this context
  const categories = ['All', ...new Set(contextItems.map(item => item.category).filter(Boolean))];

  // Filter by category and search query
  const filteredItems = contextItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate stats
  const totalItems = contextItems.length;
  const lowStock = contextItems.filter(item => getStatus(item) === 'warning').length;
  const criticalStock = contextItems.filter(item => getStatus(item) === 'critical').length;

  const handleAddSpace = (e) => {
    e.preventDefault();
    if (newSpaceName.trim()) {
      addSpace(newSpaceName.trim());
      setActiveTab(newSpaceName.trim());
      setNewSpaceName('');
      setIsAddingSpace(false);
    }
  };

  const handleExport = () => {
    const headers = ['Name', 'Category', 'Quantity', 'Unit', 'Context', 'Consumption Rate', 'Period', 'Expiry Date'];
    const csvContent = [
      headers.join(','),
      ...items.map(item => [
        `"${item.name}"`,
        `"${item.category || ''}"`,
        item.quantity,
        item.unit,
        item.context,
        item.consumptionRate || '',
        item.consumptionPeriod || '',
        item.expiryDate || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">📦</span>
          <h1>StockFlow</h1>
        </div>

        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <nav className="context-switcher">
          {spaces.map(space => (
            <button
              key={space}
              className={`nav-btn ${activeTab === space ? 'active' : ''}`}
              onClick={() => setActiveTab(space)}
            >
              {space}
            </button>
          ))}

          {isAddingSpace ? (
            <form onSubmit={handleAddSpace} className="add-space-form">
              <input
                type="text"
                value={newSpaceName}
                onChange={e => setNewSpaceName(e.target.value)}
                placeholder="Name..."
                autoFocus
                onBlur={() => setIsAddingSpace(false)}
              />
            </form>
          ) : (
            <button
              className="nav-btn add-space-btn"
              onClick={() => setIsAddingSpace(true)}
              title="Add New Space"
            >
              +
            </button>
          )}

          <div className="divider"></div>

          <button
            className={`nav-btn ${activeTab === 'shopping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shopping')}
          >
            Shopping List
          </button>

          <button
            className="nav-btn icon-only"
            onClick={handleExport}
            title="Export to CSV"
          >
            📥
          </button>
        </nav>
      </header>

      <main className="main-content">
        <div className="dashboard-grid">
          <div className="card summary-card">
            <h3>Total Items</h3>
            <p className="stat">{totalItems}</p>
          </div>
          <div className="card summary-card">
            <h3>Low Stock</h3>
            <p className="stat warning">{lowStock}</p>
          </div>
          <div className="card summary-card">
            <h3>Critical</h3>
            <p className="stat danger">{criticalStock}</p>
          </div>
        </div>

        <div className="content-area">
          {activeTab === 'shopping' ? (
            <ShoppingList />
          ) : (
            <>
              <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <h2>{activeTab} Inventory</h2>
                  {categories.length > 1 && (
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="category-filter"
                      style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        border: 'var(--glass-border)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>
                <button className="primary-btn" style={{ marginTop: 0 }} onClick={() => setIsModalOpen(true)}>
                  + Add Item
                </button>
              </div>

              {contextItems.length === 0 ? (
                <div className="empty-state">
                  <p>No items tracked in {activeTab} yet.</p>
                  <button className="primary-btn" onClick={() => setIsModalOpen(true)}>Add First Item</button>
                </div>
              ) : (
                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                  {filteredItems.map(item => (
                    <InventoryCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addItem} // addItem comes from context, but we need to pass it correctly if modal uses it directly or via prop
        activeContext={activeTab}
        existingCategories={categories.filter(c => c !== 'All')}
      />
    </div>
  );
}

export default App;

