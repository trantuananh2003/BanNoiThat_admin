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
import { string_to_slug } from "utils/commonFunctions";

interface DialogEditBrandProps {
  id: string;
  openDialogEditBrand: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

export default function DialogEditBrand({
  id,
  openDialogEditBrand,
  onClose,
  setRefresh,
}: DialogEditBrandProps) {
  const [brandName, setBrandName] = useState("");
  const [slug, setSlug] = useState("");
  useEffect(() => {
    const getBrand = async () => {
      try {
        const response: { result: Brand } = await clientAPI
          .service("brands")
          .get(id);
        setBrandName(response?.result?.name);
        setSlug(response?.result?.slug);
      } catch (error) {
        console.log("Error getting this brand: ", error);
      }
    };
    getBrand();
  }, [id]);
  const handleSaveBrand = async () => {
    const formData = new FormData();
    formData.append("Name", brandName);
    formData.append("Slug", slug);
    try {
      await clientAPI.service("Brands").put(id, formData);
    } catch (error) {
      console.error("Error saving new brand:", error);
    }
    setBrandName("");
    setSlug("");
    setRefresh((prev) => !prev);
  };
  return (
    <React.Fragment>
      <Dialog
        open={openDialogEditBrand}
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
        <DialogTitle>Edit brand</DialogTitle>
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
            onChange={(e) => {
              setBrandName(e.target.value);
              setSlug(string_to_slug(e.target.value));
            }}
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
          <Button type="submit" onClick={handleSaveBrand}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
