import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import clientAPI from "client-api/rest-client";
import * as React from "react";
import { useEffect, useState } from "react";

interface DialogCreateBrandProps {
  openDialogCreateBrand: boolean;
  onClose: () => void;
}

export default function DialogCreateBrand({
  openDialogCreateBrand,
  onClose,
}: DialogCreateBrandProps) {
  const [brandName, setBrandName] = useState("");
  const [slug, setSlug] = useState("");
  const handleSaveNewBrand = async () => {
    const formData = new FormData();
    formData.append('Name', brandName);
    formData.append('Slug', slug);
    try {
      await clientAPI.service('Brands').create(formData);
    } catch (error) {
      console.error('Error saving new brand:', error);
    }
  }
  return (
    <React.Fragment>
      <Dialog
        open={openDialogCreateBrand}
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
        <DialogTitle>Create new brand</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="brandName"
            name="brandName"
            label="Brand Name"
            type="text"
            fullWidth
            variant="standard"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
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
          <Button type="submit" onClick={handleSaveNewBrand}>Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
