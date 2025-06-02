import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import clientAPI from "client-api/rest-client";
import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Role {
  id: string;
  name: string;
}

interface DialogSetRoleUserProps {
  id: string; // user id
  role_Id: string; // current role id
  openDialogSetRoleUser: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DialogSetRoleUser({
  id,
  role_Id,
  openDialogSetRoleUser,
  onClose,
  setRefresh,
}: DialogSetRoleUserProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res: { result: Role[] } = await clientAPI.service("roles").get("");
        setRoles(res.result);
        setSelectedRole(role_Id); // preselect current role
      } catch (error) {
        console.error("Failed to fetch roles", error);
      }
    };

    if (openDialogSetRoleUser) {
      fetchRoles();
    }
  }, [openDialogSetRoleUser, role_Id]);

  const handleChange = (event: any) => {
    setSelectedRole(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error("Vui lòng chọn role");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("roleId", selectedRole);

      await clientAPI.service(`users/${id}/set-role`).create(formData);
      toast.success("Cập nhật quyền thành công");
      setRefresh((prev) => !prev);
      onClose();
    } catch (error) {
      console.error("Failed to update role", error);
      toast.error("Cập nhật quyền thất bại");
    }
  };

  return (
    <Dialog open={openDialogSetRoleUser} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chọn vai trò cho người dùng</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="select-role-label">Vai trò</InputLabel>
          <Select
            labelId="select-role-label"
            value={selectedRole}
            onChange={handleChange}
            label="Vai trò"
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
