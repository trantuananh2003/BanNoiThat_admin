import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
} from "@mui/material";
import clientAPI from "client-api/rest-client";
import * as React from "react";
import { useEffect, useState } from "react";
import DialogCreateRole from "./dialog-create-role";
import DialogEditPermissionRole from "./dialog-edit-permission-role";
import { toast } from "react-toastify";

interface Column {
  id: "id" | "name" | "roleClaims.claimValue";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "id", label: "ID", minWidth: 170 },
  { id: "name", label: "Role Name", minWidth: 100 },
  { id: "roleClaims.claimValue", label: "Role Claims", minWidth: 100 },
];

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

export default function TableRole() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [openDialogCreateRole, setOpenDialogCreateRole] = React.useState(false);

  const handleClickOpenDialogCreateRole = () => {
    setOpenDialogCreateRole(true);
  };

  const [openDialogEditPermissionRole, setOpenDialogEditPermissionRole] =
    React.useState(false);
  const handleClickOpenDialogEditPermissionRole = (id: string) => {
    setEditId(id);
    setOpenDialogEditPermissionRole(true);
  };

  const handleDeleteRole = async (id: string, name: string) => {
    const confirmMessage = `Are you sure you want to delete the role "${name}"? This action cannot be undone.`;
    
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    try {
      await clientAPI.service("roles").remove(id);
      setRefresh((prev) => !prev);
      toast.success(`Role "${name}" deleted successfully.`);
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role. Please try again.");
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response: { result: Role[] } = await clientAPI
          .service("roles")
          .find("");
        setData(response.result);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Error fetching roles.");
      }
    };
    fetchRoles();
  }, [editId, refresh]);

  const filteredData = data.filter((role) => {
    const matchesFilter = filter === "all";
    return matchesFilter;
  });

  const getNestedValue = (obj: any, path: string): any =>
    path.split(".").reduce((acc, key) => acc?.[key], obj);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 3,
        boxShadow: 5,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          paddingX: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <FormControl size="small">
            <InputLabel>Slug</InputLabel>
          </FormControl>
        </Stack>
        <Button
          onClick={() => {
            handleClickOpenDialogCreateRole();
          }}
        >
          CREATE NEW ROLE
        </Button>
        <DialogCreateRole
          openDialogCreateRole={openDialogCreateRole}
          onClose={() => setOpenDialogCreateRole(false)}
          setRefresh={setRefresh}
        />
      </Toolbar>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "primary.main",
                "& th": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1rem",
                },
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell key="action" style={{ minWidth: 120 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  {columns.map((column) => {
                    let value;

                    if (column.id === "roleClaims.claimValue") {
                      value = row.roleClaims
                        ?.map((rc) => rc.claimValue)
                        .join(", ");
                    } else {
                      value = getNestedValue(row, column.id);
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit" placement="top">
                        <IconButton
                          color="primary"
                          size="small"
                          sx={{
                            bgcolor: "",
                            "&:hover": { bgcolor: "primary.light" },
                          }}
                          onClick={() =>
                            handleClickOpenDialogEditPermissionRole(row.id)
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top">
                        <IconButton
                          color="error"
                          size="small"
                          sx={{
                            bgcolor: "",
                            "&:hover": { bgcolor: "error.light" },
                          }}
                          onClick={() => handleDeleteRole(row.id, row.name)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            <DialogEditPermissionRole
              id={editId}
              openDialogEditPermissionRole={openDialogEditPermissionRole}
              onClose={() => setOpenDialogEditPermissionRole(false)}
              setRefresh={setRefresh}
            />
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          backgroundColor: "#f9f9f9",
          borderTop: "1px solid #e0e0e0",
        }}
      />
    </Paper>
  );
}