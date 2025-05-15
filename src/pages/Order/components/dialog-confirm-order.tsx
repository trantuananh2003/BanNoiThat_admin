import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import * as React from "react";


interface DialogConfirmOrderProps {
  openDialogConfirmOrder: boolean;
  onClose: () => void;
}
export default function DialogConfirmOrder({
  openDialogConfirmOrder, onClose
}: DialogConfirmOrderProps) {

  return (
    <React.Fragment>
      <Dialog
        open={openDialogConfirmOrder}
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
        <DialogTitle>Confirm order</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="AddressCode"
            name="AddressCode"
            label="AddressCode"
            type="text"
            fullWidth
            variant="standard"
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
