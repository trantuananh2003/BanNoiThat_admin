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

interface DialogCreateCategoryProps {
  Parent_Id: string;
  openDialogCreateCategory: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DialogCreateCategory({
  Parent_Id,
  openDialogCreateCategory,
  onClose,
  setRefresh,
}: DialogCreateCategoryProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File>();
  const [slug, setSlug] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (categoryImage) {
      const imageUrl = URL.createObjectURL(categoryImage);
      setPreviewImage(imageUrl);

      return () => URL.revokeObjectURL(imageUrl); // cleanup
    } else {
      setPreviewImage(null);
    }
  }, [categoryImage]);

  const handleSaveNewCategory = async () => {
    const formData = new FormData();
    formData.append("Name", categoryName);
    formData.append("Slug", slug);
    formData.append("Parent_Id", Parent_Id);
    if (categoryImage) {
      formData.append("CategoryImage", categoryImage);
    }
    try {
      await clientAPI.service("Categories").create(formData);
      onClose();
    } catch (error) {
      console.error("Error saving new category:", error);
    }
    setCategoryName("");
    setSlug("");
    setRefresh((prev) => !prev);
  };

  return (
    <React.Fragment>
      <Dialog
        open={openDialogCreateCategory}
        onClose={onClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const email = formJson.email;
              onClose();
            },
          },
        }}
      >
        <DialogTitle>Create new category</DialogTitle>
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
                  if (file) setCategoryImage(file);
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
          <Button onClick={handleSaveNewCategory}>Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
