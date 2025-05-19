import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import clientAPI from "client-api/rest-client";
import * as React from "react";

interface DialogConfirmOrderProps {
  orderId: string;
  openDialogConfirmOrder: boolean;
  onClose: () => void;
}
export default function DialogConfirmOrder({
  orderId,
  openDialogConfirmOrder,
  onClose,
}: DialogConfirmOrderProps) {
  const [addressCode, setAddressCode] = React.useState("");
  const [transferService, setTransferService] = React.useState("");
  const handleConfirmOrder = async () => {
    const formData = new FormData();
    formData.append('AddressCode', addressCode);
    formData.append('TransferService', transferService);
    try {
      await clientAPI.service('Orders').put(`${orderId}/approve`, formData);
    } catch (error) {
      console.error('Error saving confirm order:', error);
    }
  }
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
            label="Address Code"
            type="text"
            fullWidth
            variant="standard"
            value={addressCode}
            onChange={(e) => setAddressCode(e.target.value)}
          />
          <TextField
            required
            margin="dense"
            id="transferService"
            name="transferService"
            label="Transfer Service"
            type="text"
            fullWidth
            variant="standard"
            value={transferService}
            onChange={(e) => setTransferService(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleConfirmOrder}>Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
