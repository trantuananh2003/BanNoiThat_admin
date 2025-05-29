// Optimized full React component with MUI and TypeScript

import {
  Build,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
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
import { useEffect, useState } from "react";
import DialogEditProductInfo from "./dialog-edit-product-info";
import DialogEditProductItem from "./dialog-edit-product-item";
import DialogCreateProductInfo from "./dialog-create-product";
import { toast, ToastContainer } from "react-toastify";

interface Column {
  id: keyof Product | "category.name" | "brand.name";
  label: string;
  minWidth?: number;
  align?: "right";
}

const columns: readonly Column[] = [
  { id: "name", label: "Product Name", minWidth: 170 },
  { id: "category.name", label: "Category Name", minWidth: 170 },
  { id: "brand.name", label: "Brand Name", minWidth: 140 },
  { id: "slug", label: "Slug", minWidth: 100 },
  { id: "thumbnailUrl", label: "Image", minWidth: 100 },
  { id: "description", label: "Description", minWidth: 170 },
  { id: "keyword", label: "Keyword", minWidth: 130 },
];

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

interface Product {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl: string;
  keyword: string;
  featured: boolean;
  visible: boolean;
  categoryId: string;
  brandId: string;
  description: string;
  isDeleted: boolean;
  category?: Category;
  brand?: Brand;
}

interface PaginationDto {
  CurrentPage: number;
  PageSize: number;
  TotalRecords: number;
}

interface ProductResponse {
  data: { result: Product[]; isSuccess: boolean; errorMessages: string[] };
  pagination: PaginationDto;
}

export default function TableProduct() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [editId, setEditId] = useState("");
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [openEditInfoDialog, setOpenEditInfoDialog] = useState(false);
  const [openEditItemDialog, setOpenEditItemDialog] = useState(false);

  const fetchProducts = async () => {
    try {
      const response: ProductResponse = await clientAPI
        .service("products")
        .findPagedList(
          `pageSize=${rowsPerPage}&pageCurrent=${page + 1}&IsDeleted=false&StringSearch=${searchTerm}`
        );
      setData(response.data.result);
      setTotalCount(response.pagination.TotalRecords);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, refresh]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const getNestedValue = (obj: any, path: string): any =>
    path.split(".").reduce((acc, key) => acc?.[key], obj);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenCreateProduct = () => {
    setOpenCreateProductDialog(true);
  };

  const handleOpenEditInfo = (id: string) => {
    setEditId(id);
    setOpenEditInfoDialog(true);
  };

  const handleOpenEditItem = (id: string) => {
    setEditId(id);
    setOpenEditItemDialog(true);
  };

  function stripHtmlTags(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  const slugs = Array.from(new Set(data.map((item) => item.slug)));

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await clientAPI.service("products").remove(id);
        setRefresh((prev) => !prev);
        toast.success("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product.");
      }
    }
  };

  return (
    <Paper
      sx={{ width: "100%", overflow: "hidden", borderRadius: 3, boxShadow: 5 }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          px: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by product name"
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
            <Select
              value={filter}
              label="Slug"
              onChange={(e) => setFilter(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All</MenuItem>
              {slugs.map((slug) => (
                <MenuItem key={slug} value={slug}>
                  {slug}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Button
          onClick={() => {
            handleOpenCreateProduct();
          }}
        >
          CREATE NEW PRODUCT
        </Button>
      </Toolbar>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: "#1976d2",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell
                style={{
                  minWidth: 120,
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .filter((product) => filter === "all" || product.slug === filter)
              .map((row) => (
                <TableRow hover key={row.id}>
                  {columns.map((column) => {
                    const value = getNestedValue(row, column.id);
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === "thumbnailUrl" ? (
                          <img
                            src={value}
                            alt="Thumbnail"
                            style={{
                              width: 60,
                              height: 60,
                              cursor: "pointer",
                              borderRadius: 4,
                            }}
                            onClick={() => setSelectedImage(value)}
                          />
                        ) : column.id === "description" &&
                          typeof value === "string" ? (
                          stripHtmlTags(value).length > 50 ? (
                            `${stripHtmlTags(value).slice(0, 50)}...`
                          ) : (
                            stripHtmlTags(value)
                          )
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenEditInfo(row.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        startIcon={<Build fontSize="small" />}
                        sx={{ borderRadius: 5, textTransform: "none" }}
                        onClick={() => handleOpenEditItem(row.id)}
                      >
                        Phân loại
                      </Button>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteProduct(row.id)}
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
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ backgroundColor: "#f9f9f9", borderTop: "1px solid #e0e0e0" }}
      />

      {selectedImage && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300,
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 8,
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          />
        </Box>
      )}

      <DialogCreateProductInfo
        openDialog={openCreateProductDialog}
        onClose={() => setOpenCreateProductDialog(false)}
        setRefresh={setRefresh}
      />

      <DialogEditProductInfo
        id={editId}
        openDialogEditProductInfo={openEditInfoDialog}
        onClose={() => setOpenEditInfoDialog(false)}
        setRefresh={setRefresh}
      />

      <DialogEditProductItem
        id={editId}
        openDialogEditProductItem={openEditItemDialog}
        onClose={() => setOpenEditItemDialog(false)}
        setRefresh={setRefresh}
      />
    </Paper>
  );
}
