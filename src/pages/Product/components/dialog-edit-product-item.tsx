import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  CardContent,
  DialogContent,
  Dialog,
  DialogActions,
  DialogTitle,
  InputLabel,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  IconButton,
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
  weight?: number;
  imageProductItem: any;
  imageUrl?: string;
  modelUrl?: string;
  modelFile?: any;
  isDelete?: boolean;
  colors?: string[] | string | null;
  isHardDelete?: boolean;
}

interface DialogEditProductItemProps {
  id: string;
  openDialogEditProductItem: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const colorOptions = [
  { label: "Đen", value: "black", bgColor: "#000000" },
  { label: "Trắng", value: "white", bgColor: "#FFFFFF" },
  { label: "Hồng", value: "pink", bgColor: "#FF69B4" },
  { label: "Xám", value: "gray", bgColor: "#808080" },
  { label: "Vàng", value: "yellow", bgColor: "#FFFF00" },
  { label: "Xanh lá", value: "green", bgColor: "#008000" },
  { label: "Xanh dương", value: "blue", bgColor: "#0000FF" },
  { label: "Be", value: "beige", bgColor: "#F5F5DC" },
  { label: "Nâu", value: "brown", bgColor: "#8B4513" },
  { label: "Tím", value: "purple", bgColor: "#800080" },
];

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
          const itemsWithColors = productData.result.productItems.map(
            (item) => ({
              ...item,
              colors: item.colors || [],
            })
          );
          setProductItems(itemsWithColors);
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
        `items[${index}].lengthSize`,
        item.lengthSize?.toString() || "0"
      );
      formData.append(
        `items[${index}].widthSize`,
        item.widthSize?.toString() || "0"
      );
      formData.append(
        `items[${index}].heightSize`,
        item.heightSize?.toString() || "0"
      );
      formData.append(`items[${index}].weight`, item.weight?.toString() || "0");
      formData.append(
        `items[${index}].isDelete`,
        item.isDelete ? item.isDelete.toString() : "false"
      );
      if (item.colors) {
        let colorArray: string[] = [];

        if (Array.isArray(item.colors)) {
          colorArray = item.colors;
        } else if (typeof item.colors === "string") {
          colorArray = item.colors.split(" ");
        }

        if (colorArray.length > 0) {
          formData.append(`items[${index}].Colors`, colorArray.join(" "));
        }
      }
      if (item.imageProductItem) {
        formData.append(
          `items[${index}].imageProductItem`,
          item.imageProductItem
        );
      }
    });

    try {
      // First API call: Update product items
      await clientAPI.service("products").put(`${id}/product-items`, formData);

      // Second API call: Upload .glb model files for each product item
      for (const [index, item] of productItems.entries()) {
        if (item.modelFile && item.modelFile.name.endsWith(".glb") && item.id) {
          const modelFormData = new FormData();
          modelFormData.append("model3DFile", item.modelFile);
          await clientAPI
            .service("product-items")
            .put(`${item.id}/model`, modelFormData);
        }
      }

      toast.success("Product items and models updated successfully!");
      setRefresh((prev) => !prev);
      onClose();
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error(
        "Failed to update product items or models. Please try again."
      );
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
                name === "heightSize" ||
                name === "weight"
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

  const handleModelChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setProductItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, modelFile: file } : item
        )
      );

      reader.onload = (e) => {
        const modelUrl = e.target?.result as string;
        setProductItems((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, modelUrl: modelUrl } : item
          )
        );
      };
    }
  };

  const handleColorChange = (index: number, newValue: typeof colorOptions) => {
    setProductItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, colors: newValue.map((color) => color.value) }
          : item
      )
    );
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
        weight: 0,
        imageProductItem: null,
        modelFile: null,
        colors: [],
        isHardDelete: true,
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

  const deleteProductItemHard = (index: number) => {
    const updated = [...productItems];
    updated.splice(index, 1);
    setProductItems(updated);
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
                  {item.isHardDelete ? (
                    <IconButton
                      onClick={() => deleteProductItemHard(index)}
                      size="small"
                      sx={{ color: "#888" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : (
                    <></>
                  )}
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

                <Autocomplete
                  multiple
                  options={colorOptions}
                  getOptionLabel={(option) => option.label}
                  value={colorOptions.filter((option) =>
                    item.colors?.includes(option.value)
                  )}
                  onChange={(event, newValue) =>
                    handleColorChange(index, newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Màu sắc"
                      margin="dense"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, idx) => (
                      <Chip
                        label={option.label}
                        {...getTagProps({ index: idx })}
                        sx={{
                          backgroundColor: option.bgColor,
                          color: ["white", "yellow", "beige"].includes(
                            option.value
                          )
                            ? "#000000"
                            : "#FFFFFF",
                          m: 0.5,
                        }}
                      />
                    ))
                  }
                  sx={{ mt: 1 }}
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

                <TextField
                  fullWidth
                  margin="dense"
                  label="Trọng lượng (g)"
                  name="weight"
                  type="number"
                  variant="standard"
                  value={item.weight || ""}
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

                <Box mt={2}>
                  <InputLabel>Mô hình</InputLabel>
                  <Button variant="contained" component="label">
                    Chọn mô hình
                    <input
                      type="file"
                      hidden
                      accept=".glb"
                      onChange={(e) => handleModelChange(index, e)}
                    />
                  </Button>
                  {item.modelUrl && (
                    <Box mt={2}>
                      <Typography variant="body2">
                        Mô hình: {item.modelFile?.name || "Đã được lưu"}
                      </Typography>
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
