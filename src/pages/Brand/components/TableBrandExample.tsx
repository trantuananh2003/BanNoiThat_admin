import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import clientAPI from "client-api/rest-client";
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

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
  const [editId, setEditId] = useState<string | null>(null);

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
  }, [editId]);

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

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 3,
        boxShadow: 5,
      }}
    >
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
            {data
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
                      {editId === row.id ? (
                        <Tooltip title="Save" placement="top">
                          <IconButton
                            color="success"
                            size="small"
                            //sx={{ bgcolor: "success.light", "&:hover": { bgcolor: "success.main" } }}
                            sx={{
                              bgcolor: "",
                              "&:hover": { bgcolor: "success.light" },
                            }}
                          >
                            <SaveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Edit" placement="top">
                          <IconButton
                            color="primary"
                            size="small"
                            //sx={{ bgcolor: "primary.light", "&:hover": { bgcolor: "primary.main" } }}
                            sx={{
                              bgcolor: "",
                              "&:hover": { bgcolor: "primary.light" },
                            }}
                            onClick={() => handleEdit(row.id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete" placement="top">
                        <IconButton
                          color="error"
                          size="small"
                          //sx={{ bgcolor: "error.light", "&:hover": { bgcolor: "error.main" } }}
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
        count={data.length}
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
