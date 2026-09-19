import { createContext, useReducer, useContext, useEffect } from 'react';
import { db } from '../data/db';

const OrderContext = createContext();

function orderReducer(state, action) {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'ADD_ORDER': {
      // Check if order already exists to prevent duplicates from storage sync + manual dispatch
      if (state.orders.some(o => o.id === action.payload.id)) return state;
      return { ...state, orders: [action.payload, ...state.orders] };
    }
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? { ...order, status: action.payload.status, deliveryStaffId: action.payload.deliveryStaffId || order.deliveryStaffId } : order
        ),
      };
    default:
      return state;
  }
}

export function OrderProvider({ children }) {
  // Initialize from DB so context always has the latest state on mount
  const initialState = {
    orders: db.get('sampleOrders') || [],
  };

  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Sync across multiple browser tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'smartserve_sampleOrders' && e.newValue) {
        try {
          const newOrders = JSON.parse(e.newValue);
          dispatch({ type: 'SET_ORDERS', payload: newOrders });
        } catch (err) {
          console.error("Failed to parse orders from storage");
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);

