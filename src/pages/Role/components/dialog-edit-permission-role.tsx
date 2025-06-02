import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import clientAPI from "client-api/rest-client";
import * as React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

interface RoleClaims {
  id: string;
  role_Id: string;
  claimType: string;
  claimValue: string;
}

interface Role {
  id: string;
  name: string;
  roleClaims: RoleClaims[];
}

interface DialogEditPermissionRoleProps {
  id: string;
  openDialogEditPermissionRole: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Permission {
  label: string;
  value: string;
}

interface PermissionResponse {
  result: {
    [key: string]: string;
  };
}

export default function DialogEditPermissionRole({
  id,
  openDialogEditPermissionRole,
  onClose,
  setRefresh,
}: DialogEditPermissionRoleProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [assignedClaims, setAssignedClaims] = useState<RoleClaims[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách permission
        const permissionRes: PermissionResponse = await clientAPI
          .service("roles/permissions")
          .get("");
        const perms = Object.entries(permissionRes.result).map(([key, value]) => ({
          label: key,
          value: value,
        }));
        setPermissions(perms);

        // Lấy role hiện tại
        const roleRes: { result: Role } = await clientAPI.service("roles").get(id);
        setAssignedClaims(roleRes.result.roleClaims || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    if (openDialogEditPermissionRole) {
      fetchData();
    }
  }, [id, openDialogEditPermissionRole]);

  const handleAddPermission = async (permissionValue: string) => {
    try {
      const formData = new FormData();
      formData.append("PermissionName", permissionValue);

      await clientAPI.service(`Roles/${id}/role-claims`).create(formData);
      toast.success("Permission added");

      // Cập nhật lại danh sách claims
      const updatedRole: { result: Role } = await clientAPI.service("roles").get(id);
      setAssignedClaims(updatedRole.result.roleClaims || []);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Add permission failed:", error);
      toast.error("Add permission failed");
    }
  };

  const handleRemovePermission = async (claimId: string) => {
    try {
      await clientAPI.service(`Roles/${id}/role-claims`).remove(claimId);
      toast.success("Permission removed");

      // Cập nhật lại danh sách claims
      const updatedRole: { result: Role } = await clientAPI.service("roles").get(id);
      setAssignedClaims(updatedRole.result.roleClaims || []);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Remove permission failed:", error);
      toast.error("Remove permission failed");
    }
  };

  const isPermissionAssigned = (value: string) => {
    return assignedClaims.find((claim) => claim.claimValue === value);
  };

  return (
    <Dialog open={openDialogEditPermissionRole} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Permissions for Role ID: {id}</DialogTitle>
      <DialogContent>
        {permissions.map((perm) => {
          const assigned = isPermissionAssigned(perm.value);
          return (
            <div key={perm.value} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <div style={{ flexGrow: 1 }}>{perm.label}</div>
              {assigned ? (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemovePermission(assigned.id)}
                >
                  Xóa
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleAddPermission(perm.value)}
                >
                  Thêm
                </Button>
              )}
            </div>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
