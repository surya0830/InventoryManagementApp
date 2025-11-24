import { useState } from 'react';

export default function AddItemModal({ isOpen, onClose, onAdd, activeContext, existingCategories = [] }) {
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        unit: 'units',
        category: '',
        consumptionRate: '',
        consumptionPeriod: 'week',
        expiryDate: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            context: activeContext,
            quantity: Number(formData.quantity),
            consumptionRate: Number(formData.consumptionRate)
        });
        onClose();
        setFormData({
            name: '',
            quantity: '',
            unit: 'units',
            category: '',
            consumptionRate: '',
            consumptionPeriod: 'week',
            expiryDate: ''
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Item</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Item Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Milk, Tomatoes"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <input
                            type="text"
                            list="categories"
                            placeholder="e.g., Produce, Dairy, Tools"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        />
                        <datalist id="categories">
                            {existingCategories.map(cat => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Unit</label>
                            <select
                                value={formData.unit}
                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                            >
                                <option value="units">Units</option>
                                <option value="kg">kg</option>
                                <option value="lbs">lbs</option>
                                <option value="l">Liters</option>
                                <option value="oz">oz</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Consumption Rate (Est.)</label>
                        <div className="input-group">
                            <input
                                type="number"
                                placeholder="Amount"
                                min="0"
                                step="0.1"
                                value={formData.consumptionRate}
                                onChange={e => setFormData({ ...formData, consumptionRate: e.target.value })}
                            />
                            <span className="separator">per</span>
                            <select
                                value={formData.consumptionPeriod}
                                onChange={e => setFormData({ ...formData, consumptionPeriod: e.target.value })}
                            >
                                <option value="day">Day</option>
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Expiry Date (Optional)</label>
                        <input
                            type="date"
                            value={formData.expiryDate}
                            onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="primary-btn">Add Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
