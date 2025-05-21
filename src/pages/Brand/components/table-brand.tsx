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
import DialogCreateBrand from "./dialog-create-brand";
import DialogEditBrand from "./dialog-edit-brand";

interface Column {
  id: "name" | "slug";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Brand Name", minWidth: 170 },
  { id: "slug", label: "Slug", minWidth: 100 },
];

interface Brand {
  id: string;
  name: string;
  slug: string;
}

export default function TableBrandExample() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<Brand[]>([]);
  const [editId, setEditId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [openDialogCreateBrand, setOpenDialogCreateBrand] =
    React.useState(false);
  const [refresh, setRefresh] = useState(false);
  const handleClickOpenDialogCreateBrand = () => {
    setOpenDialogCreateBrand(true);
  };

  const [openDialogEditBrand, setOpenDialogEditBrand] = React.useState(false);

  const handleClickOpenDialogEditBrand = (id: string) => {
    setEditId(id);
    setOpenDialogEditBrand(true);
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response: { result: Brand[] } = await clientAPI
          .service("Brands")
          .find();
        setData(response.result);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, [refresh]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (id: string) => {
    setEditId(id);
  };

  const filteredData = data.filter((brand) => {
    const matchesSearch = brand.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || brand.slug === filter;
    return matchesSearch && matchesFilter;
  });

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
            placeholder="Search by brand name"
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
          {/* <FormControl size="small">
            <InputLabel>Slug</InputLabel>
            <Select
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
            </Select>
          </FormControl> */}
        </Stack>
        <Button onClick={() => handleClickOpenDialogCreateBrand()}>
          CREATE NEW BRAND
        </Button>
        <DialogCreateBrand
          openDialogCreateBrand={openDialogCreateBrand}
          onClose={() => setOpenDialogCreateBrand(false)}
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
                          onClick={() => handleClickOpenDialogEditBrand(row.id)}
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
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
      <DialogEditBrand
        id={editId}
        openDialogEditBrand={openDialogEditBrand}
        onClose={() => setOpenDialogEditBrand(false)}
        setRefresh={setRefresh}
      />
    </Paper>
  );
}
