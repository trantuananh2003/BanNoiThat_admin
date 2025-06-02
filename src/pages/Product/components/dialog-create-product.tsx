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
import { toast } from "react-toastify";

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

interface DialogCreateProductInfoProps {
  openDialog: boolean;
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

export default function DialogCreateProductInfo({
  openDialog,
  onClose,
  setRefresh,
}: DialogCreateProductInfoProps) {
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
    const fetchCategories = async () => {
      const response = await clientAPI.service("Categories/admin").find();
      const categories = (response as { result: Category[] }).result;
      const children = categories
        .filter((c) => c.children && c.children.length > 0)
        .flatMap((c) => c.children);
      setCategories(children);
    };

    const fetchBrands = async () => {
      const response = await clientAPI.service("Brands").find();
      const brands = (response as { result: Brand[] }).result;
      setBrands(brands);
    };

    fetchCategories();
    fetchBrands();

    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, []);

  const handleCreateProduct = async () => {
    const formData = new FormData();
    formData.append("Name", productName);
    formData.append("Slug", slug);
    if (thumbnailUrl) {
      formData.append("ThumbnailImage", thumbnailUrl);
    }
    formData.append("Category_Id", category?.id || "");
    formData.append("Brand_Id", brand?.id || "");
    formData.append("Description", description);

    try {
      await clientAPI.service("products").create(formData);
      toast.success("Product created successfully!");
      setRefresh((prev) => !prev);

      // Reset form state
      setProductName("");
      setSlug("");
      setThumbnailUrl(undefined);
      setDescription("");
      setBrand(undefined);
      setCategory(undefined);
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(null);

      onClose();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={onClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleCreateProduct();
          },
        },
      }}
    >
      <DialogTitle>Create Product</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          label="Product Name"
          fullWidth
          variant="standard"
          value={productName}
          onChange={(e) => {
            setProductName(e.target.value);
            setSlug(string_to_slug(e.target.value));
          }}
        />
        <Box display="flex" alignItems="center" gap={2} mt={2}>
          <Button
            component="label"
            variant="contained"
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
          label="Slug"
          fullWidth
          variant="standard"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <FormControl fullWidth sx={{ m: 1 }} size="small">
          <InputLabel>Brand</InputLabel>
          <Select
            value={brand?.id || ""}
            label="Brand"
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
        <FormControl fullWidth sx={{ m: 1 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={category?.id || ""}
            label="Category"
            onChange={(e) => {
              const selected = categories.find((c) => c.id === e.target.value);
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Create</Button>
      </DialogActions>
    </Dialog>
  );
}
