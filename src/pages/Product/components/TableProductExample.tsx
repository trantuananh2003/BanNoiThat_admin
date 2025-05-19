import clientAPI from "client-api/rest-client";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
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
import { Build } from "@mui/icons-material";
import EditProductItemExample from "./EditProductItemExample";

interface Column {
  id:
    | "name"
    | "category.name"
    | "brand.name"
    | "slug"
    | "thumbnailUrl"
    | "description"
    | "keyword";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
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
  thumbnailFile?: File;
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

type ProductResponse = {
  data: {
    result: Product[];
    isSuccess: boolean;
    errorMessages: string[];
  };
  pagination: PaginationDto;
};

export default function TableProductExample() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<Product[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentStatusProduct, setCurrentStatusProduct] =
    useState<Boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditProductItemModalVisible, setIsEditProductItemsModalVisible] =
    useState(false);
  const [count, setCount] = useState<number>(0);

  const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: ProductResponse = await clientAPI
          .service("products")
          .findPagedList(
            `pageSize=${rowsPerPage}&pageCurrent=${page + 1}&IsDeleted=${currentStatusProduct}`
          );
        setData(response.data.result);
        setCount(response.pagination.TotalRecords);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      const responseDataCategories = await clientAPI
        .service("Categories/admin")
        .find();
      const categories = (responseDataCategories as { result: Category[] })
        .result;
      const childrenFilter = categories.filter(
        (category) => category.children && category.children.length > 0
      );
      const childrenCategories = childrenFilter.flatMap(
        (category) => category.children
      );
      setCategories(childrenCategories);
    };

    const fetchBrands = async () => {
      const responseDataBrands = await clientAPI.service("Brands").find();
      const brands = (responseDataBrands as { result: Brand[] }).result;
      setBrands(brands);
    };
    fetchCategories();
    fetchBrands();
    fetchProducts();
  }, [page, rowsPerPage, currentStatusProduct]);

  // const filteredData = data.filter((product) => {
  //   const matchesSearch = product.name
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());
  //   const matchesFilter = filter === "all" || product.slug === filter;
  //   return matchesSearch && matchesFilter;
  // });

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

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  const handleEditProductItem = (id: string) => {
    setEditId(id);
    setIsEditProductItemsModalVisible(true);
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
              {Array.from(new Set(data.map((item) => item.slug))).map(
                (slug) => (
                  <MenuItem key={slug} value={slug}>
                    {slug}
                  </MenuItem>
                )
              )}
            </Select>
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
            {data.map((row) => (
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
                      ) : (
                        value
                      )}
                    </TableCell>
                  );
                })}
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {editId === row.id ? (
                      <Tooltip title="Save" placement="top">
                        <IconButton color="success" size="small">
                          <SaveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Edit" placement="top">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => setOpenDialog(true)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      startIcon={<Build fontSize="small" />}
                      sx={{ borderRadius: 5, textTransform: "none" }}
                      onClick={() => handleEdit(row.id)}
                    >
                      Phân loại
                    </Button>
                    <Tooltip title="Delete" placement="top">
                      <IconButton color="error" size="small">
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
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ backgroundColor: "#f9f9f9", borderTop: "1px solid #e0e0e0" }}
      />

      {/* Image Overlay */}
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
      <EditProductItemExample
        productId={editId}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </Paper>
  );
}
