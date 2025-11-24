import { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
    // Load from local storage or default to empty
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('inventory_items');
        return saved ? JSON.parse(saved) : [];
    });

    const [spaces, setSpaces] = useState(() => {
        const saved = localStorage.getItem('inventory_spaces');
        return saved ? JSON.parse(saved) : ['Home', 'Restaurant', 'Office', 'Warehouse'];
    });

    useEffect(() => {
        localStorage.setItem('inventory_items', JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        localStorage.setItem('inventory_spaces', JSON.stringify(spaces));
    }, [spaces]);

    const addSpace = (name) => {
        if (!spaces.includes(name)) {
            setSpaces(prev => [...prev, name]);
        }
    };

    const removeSpace = (name) => {
        setSpaces(prev => prev.filter(s => s !== name));
    };

    const addItem = (newItem) => {
        setItems(prev => [...prev, {
            ...newItem,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
        }]);
    };

    const removeItem = (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateItem = (id, updates) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const replenishItem = (id) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const restockAmount = item.consumptionRate ? item.consumptionRate : 1;
                return { ...item, quantity: item.quantity + restockAmount };
            }
            return item;
        }));
    };

    const getStatus = (item) => {
        if (item.quantity <= 0) return 'critical';
        if (item.quantity < (item.minThreshold || 1)) return 'warning';
        return 'good';
    };

    return (
        <InventoryContext.Provider value={{
            items,
            spaces,
            addItem,
            removeItem,
            updateItem,
            replenishItem,
            getStatus,
            addSpace,
            removeSpace
        }}>
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventory() {
    return useContext(InventoryContext);
}
