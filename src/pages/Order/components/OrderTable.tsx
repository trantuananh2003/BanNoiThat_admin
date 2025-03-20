import React, { useEffect, useState } from "react";
import clientAPI from "../../../client-api/rest-client";

interface Order {
  Id: number;
  User_Id: string;
  OrderPaidTime: string;
  TotalPrice: number;
  PaymentMethod: string;
  PaymentStatus: string;
  OrderStatus: string;
  ShippingAddress: string;
  PhoneNumber: string;
}

const Status_Order_Pending = "Pending";
const Status_Order_Processing = "Processing";
const Status_Order_Shipping = "Shipping";
const Status_Order_Done = "Done";
const Status_Order_Returned = "Returned";
const Status_Order_Cancelled = "Cancelled";

const orderStatuses = [
  Status_Order_Pending,
  Status_Order_Processing,
  Status_Order_Shipping,
  Status_Order_Done,
  Status_Order_Returned,
  Status_Order_Cancelled,
];

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await clientAPI.service("Orders/Manage").find();
      setOrders(response as Order[]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="grid grid-cols-6 gap-4 p-4">
      {orderStatuses.map((status) => (
        <div key={status} className="border rounded-lg p-4 shadow-md bg-white">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">{status}</h2>
          <div className="space-y-3">
            {orders
              .filter((order) => order.OrderStatus === status)
              .map((order) => (
                <div key={order.Id} className="p-3 border rounded-md shadow-sm bg-gray-100">
                  <p className="text-sm font-semibold">Mã đơn: {order.Id}</p>
                  <p className="text-sm">Giá: {order.TotalPrice.toLocaleString()} VNĐ</p>
                  <p className="text-sm">Thanh toán: {order.PaymentMethod}</p>
                  <p className="text-sm">Trạng thái: {order.PaymentStatus}</p>
                  <button className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
                    Chi tiết
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTable;
