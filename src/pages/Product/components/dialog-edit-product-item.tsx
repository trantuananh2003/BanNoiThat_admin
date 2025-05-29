import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import clientAPI from "../../../client-api/rest-client";
import { toast } from "react-toastify";

interface ProductItem {
  id: string | null;
  quantity: number;
  nameOption: string;
  price: number;
  salePrice: number;
  sku: string;
  lengthSize?: number;
  widthSize?: number;
  heightSize?: number;
  imageProductItem: any;
  imageUrl?: string;
  isDelete?: boolean;
}

interface DialogEditProductItemProps {
  id: string;
  openDialogEditProductItem: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DialogEditProductItem({
  id,
  openDialogEditProductItem,
  onClose,
  setRefresh,
}: DialogEditProductItemProps) {
  const [productItems, setProductItems] = useState<ProductItem[]>([]);

  useEffect(() => {
    const fetchProductItems = async () => {
      try {
        const response = await clientAPI.service("products").get(id);
        const productData = response as {
          result: { productItems: ProductItem[] };
        };
        if (productData.result.productItems) {
          setProductItems(productData.result.productItems);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    if (id) {
      fetchProductItems();
    }
  }, [id, openDialogEditProductItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    productItems.forEach((item, index) => {
      formData.append(`items[${index}].id`, item.id ? item.id.toString() : "");
      formData.append(`items[${index}].nameOption`, item.nameOption);
      formData.append(`items[${index}].quantity`, item.quantity.toString());
      formData.append(`items[${index}].price`, item.price.toString());
      formData.append(`items[${index}].salePrice`, item.salePrice.toString());
      formData.append(`items[${index}].sku`, item.sku);
      formData.append(`items[${index}].lengthSize`, item.lengthSize?.toString() || "0");
      formData.append(`items[${index}].widthSize`, item.widthSize?.toString() || "0");
      formData.append(`items[${index}].heightSize`, item.heightSize?.toString() || "0");
      formData.append(
        `items[${index}].isDelete`,
        item.isDelete ? item.isDelete.toString() : "false"
      );
      if (item.imageProductItem) {
        formData.append(
          `items[${index}].imageProductItem`,
          item.imageProductItem
        );
      }
    });

    try {
      await clientAPI.service("products").put(`${id}/product-items`, formData);
      toast.success("Product items updated successfully!");
      setRefresh((prev) => !prev);
      onClose();
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Failed to update product items. Please try again.");
    }
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [name]:
                name.includes("price") ||
                name === "quantity" ||
                name === "lengthSize" ||
                name === "widthSize" ||
                name === "heightSize"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  };

  const handleImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setProductItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, imageProductItem: file } : item
        )
      );

      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setProductItems((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, imageUrl: imgUrl } : item
          )
        );
      };
    }
  };

  const addProductItem = () => {
    setProductItems((prev) => [
      ...prev,
      {
        id: null,
        quantity: 0,
        nameOption: "",
        price: 0,
        salePrice: 0,
        sku: "",
        lengthSize: 0,
        widthSize: 0,
        heightSize: 0,
        imageProductItem: null,
      },
    ]);
  };

  const deleteProductItem = (index: number) => {
    setProductItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isDelete: !item.isDelete } : item
      )
    );
  };

  return (
    <Dialog
      open={openDialogEditProductItem}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleSubmit(event);
          },
        },
      }}
    >
      <DialogTitle>
        {id ? `Chỉnh sửa sản phẩm ID: ${id}` : "Tạo sản phẩm mới"}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2} overflow="auto">
          {productItems.map((item, index) => (
            <Card key={index} sx={{ maxWidth: 300, minWidth: 300 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="error" fontWeight="bold">
                    {item.isDelete ? (
                      <span
                        onClick={() => deleteProductItem(index)}
                        style={{ cursor: "pointer" }}
                      >
                        Đã xóa
                      </span>
                    ) : (
                      <span
                        onClick={() => deleteProductItem(index)}
                        style={{ cursor: "pointer" }}
                      >
                        <DeleteIcon fontSize="small" /> X
                      </span>
                    )}
                  </Typography>
                </Box>

                <TextField
                  autoFocus
                  fullWidth
                  required
                  margin="dense"
                  label="Tên Option"
                  name="nameOption"
                  variant="standard"
                  value={item.nameOption || ""}
                  onChange={(e) => handleChange(index, e)}
                />

                <TextField
                  fullWidth
                  required
                  margin="dense"
                  label="Số lượng"
                  name="quantity"
                  type="number"
                  variant="standard"
                  value={item.quantity || ""}
                  onChange={(e) => handleChange(index, e)}
                />

                <TextField
                  fullWidth
                  required
                  margin="dense"
                  label="Giá"
                  name="price"
                  type="number"
                  variant="standard"
                  value={item.price || ""}
                  onChange={(e) => handleChange(index, e)}
                />

                <TextField
                  fullWidth
                  required
                  margin="dense"
                  label="Giá KM"
                  name="salePrice"
                  type="number"
                  variant="standard"
                  value={item.salePrice || ""}
                  onChange={(e) => handleChange(index, e)}
                />

                <TextField
                  fullWidth
                  required
                  margin="dense"
                  label="SKU"
                  name="sku"
                  variant="standard"
                  value={item.sku || ""}
                  onChange={(e) => handleChange(index, e)}
                />

                <TextField
                  fullWidth
                  margin="dense"
                  label="Chiều dài (cm)"
                  name="lengthSize"
                  type="number"
                  variant="standard"
                  value={item.lengthSize || ""}
                  onChange={(e) => handleChange(index, e)}
                />

                <TextField
                  fullWidth
                  margin="dense"
                  label="Chiều rộng (cm)"
                  name="widthSize"
                  type="number"
                  variant="standard"
                  value={item.widthSize || ""}
                  onChange={(e) => handleChange(index, e)}
                />

                <TextField
                  fullWidth
                  margin="dense"
                  label="Chiều cao (cm)"
                  name="heightSize"
                  type="number"
                  variant="standard"
                  value={item.heightSize || ""}
                  onChange={(e) => handleChange(index, e)}
                />

                <Box mt={2}>
                  <InputLabel>Hình ảnh</InputLabel>
                  <Button variant="contained" component="label">
                    Chọn hình
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)}
                    />
                  </Button>
                  {item.imageUrl && (
                    <Box mt={2}>
                      <Box
                        component="img"
                        src={item.imageUrl}
                        alt="Sản phẩm"
                        sx={{
                          width: 128,
                          height: 128,
                          objectFit: "cover",
                          borderRadius: 1,
                          border: "1px solid #ccc",
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={addProductItem}>
          + Add product item
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
