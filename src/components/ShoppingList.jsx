import { useInventory } from '../context/InventoryContext';

export default function ShoppingList() {
    const { items, getStatus, replenishItem } = useInventory();

    // Filter items that need replenishing (warning or critical)
    const shoppingItems = items.filter(item => {
        const status = getStatus(item);
        return status === 'warning' || status === 'critical';
    });

    if (shoppingItems.length === 0) {
        return (
            <div className="empty-state">
                <p>Everything is well stocked! No items need replenishing.</p>
            </div>
        );
    }

    return (
        <div className="shopping-list-container">
            <div className="section-header">
                <h2>Shopping List</h2>
                <span className="badge-count">{shoppingItems.length} items</span>
            </div>

            <div className="shopping-grid">
                {shoppingItems.map(item => (
                    <div key={item.id} className="shopping-item-card">
                        <div className="item-info">
                            <h3>{item.name}</h3>
                            <div className="item-meta">
                                <span className={`status-dot ${getStatus(item)}`}></span>
                                <span className="current-stock">
                                    Current: {item.quantity} {item.unit}
                                </span>
                            </div>
                        </div>

                        <button
                            className="replenish-btn"
                            onClick={() => replenishItem(item.id)}
                        >
                            <span className="icon">🛒</span>
                            Restock
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
