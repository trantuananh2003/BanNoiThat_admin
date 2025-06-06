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

  const triggerUpdateStatusOrder = async (
    orderId: string,
    orderStatus: string
  ) => {
    const formData = new FormData();
    formData.append("orderStatus", orderStatus);
    const response: ApiResponse = await clientAPI
      .service("orders")
      .patchEachProperty(orderId, "orderStatus", formData);
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
                          <Typography color="orange">{item.price} đ</Typography>
                        </Grid>
                      </Grid>
                    ))}

                    <Typography fontWeight="bold">
                      Tổng tiền hóa đơn: {order.totalPrice} đ
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
                        color="error"
                        onClick={() =>
                          triggerUpdateStatusOrder(order.id, "Cancelled")
                        }
                      >
                        Hủy đơn
                      </Button>
                    </Box>
                  )}
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
    </Box>
  );
};

export default OrderPage;
