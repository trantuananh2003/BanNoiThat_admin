import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Autocomplete,
  Chip,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import clientAPI from "client-api/rest-client";
import { toast } from "react-toastify";
import { string_to_slug } from "utils/commonFunctions";
import { format } from "date-fns";

const formatDateString = (input: Date | null): string => {
  if (!input || isNaN(input.getTime())) return "";
  return format(input, "dd-MM-yyyy HH:mm:ss");
};

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

interface DialogCreateSaleProgramProps {
  openDialogCreateSaleProgram: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DialogCreateSaleProgram({
  openDialogCreateSaleProgram,
  onClose,
  setRefresh,
}: DialogCreateSaleProgramProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [type, setType] = useState<"percent" | "fixed_amount">("percent");
  const [value, setValue] = useState<number>(0);
  const [maxDiscount, setMaxDiscount] = useState<number>(0);
  const [typeApply, setTypeApply] = useState<"brand" | "category">("brand");
  const [applyToIds, setApplyToIds] = useState<string[]>([]);
  const [slug, setSlug] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await clientAPI.service("Categories/admin").find();
        const categories = (response as { result: Category[] }).result;
        const children = categories
          .filter((c) => c.children && c.children.length > 0)
          .flatMap((c) => c.children);
        setCategories(children);
      } catch (err) {
        toast.error("Error fetching categories.");
        console.error(err);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await clientAPI.service("Brands").find();
        const brands = (response as { result: Brand[] }).result;
        setBrands(brands);
      } catch (err) {
        toast.error("Error fetching brands.");
        console.error(err);
      }
    };

    fetchCategories();
    fetchBrands();
  }, [typeApply]);

  const options = typeApply === "brand" ? brands : categories;

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("Description", description);
      formData.append("StartDate", formatDateString(startDate));
      formData.append("EndDate", formatDateString(endDate));
      formData.append("DiscountType", type);
      formData.append("DiscountValue", value.toString());
      formData.append("MaxDiscount", maxDiscount.toString());
      formData.append("ApplyType", typeApply);
      formData.append("ApplyValues", applyToIds.join(","));
      formData.append("Slug", slug);

      await clientAPI.service("saleprogram").create(formData);
      toast.success("Sale Program created successfully!");
      setName("");
      setDescription("");
      setStartDate(null);
      setEndDate(null);
      setType("percent");
      setValue(0);
      setMaxDiscount(0);
      setTypeApply("brand");
      setApplyToIds([]);
      setSlug("");
      setRefresh((prev) => !prev);
      onClose();
    } catch (err) {
      toast.error("Failed to create Sale Program.");
      console.error(err);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={openDialogCreateSaleProgram} onClose={onClose}>
        <DialogTitle>Create Sale Program</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Program Name"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(string_to_slug(e.target.value));
            }}
          />

          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <DateTimePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            format="dd/MM/yyyy HH:mm:ss"
            slotProps={{
              textField: { margin: "dense", variant: "standard", fullWidth: true },
            }}
          />

          <DateTimePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            format="dd/MM/yyyy HH:mm:ss"
            slotProps={{
              textField: { margin: "dense", variant: "standard", fullWidth: true },
            }}
          />

          <FormControl fullWidth margin="dense" variant="standard">
            <InputLabel>Discount Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value as any)}>
              <MenuItem value="percent">Percent</MenuItem>
              <MenuItem value="fixed_amount">Fixed Amount</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label={type === "percent" ? "Discount (%)" : "Fixed Discount"}
            type="number"
            fullWidth
            variant="standard"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />

          <TextField
            margin="dense"
            label="Max Discount"
            type="number"
            fullWidth
            variant="standard"
            value={maxDiscount}
            onChange={(e) => setMaxDiscount(Number(e.target.value))}
          />

          <FormControl fullWidth margin="dense" variant="standard">
            <InputLabel>Apply Type</InputLabel>
            <Select
              value={typeApply}
              onChange={(e) => {
                setTypeApply(e.target.value as any);
                setApplyToIds([]);
              }}
            >
              <MenuItem value="brand">Brand</MenuItem>
              <MenuItem value="category">Category</MenuItem>
            </Select>
          </FormControl>

          <Autocomplete
            multiple
            id="apply-to"
            options={options}
            getOptionLabel={(option) => option.name}
            value={options.filter((option) => applyToIds.includes(option.id))}
            onChange={(event, newValue) => {
              setApplyToIds(newValue.map((item) => item.id));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={
                  typeApply === "brand" ? "Select Brands" : "Select Subcategories"
                }
                margin="dense"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
            fullWidth
          />

          <TextField
            margin="dense"
            label="Slug"
            fullWidth
            variant="standard"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}