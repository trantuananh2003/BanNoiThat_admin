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

interface ProductItem {
  id: string | null;
  quantity: number;
  nameOption: string;
  price: number;
  salePrice: number;
  sku: string;
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
      const response = await clientAPI
        .service("products")
        .put(`${id}/product-items`, formData);
      setRefresh((prev) => !prev);
      onClose();
    } catch (error) {
      console.error("Error submitting:", error);
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
                name.includes("price") || name === "quantity"
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
    <React.Fragment>
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
              <Card key={index} sx={{ minWidth: 300 }}>
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
                    type="text"
                    name="quantity"
                    variant="standard"
                    value={item.quantity || ""}
                    placeholder="10"
                    onChange={(e) => handleChange(index, e)}
                  />

                  <TextField
                    fullWidth
                    required
                    margin="dense"
                    label="Giá"
                    type="text"
                    name="price"
                    variant="standard"
                    placeholder="100000000"
                    value={item.price || ""}
                    onChange={(e) => handleChange(index, e)}
                  />
                  <TextField
                    fullWidth
                    required
                    margin="dense"
                    label="Giá KM"
                    type="text"
                    name="salePrice"
                    variant="standard"
                    value={item.salePrice || ""}
                    placeholder="100000000"
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
    </React.Fragment>
  );
}
