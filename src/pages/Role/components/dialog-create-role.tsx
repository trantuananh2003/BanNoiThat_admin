import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import clientAPI from "client-api/rest-client";
import * as React from "react";
import { useState } from "react";
import { string_to_slug } from "utils/commonFunctions";
import { toast } from "react-toastify";

interface DialogCreateRoleProps {
  openDialogCreateRole: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DialogCreateRole({
  openDialogCreateRole,
  onClose,
  setRefresh,
}: DialogCreateRoleProps) {
  const [roleName, setRoleName] = useState("");
  const handleSaveNewRole = async () => {
    const formData = new FormData();
    formData.append("NameRole", roleName);

    try {
      await clientAPI.service("Roles").create(formData);
      setRoleName("");
      setRefresh((prev) => !prev);
      toast.success("Role added successfully!");
    } catch (error) {
      console.error("Error saving new role:", error);
      toast.error("Failed to add role. Please try again.");
    }
  };
  const handleOnChangeRoleName = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {};
  return (
    <React.Fragment>
      <Dialog
        open={openDialogCreateRole}
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
        <DialogTitle>Create new role</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="roleName"
            name="roleName"
            label="Role Name"
            type="text"
            fullWidth
            variant="standard"
            value={roleName}
            onChange={(e) => {
              setRoleName(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSaveNewRole}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
