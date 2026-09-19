import { createContext, useReducer, useContext } from 'react';

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
  const [state, dispatch] = useReducer(orderReducer, { orders: [] });

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
