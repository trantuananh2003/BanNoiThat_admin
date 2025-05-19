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

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryUrlImage: string;
}

export default function DialogEditCategory({
  id,
  openDialogEditProductInfo,
  onClose,
  setRefresh,
}: DialogEditProductInfoProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File>();
  const [slug, setSlug] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [initialCategory, setInitialCategory] = useState<Product | null>(null);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response: { result: Product } = await clientAPI
          .service("categories")
          .get(id);
        setCategoryName(response.result.name);
        setSlug(response.result.slug);
        setPreviewImage(response.result.categoryUrlImage);
        setInitialCategory(response.result);
      } catch (error) {
        console.log("Error getting this category: ", error);
      }
    };

    if (id) {
      getCategory();
    }

    // Cleanup nếu dùng blob image từ upload
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [id]);

  const handleSaveCategory = async () => {
    const hasChanges =
      categoryName !== initialCategory?.name ||
      slug !== initialCategory?.slug ||
      categoryImage;

    if (!hasChanges) {
      onClose();
      return;
    }

    const formData = new FormData();
    formData.append("Name", categoryName);
    formData.append("Slug", slug);
    if (categoryImage) {
      formData.append("FileImage", categoryImage);
    }

    try {
      await clientAPI.service("Categories").put(id, formData);
      setRefresh((prev) => !prev);
      onClose();
    } catch (error) {
      console.error("Error saving new category:", error);
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
              handleSaveCategory();
            },
          },
        }}
      >
        <DialogTitle>Edit category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="categoryName"
            name="categoryName"
            label="Category Name"
            type="text"
            fullWidth
            variant="standard"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
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
                    setCategoryImage(file);
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
