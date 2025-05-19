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

interface Props {
  productId?: string | null;
  open: boolean;
  onClose: () => void;
}

const EditProductItemDialog: React.FC<Props> = ({ productId, open, onClose }) => {
  const [productItems, setProductItems] = useState<ProductItem[]>([]);

  const fetchProduct = async () => {
    if (productId) {
      try {
        const response = await clientAPI.service("products").get(productId.toString());
        const productData = response as {
          result: { productItems: ProductItem[] };
        };
        if (productData.result.productItems) {
          setProductItems(productData.result.productItems);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
  };

  useEffect(() => {
    if (open) {
      fetchProduct();
    }
  }, [productId, open]);

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
        formData.append(`items[${index}].imageProductItem`, item.imageProductItem);
      }
    });
    try {
      const response = await clientAPI.service("products").put(`${productId}/product-items`, formData);
      console.log("Response:", response);
      onClose();
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [name]: name.includes("price") || name === "quantity" ? Number(value) : value,
            }
          : item
      )
    );
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
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
        quantity: 1,
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        {productId ? `Chỉnh sửa sản phẩm ID: ${productId}` : "Tạo sản phẩm mới"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
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
                    fullWidth
                    label="Số lượng"
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e: any) => handleChange(index, e)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Tên Option"
                    name="nameOption"
                    value={item.nameOption}
                    onChange={(e: any) => handleChange(index, e)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Giá"
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={(e: any) => handleChange(index, e)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Giá KM"
                    type="number"
                    name="salePrice"
                    value={item.salePrice}
                    onChange={(e: any) => handleChange(index, e)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="SKU"
                    name="sku"
                    value={item.sku}
                    onChange={(e: any) => handleChange(index, e)}
                    margin="normal"
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
                        <img
                          src={item.imageUrl}
                          alt="Sản phẩm"
                          width={128}
                          height={128}
                          style={{ objectFit: "cover" }}
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
            + Thêm sản phẩm
          </Button>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProductItemDialog;
