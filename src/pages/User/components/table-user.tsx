import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import BlockIcon from "@mui/icons-material/Block";
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
import { toast } from "react-toastify";
import DialogSetRoleUser from "./dialog-set-role-user";

interface Column {
  id: "id" | "fullName" | "email" | "roleName" | "isBlocked";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "id", label: "ID", minWidth: 170 },
  { id: "fullName", label: "Full Name", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "roleName", label: "Role", minWidth: 100 },
];

interface User {
  id: string;
  fullName: string;
  email: string;
  isMale: string;
  role_Id: string;
  roleName: string;
  birthday: string;
  isBlocked: boolean;
}

export default function TableUser() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState<string>("");
  const [roleId, setRoleId] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: { result: User[] } = await clientAPI
          .service("users")
          .find(`pageCurrent=${1}&pageSize=${10}`);
        setData(response.result);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [editId, refresh]);
  const filteredData = data.filter((user) => {
    const matchesSearchByName = user.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSearchByEmail = user.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all"; // || user.slug === filter;
    return (matchesSearchByName || matchesSearchByEmail) && matchesFilter;
  });

  const handleEdit = (id: string) => {
    setEditId(id);
  };

  const handleBlockOrUnblockUser = async (id: string, isBlocked: boolean) => {
    const confirmMessage = isBlocked
      ? "Are you sure you want to unblock this account?"
      : "Are you sure you want to block this account?";

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    const formData = new FormData();
    formData.append("isblock", (!isBlocked).toString());
    try {
      await clientAPI.service("users").put(`${id}/is-block`, formData);
      setRefresh((prev) => !prev);

      toast.success(
        isBlocked
          ? "Account unblocked successfully."
          : "Account blocked successfully."
      );
    } catch (error) {
      console.error("Error blocking/unblocking account:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [openDialogSetRoleUser, setOpenDialogSetRoleUser] =
    React.useState(false);
  const handleClickOpenDialogSetRoleUser = (id: string, role_Id: string) => {
    setEditId(id);
    setRoleId(role_Id);
    setOpenDialogSetRoleUser(true);
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
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small">
            <InputLabel>Slug</InputLabel>
            {/* <Select
                  value={filter}
                  label="Slug"
                  onChange={(e) => setFilter(e.target.value)}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="all">All</MenuItem>
                  {Array.from(new Set(data.map((item) => item.slug))).map(
                    (slug) => (
                      <MenuItem key={slug} value={slug}>
                        {slug}
                      </MenuItem>
                    )
                  )}
                </Select> */}
          </FormControl>
        </Stack>
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
                    const value = row[column.id];
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
                            handleClickOpenDialogSetRoleUser(
                              row.id,
                              row.role_Id
                            )
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {row.isBlocked ? (
                        <Tooltip title="Unblock Account" placement="top">
                          <IconButton
                            color="success"
                            size="small"
                            sx={{
                              bgcolor: "",
                              "&:hover": { bgcolor: "success.light" },
                            }}
                            onClick={() =>
                              handleBlockOrUnblockUser(row.id, row.isBlocked)
                            }
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Block Account" placement="top">
                          <IconButton
                            color="error"
                            size="small"
                            sx={{
                              bgcolor: "",
                              "&:hover": { bgcolor: "error.light" },
                            }}
                            onClick={() =>
                              handleBlockOrUnblockUser(row.id, row.isBlocked)
                            }
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <DialogSetRoleUser
          id={editId}
          role_Id={roleId}
          openDialogSetRoleUser={openDialogSetRoleUser}
          onClose={() => setOpenDialogSetRoleUser(false)}
          setRefresh={setRefresh}
        />
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
