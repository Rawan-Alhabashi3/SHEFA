import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([
    { id: 101, customer: "Ahmad", total: 45, status: "Pending", assigned: false },
    { id: 102, customer: "Sara", total: 120, status: "Pending", assigned: false },
  ]);

  // ✅ إضافة طلب
  const addOrder = (order) => {
    setOrders((prev) => [...prev, order]);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

// ✅ Hook
export const useOrders = () => useContext(OrderContext);