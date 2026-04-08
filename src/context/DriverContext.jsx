import { createContext, useContext, useState, useEffect } from "react";
import { useOrders } from "./OrderContext";

const DriverContext = createContext();

export function DriverProvider({ children }) {
  const [available, setAvailable] = useState(true);
  const { orders, addOrder } = useOrders(); // ❌ ما عاد نستخدم setOrders

  useEffect(() => {
    if (available) {
      // ✅ نعدل الطلبات بدون setOrders
      const updatedOrders = orders.map((order) => {
        if (order.status === "Pending Assignment") {
          return {
            ...order,
            status: "Processing",
            assigned: true,
          };
        }
        return order;
      });

      // ❗ حل مؤقت: نعيد كتابة الطلبات
      // لازم يكون عندك setOrders داخل OrderContext مستقبلاً
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
    }
  }, [available, orders]);

  return (
    <DriverContext.Provider value={{ available, setAvailable }}>
      {children}
    </DriverContext.Provider>
  );
}

export const useDriver = () => useContext(DriverContext);