import React, { useEffect, useState } from "react";
import clientAPI from "client-api/rest-client";
import ApiResponse from "model/ApiResponse";
import { OrderResponse } from "model/OrderResponse.";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import DialogConfirmOrder from "./dialog-confirm-order";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const OrderPage = () => {
  const [activeTab, setActiveTab] = useState("Processing");
  const [dataOrders, setDataOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState("");

  const tabs = ["Processing", "Shipping", "Returned", "Done", "Cancelled"];

  const LoadOrders = async () => {
    setIsLoading(true);
    try {
      const response: ApiResponse = await clientAPI
        .service("orders/manager")
        .find(`orderStatus=${activeTab}`);
      setDataOrders(response.result || []);
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

  const triggerCancelOrder = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Xác nhận hủy đơn hàng",
      text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Quay lại",
    });

    if (result.isConfirmed) {
      try {
        const response: ApiResponse = await clientAPI
          .service("orders/cancelOrder")
          .patchEachProperty(orderId);

        if (response.isSuccess) {
          Swal.fire("Đã hủy!", "Đơn hàng của bạn đã được hủy.", "success");
          LoadOrders();
        } else {
          Swal.fire("Lỗi!", "Không thể hủy đơn hàng. Vui lòng thử lại.", "error");
        }
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể kết nối đến máy chủ.", "error");
      }
    }
  };

  const triggerUpdateStatusOrder = async (
    orderId: string,
    orderStatus: string
  ) => {
    const formData = new FormData();
    formData.append("orderStatus", orderStatus);
    const response: ApiResponse = await clientAPI
      .service("orders")
      .patchEachProperty(orderId, "orderStatus");
    if (response.isSuccess) {
      LoadOrders();
    }
  };

  const [openDialogConfirmOrder, setOpenDialogConfirmOrder] =
    React.useState(false);

  const handleClickOpenDialogConfirmOrder = (id: string) => {
    setEditId(id);
    setOpenDialogConfirmOrder(true);
  };

  const handleCreateOrderGHN = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to create order GHN?");
    if (!confirmDelete) return;
    try {
      await clientAPI.service(`Orders/${id}/create-order-ghn`).create("");
      toast.success("Create order GHN successfully");
      LoadOrders();
    }
    catch (error: any) {
      toast.error(error?.response?.data?.errorMessages[0]);
    }
  }

  const triggerShowInfoOrder = async (orderId: string) => {
    try {
      var data: ApiResponse = await clientAPI.service(`orders/${orderId}`).find();

      toast.success(
        <div>
          <strong>Đơn vị vận chuyển:</strong> {data.result?.transferService} <br />
          <strong>Mã vận đơn:</strong> {data.result?.addressCode}
        </div>
      );
    } catch (e) {
    }
  }

  return (
    <Box
      sx={{ width: "100%", overflow: "hidden", borderRadius: 3, boxShadow: 5 }}
    >
      <Box sx={{ bgcolor: "#fff", borderRadius: 2, boxShadow: 2 }}>
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          textColor="secondary"
          indicatorColor="secondary"
        >
          {tabs.map((tab) => (
            <Tab key={tab} label={tab} value={tab} />
          ))}
        </Tabs>

        {/* Search */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="Tìm kiếm theo tên sản phẩm hoặc ID"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        {/* Orders */}
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">{activeTab} Orders</Typography>
          <Typography variant="body2" color="text.secondary">
            Hiển thị danh sách đơn hàng trong trạng thái "{activeTab}".
          </Typography>

          {isLoading ? (
            <Box textAlign="center" mt={4}>
              <CircularProgress />
              <Typography>Đang tải...</Typography>
            </Box>
          ) : filteredOrders.length === 0 ? (
            <Typography textAlign="center" color="text.secondary" mt={4}>
              Không có đơn hàng trong trạng thái "{activeTab}".
            </Typography>
          ) : (
            filteredOrders.map((order, index) => (
              <Card key={index} sx={{ mt: 3 }}>
                <CardContent>
                  <Grid container justifyContent="space-between">
                    <Grid>
                      <Typography>
                        Trạng thái đơn hàng:{" "}
                        <Typography component="span" color="success.main">
                          {order.orderStatus}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography>
                        Ngày đặt hàng:{" "}
                        <Typography component="span" color="primary">
                          {order?.orderPaidTime
                            ? format(
                              new Date(order?.orderPaidTime),
                              "dd/MM/yyyy"
                            )
                            : "Chưa có thông tin"}
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box mt={2}>
                    {order.orderItems.map((item, idx) => (
                      <Grid
                        key={idx}
                        container
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 1, borderBottom: "1px solid #eee", pb: 1 }}
                      >
                        <Grid>
                          <img
                            src={
                              item.imageItemUrl ||
                              "https://placehold.co/600x400"
                            }
                            alt={item.nameItem}
                            width={64}
                            height={64}
                            style={{ objectFit: "cover", borderRadius: 8 }}
                          />
                        </Grid>
                        <Grid>
                          <Typography>{item.nameItem}</Typography>
                          <Typography variant="body2">
                            x{item.quantity}
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography color="orange">{Number(item.price).toLocaleString("vi-VN")} đ</Typography>
                        </Grid>
                      </Grid>
                    ))}

                    <Typography fontWeight="bold">
                      Tổng tiền hóa đơn: {Number(order.totalPrice).toLocaleString("vi-VN")} đ
                    </Typography>
                    <Typography fontWeight="bold">
                      Địa chỉ nhận hàng: {order.shippingAddress}
                    </Typography>
                  </Box>

                  {(order.orderStatus === "Pending" ||
                    order.orderStatus === "Processing") && (
                      <Box
                        mt={2}
                        display="flex"
                        justifyContent="flex-end"
                        gap={2}
                      >

                        <Button
                          variant="contained"
                          color="success"
                          onClick={() =>
                            handleClickOpenDialogConfirmOrder(order.id)
                          }
                        >
                          Xác nhận
                        </Button>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => handleCreateOrderGHN(order.id)}
                        >
                          Tạo đơn GHN
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => triggerCancelOrder(order.id)}
                        >
                          Hủy đơn
                        </Button>
                      </Box>
                    )}
                  {
                    activeTab === "Shipping" && (<div className="flex justify-end">
                      <button className="bg-green-800 rounded-md px-2 py-1 text-white" onClick={() => triggerShowInfoOrder(order.id)}>Xem thông tin vận chuyển</button>
                    </div>)
                  }
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
      <DialogConfirmOrder
        orderId={editId}
        openDialogConfirmOrder={openDialogConfirmOrder}
        onClose={() => setOpenDialogConfirmOrder(false)}
      />
    </Box >
  );
};

export default OrderPage;
