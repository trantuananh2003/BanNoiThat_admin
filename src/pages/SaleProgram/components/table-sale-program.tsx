import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  IconButton,
  InputAdornment,
  Paper,
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
import React, { useEffect, useState } from "react";
import DialogCreateSaleProgram from "./dialog-create-sale-program";
import BlockIcon from "@mui/icons-material/Block";
import { toast } from "react-toastify";
import DialogEditSaleProgram from "./dialog-edit-sale-program";

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  children: Category[];
}

interface SaleProgram {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  discountType: string;
  discountValue: number;
  maxDiscount: number;
  applyType: string;
  applyValues: string;
  isActive: boolean;
  productItems: any;
  status: string;
}

interface Column {
  id: keyof SaleProgram;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any, row?: SaleProgram) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "description", label: "Description", minWidth: 170 },
  {
    id: "startDate",
    label: "Start Date",
    minWidth: 120,
    format: (value) => new Date(value).toLocaleString(),
  },
  {
    id: "endDate",
    label: "End Date",
    minWidth: 120,
    format: (value) => new Date(value).toLocaleString(),
  },
  { id: "discountType", label: "Type", minWidth: 80 },
  {
    id: "discountValue",
    label: "Value",
    minWidth: 80,
    format: (value) => `${value}%`,
  },
  {
    id: "maxDiscount",
    label: "Max Discount",
    minWidth: 130,
    format: (value) => `${value.toLocaleString()}₫`,
  },
  {
    id: "applyType",
    label: "Apply Type",
    minWidth: 120,
  },
  {
    id: "applyValues",
    label: "Apply Values",
    minWidth: 135,
    format: (value, row) => value,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
  }
];

export default function TableSaleProgram() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<SaleProgram[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [openDialogCreateSaleProgram, setOpenDialogCreateSaleProgram] =
    React.useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleClickOpenDialogCreateSaleProgram = () => {
    setOpenDialogCreateSaleProgram(true);
  };

  const [openDialogEditSaleProgram, setOpenDialogEditSaleProgram] =
    React.useState(false);

  const handleClickOpenDialogEditSaleProgram = (id: string) => {
    setEditId(id);
    setOpenDialogEditSaleProgram(true);
  };

  useEffect(() => {
    const fetchSalePrograms = async () => {
      try {
        const response: { result: SaleProgram[] } = await clientAPI
          .service("saleprogram")
          .find();
        setData(response?.result);
      } catch (error) {
        console.error("Error fetching SalePrograms:", error);
        toast.error("Error fetching sale programs.");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await clientAPI.service("Categories/admin").find();
        const categories = (response as { result: Category[] }).result;
        const children = categories
          .filter((c) => c.children && c.children.length > 0)
          .flatMap((c) => c.children);
        setCategories(children);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Error fetching categories.");
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await clientAPI.service("Brands").find();
        const brands = (response as { result: Brand[] }).result;
        setBrands(brands);
      } catch (err) {
        console.error("Error fetching brands:", err);
        toast.error("Error fetching brands.");
      }
    };

    fetchSalePrograms();
    fetchCategories();
    fetchBrands();
  }, [refresh]);

  const getApplyValuesNames = (
    applyValues: string,
    applyType: string
  ): string => {
    if (!applyValues) return "";
    const ids = applyValues.split(",");
    const options = applyType === "brand" ? brands : categories;
    const names = ids
      .map((id) => {
        const item = options.find((option) => option.id === id);
        return item ? item.name : id;
      })
      .filter(Boolean)
      .join(", ");
    return names || "N/A";
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteSaleProgram = async (id: string, name: string) => {
    const confirmMessage = `Are you sure you want to delete the sale program "${name}"? This action cannot be undone.`;
    
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    try {
      await clientAPI.service("saleprogram").remove(id);
      setRefresh((prev) => !prev);
      toast.success(`Sale program "${name}" deleted successfully.`);
    } catch (error) {
      console.error("Error deleting sale program:", error);
      toast.error("Failed to delete sale program. Please try again.");
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleBlockOrUnblockSaleProgram = async (
    id: string,
    isActive: boolean
  ) => {
    const confirmMessage = isActive
      ? "Are you sure you want to unblock this sale program?"
      : "Are you sure you want to block this sale program?";

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    const formData = new FormData();
    formData.append("isActive", (!isActive).toString());
    try {
      await clientAPI.service("saleprogram").put(`${id}/set-active`, formData);
      setRefresh((prev) => !prev);

      toast.success(
        isActive
          ? "Sale program unblocked successfully."
          : "Sale program blocked successfully."
      );
    } catch (error) {
      console.error("Error blocking/unblocking sale program:", error);
      toast.error("Something went wrong. Please try again.");
    }
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
            placeholder="Search by name or description"
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
        </Stack>
        <Button onClick={() => handleClickOpenDialogCreateSaleProgram()}>
          CREATE NEW SALE PROGRAM
        </Button>
        <DialogCreateSaleProgram
          openDialogCreateSaleProgram={openDialogCreateSaleProgram}
          onClose={() => setOpenDialogCreateSaleProgram(false)}
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
              <TableCell key="action" style={{ minWidth: 150 }}>
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
                        {column.id === "applyValues" && column.format
                          ? getApplyValuesNames(value, row.applyType)
                          : column.format
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
                            "&:hover": { bgcolor: "primary.light" },
                          }}
                          onClick={() =>
                            handleClickOpenDialogEditSaleProgram(row.id)
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
                            "&:hover": { bgcolor: "error.light" },
                          }}
                          onClick={() => handleDeleteSaleProgram(row.id, row.name)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {row.isActive ? (
                        <Tooltip title="Unblock Sale Program" placement="top">
                          <IconButton
                            color="success"
                            size="small"
                            sx={{
                              bgcolor: "",
                              "&:hover": { bgcolor: "success.light" },
                            }}
                            onClick={() =>
                              handleBlockOrUnblockSaleProgram(
                                row.id,
                                row.isActive
                              )
                            }
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Block Sale Program" placement="top">
                          <IconButton
                            color="error"
                            size="small"
                            sx={{
                              bgcolor: "",
                              "&:hover": { bgcolor: "error.light" },
                            }}
                            onClick={() =>
                              handleBlockOrUnblockSaleProgram(
                                row.id,
                                row.isActive
                              )
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
      <DialogEditSaleProgram
        id={editId}
        openDialogEditSaleProgram={openDialogEditSaleProgram}
        onClose={() => setOpenDialogEditSaleProgram(false)}
        setRefresh={setRefresh}
      />
    </Paper>
  );
}