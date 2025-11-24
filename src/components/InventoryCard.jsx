import { useInventory } from '../context/InventoryContext';

export default function InventoryCard({ item }) {
    const { getStatus, removeItem } = useInventory();
    const status = getStatus(item);

    const statusColors = {
        good: 'var(--accent-success)',
        warning: 'var(--accent-warning)',
        critical: 'var(--accent-danger)'
    };

    // Calculate days left (mock logic for now, will enhance)
    const daysLeft = item.consumptionRate
        ? Math.round(item.quantity / (item.consumptionRate / (item.consumptionPeriod === 'week' ? 7 : 1)))
        : null;

    return (
        <div className="card inventory-card" style={{ borderLeft: `4px solid ${statusColors[status]}` }}>
            <div className="card-header">
                <div>
                    <h3>{item.name}</h3>
                    {item.category && <span className="category-tag">{item.category}</span>}
                </div>
                <span className={`status-badge ${status}`}>{status}</span>
            </div>

            <div className="card-body">
                <div className="stat-row">
                    <span className="label">Stock</span>
                    <span className="value">{item.quantity} {item.unit}</span>
                </div>

                {daysLeft !== null && (
                    <div className="stat-row">
                        <span className="label">Est. Days Left</span>
                        <span className="value">{daysLeft} days</span>
                    </div>
                )}

                {item.expiryDate && (
                    <div className="stat-row">
                        <span className="label">Expires</span>
                        <span className="value">{new Date(item.expiryDate).toLocaleDateString()}</span>
                    </div>
                )}
            </div>

            <div className="card-actions">
                <button className="icon-btn delete-btn" onClick={() => removeItem(item.id)} title="Delete">
                    🗑️
                </button>
                <button className="icon-btn edit-btn" title="Edit">
                    ✏️
                </button>
            </div>
        </div>
    );
}
