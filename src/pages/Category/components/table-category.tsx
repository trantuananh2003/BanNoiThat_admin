import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  FormControl,
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
  Typography,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import clientAPI from "client-api/rest-client";
import DialogCreateCategory from "./dialog-create-category";
import DialogEditCategory from "./dialog-edit-category";
import { toast, ToastContainer } from "react-toastify";

interface Column {
  id: "id" | "name" | "categoryUrlImage" | "slug"; //| "parent_Id";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "id", label: "ID", minWidth: 100 },
  { id: "name", label: "Category Name", minWidth: 170 },
  { id: "categoryUrlImage", label: "Category Image", minWidth: 170 },
  { id: "slug", label: "Slug", minWidth: 170 },
  //{ id: "parent_Id", label: "Parent ID", minWidth: 100 },
];

interface Category {
  id: string;
  name: string;
  categoryUrlImage: string | null;
  parent_Id: string | null;
  slug: string;
  children: Category[];
}

function Row({
  row,
  setRefresh,
}: {
  row: Category;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [openDialogCreateCategory, setOpenDialogCreateCategory] =
    React.useState(false);
  const handleClickOpenDialogCreateCategory = () => {
    setOpenDialogCreateCategory(true);
  };
  const [editId, setEditId] = useState("");

  const handleDelete = async (id: string) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this category?");
      if (!confirmDelete) return;

      try {
        await clientAPI.service("categories").remove(id);
        toast.success("Category deleted successfully");
        setRefresh((prev) => !prev);
      } catch (error: any) {
        console.log(error);
        const message = error?.response?.data?.errorMessages[0] || "Failed to delete category";
        toast.error(message);
      }
    };

  const [openDialogEditCategory, setOpenDialogEditCategory] = useState(false);
  const handleClickOpenDialogEditCategory = (id: string) => {
    setEditId(id);
    setOpenDialogEditCategory(true);
  };
  return (
    <>
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
              boxShadow: "0 0 20px rgba(255,255,255,0.3)",
            }}
          />
        </Box>
      )}
      <TableRow hover>
        <TableCell>
          {row.children.length >= 0 && (
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>
          {row.categoryUrlImage ? (
            <img
              src={row.categoryUrlImage}
              alt="category"
              onClick={() => setSelectedImage(row.categoryUrlImage!)}
              style={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          ) : (
            "No Image"
          )}
        </TableCell>
        {/* <TableCell>{row.parent_Id}</TableCell> */}
        <TableCell>{row.slug}</TableCell>
        <TableCell>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleClickOpenDialogEditCategory(row.id)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <DialogEditCategory
              id={editId}
              openDialogEditCategory={openDialogEditCategory}
              onClose={() => setOpenDialogEditCategory(false)}
              setRefresh={setRefresh}
            />
            <Tooltip title="Delete">
              <IconButton color="error" size="small" onClick={() => handleDelete(row.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>

      {row.children.length >= 0 && (
        <TableRow>
          <TableCell
            style={{ paddingLeft: 50, paddingBottom: 0, paddingTop: 0 }}
            colSpan={6}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="subtitle1" gutterBottom>
                  Subcategories
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Parent ID</TableCell>
                      <TableCell>Slug</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleClickOpenDialogCreateCategory()}
                        >
                          CREATE NEW SUBCATEGORY
                        </Button>
                        <DialogCreateCategory
                          Parent_Id={row.id}
                          openDialogCreateCategory={openDialogCreateCategory}
                          onClose={() => setOpenDialogCreateCategory(false)}
                          setRefresh={setRefresh}
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.children.map((child) => (
                      <TableRow key={child.id}>
                        <TableCell>{child.id}</TableCell>
                        <TableCell>{child.name}</TableCell>
                        <TableCell>
                          {child.categoryUrlImage ? (
                            <img
                              src={child.categoryUrlImage}
                              alt="subcategory"
                              onClick={() =>
                                setSelectedImage(child.categoryUrlImage!)
                              }
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </TableCell>
                        <TableCell>{child.parent_Id}</TableCell>
                        <TableCell>{child.slug}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Edit">
                              <IconButton color="primary" size="small" onClick={() => handleClickOpenDialogEditCategory(child.id)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
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
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function TableCategoryWithCollapse() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openDialogCreateCategory, setOpenDialogCreateCategory] =
    React.useState(false);

  const handleClickOpenDialogCreateCategory = () => {
    setOpenDialogCreateCategory(true);
  };
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = (await clientAPI
          .service("Categories/admin")
          .find()) as {
          isSuccess: boolean;
          result: Category[];
          errorMessages?: string[];
        };
        console.log(response);
        if (response.isSuccess) {
          setData(response.result);
        } else {
          console.error("Error fetching categories:", response.errorMessages);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [refresh]);

  const filteredData = data.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper
      sx={{ width: "100%", overflow: "hidden", borderRadius: 3, boxShadow: 5 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by category name"
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
        <Button onClick={() => handleClickOpenDialogCreateCategory()}>
          CREATE NEW CATEGORY
        </Button>
        <DialogCreateCategory
          Parent_Id=""
          openDialogCreateCategory={openDialogCreateCategory}
          onClose={() => setOpenDialogCreateCategory(false)}
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
              <TableCell />
              {columns.map((col) => (
                <TableCell key={col.id} style={{ minWidth: col.minWidth }}>
                  {col.label}
                </TableCell>
              ))}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <Row key={row.id} row={row} setRefresh={setRefresh} />
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
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(+e.target.value);
          setPage(0);
        }}
      />
    </Paper>
  );
}
