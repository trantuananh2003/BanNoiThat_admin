import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import clientAPI from "client-api/rest-client";
import * as React from "react";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { string_to_slug } from "utils/commonFunctions";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import EditorDescription from "./dialog-editor-tool";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface DialogEditProductInfoProps {
  id: string;
  openDialogEditProductInfo: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  children: Category[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl: string;
  description: string;
  brand: Brand;
  category: Category;
}

export default function DialogEditProductInfo({
  id,
  openDialogEditProductInfo,
  onClose,
  setRefresh,
}: DialogEditProductInfoProps) {
  const [productName, setProductName] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<File>();
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState<Brand>();
  const [category, setCategory] = useState<Category>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response: { result: Product } = await clientAPI
          .service("products")
          .get(id);
        setProductName(response.result.name);
        setSlug(response.result.slug);
        setPreviewImage(response.result.thumbnailUrl);
        setDescription(response.result.description);
        setBrand(response.result.brand);
        setCategory(response.result.category);
      } catch (error) {
        console.log("Error getting this product: ", error);
      }
    };

    const fetchCategories = async () => {
      const responseDataCategories = await clientAPI
        .service("Categories/admin")
        .find();
      const categories = (responseDataCategories as { result: Category[] })
        .result;
      const childrenFilter = categories.filter(
        (category) => category.children && category.children.length > 0
      );
      const childrenCategories = childrenFilter.flatMap(
        (category) => category.children
      );
      setCategories(childrenCategories);
    };
    const fetchBrands = async () => {
      const responseDataBrands = await clientAPI.service("Brands").find();
      const brands = (responseDataBrands as { result: Brand[] }).result;
      setBrands(brands);
    };

    if (id) {
      getProduct();
      fetchCategories();
      fetchBrands();
    }

    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [id]);

  const handleSaveProduct = async () => {

    const formData = new FormData();
    formData.append("Name", productName);
    formData.append("Slug", slug);
    if (thumbnailUrl) {
      formData.append("Image", thumbnailUrl);
    }
    formData.append("Category_Id", category?.id || "");
    formData.append("Brand_Id", brand?.id || "");
    formData.append("Description", description);

    try {
      await clientAPI.service("products").put(id, formData);
      setRefresh((prev) => !prev);
      onClose();
    } catch (error) {
      console.error("Error saving new product:", error);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={openDialogEditProductInfo}
        onClose={onClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleSaveProduct();
            },
          },
        }}
      >
        <DialogTitle>Edit product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="productName"
            name="productName"
            label="Product Name"
            type="text"
            fullWidth
            variant="standard"
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
              setSlug(string_to_slug(e.target.value));
            }}
          />

          {/* Upload + Preview */}
          <Box display="flex" alignItems="center" gap={2} mt={2}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setThumbnailUrl(file);
                    const objectUrl = URL.createObjectURL(file);
                    setPreviewImage(objectUrl);
                  }
                }}
              />
            </Button>

            {previewImage && (
              <Box
                component="img"
                src={previewImage}
                alt="Preview"
                sx={{
                  width: 120,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 1,
                  border: "1px solid #ccc",
                }}
              />
            )}
          </Box>

          <TextField
            required
            margin="dense"
            id="slug"
            name="slug"
            label="Slug"
            type="text"
            fullWidth
            variant="standard"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <FormControl fullWidth sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Brand</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              label="Brand"
              value={brand?.id || ""}
              onChange={(e) => {
                const selected = brands.find((b) => b.id === e.target.value);
                if (selected) setBrand(selected);
              }}
            >
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Category</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              label="Category"
              value={category?.id || ""}
              onChange={(e) => {
                const selected = categories.find(
                  (c) => c.id === e.target.value
                );
                if (selected) setCategory(selected);
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <EditorDescription
            description={description}
            onChange={(html) => setDescription(html)}
          ></EditorDescription>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
