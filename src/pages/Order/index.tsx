import React, { useEffect, useState } from "react";
import clientAPI from "../../client-api/rest-client";
import ApiResponse from "../../model/ApiResponse";
import { format } from "date-fns";
import { OrderResponse } from "../../model/OrderResponse.";

const OrderPage = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [dataOrders, setDataOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = ["Pending", "Processing", "Shipping", "Returned", "Done", "Cancelled"];

  const LoadOrders = async () => {
    setIsLoading(true);
    try {
      const response: ApiResponse = await clientAPI
        .service("orders/customer")
        .find(`orderStatus=${activeTab}`);
      setDataOrders(response.result || []);
      console.log(dataOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      setDataOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    LoadOrders();
  }, [activeTab]);

  const filteredOrders = dataOrders.filter((order) =>
    order.orderItems.some(
      (item) =>
        item.nameItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toString().includes(searchQuery)
    )
  );

  const triggerUpdateStatusOrder = async (orderId: string, orderStatus: string) => {
    let formData = new FormData();
    formData.append("orderStatus", orderStatus);

    const response: ApiResponse = await clientAPI.service("orders").patchEachProperty(orderId, 'orderStatus', formData);
    if (response.isSuccess) {
      LoadOrders();
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white  shadow-md rounded-md">
        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-2 text-sm font-medium ${activeTab === tab
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-700 hover:text-red-500"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="p-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
            className="w-full border rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {activeTab} Orders
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Hiển thị danh sách đơn hàng trong trạng thái "{activeTab}".
          </p>

          {isLoading ? (
            <div className="text-center text-gray-500 mt-4">Đang tải...</div>
          ) : dataOrders.length === 0 ? (
            <div className="text-gray-500 text-center mt-4">
              Không có đơn hàng trong trạng thái "{activeTab}".
            </div>
          ) : (
            dataOrders.map((order, index) => (
              <div key={index} className="bg-gray-100 shadow-md rounded-md p-4 mt-4">
                <div className="flex justify-between m-2">
                  <div className="flex  items-center">Trạng thái đơn hàng:&nbsp;
                    <div className="text-green-600">{order.orderStatus}
                    </div></div>
                  <div className="flex items-center">
                    <span className="text-gray-700 text-sm">Ngày đặt hàng:&nbsp;</span>
                    <div className="text-green-500">
                      {order?.orderPaidTime
                        ? format(new Date(order?.orderPaidTime), "dd/MM/yyyy")
                        : "Chưa có thông tin"}
                    </div>

                  </div>
                </div>
                <div className="flex flex-col bg-gray-100 gap-4 p-3">
                  {order.orderItems.map((orderItem, indexOr) => (
                    <div key={indexOr} className="flex border border-y-black justify-around gap-4">
                      <img
                        src={orderItem.imageItemUrl || "https://placehold.co/600x400"}
                        className="w-16 h-16 m-2 object-cover rounded-md"
                      />
                      <div className="flex flex-col">
                        <div className="text-lg">{orderItem.nameItem}</div>
                        <div>x{orderItem.quantity}</div>
                      </div>
                      <div className="flex-1 text-orange-700 mt-2 text-right px-3">
                        {orderItem.price} đ
                      </div>
                    </div>
                  ))}
                  <div><span className="text-lg text-black font-bold">Địa chỉ nhận hàng: </span>{order.shippingAddress}</div>
                </div>
                {
                  order.orderStatus === "Pending" &&
                  <div className="flex gap-3 justify-end">
                    <div className="flex justify-end">
                      <button className="bg-green-600 rounded-md px-2 py-1 text-white" onClick={() => triggerUpdateStatusOrder(order.id, "Processing")}>Xác nhận</button>
                    </div>
                    <div className="flex justify-end">
                      <button className="bg-red-600 rounded-md px-2 py-1 text-white" onClick={() => triggerUpdateStatusOrder(order.id, "Cancelled")}>Hủy đơn</button>
                    </div>
                  </div>
                }
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
