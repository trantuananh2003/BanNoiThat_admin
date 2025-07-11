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
import clientAPI from "client-api/rest-client";
import { toast } from "react-toastify";
import { string_to_slug } from "utils/commonFunctions";

const formatDateString = (input: string): string => {
  if (!input) return "";
  const date = new Date(input);
  const pad = (n: number) => n.toString().padStart(2, "0");

  const dd = pad(date.getDate());
  const MM = pad(date.getMonth() + 1);
  const yyyy = date.getFullYear();
  const HH = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${dd}-${MM}-${yyyy} ${HH}:${mm}:${ss}`;
};

// Utility function to format backend date to 'YYYY-MM-DDTHH:mm' for datetime-local input
const formatDateForInput = (date: string): string => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16); // Converts to YYYY-MM-DDTHH:mm
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

interface SaleProgram {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  discountType: "percent" | "fixed_amount";
  discountValue: number;
  maxDiscount: number;
  minCouponValue: number;
  applyType: "brand" | "category";
  applyValues: string;
  slug: string;
}

interface DialogEditSaleProgramProps {
  id: string;
  openDialogEditSaleProgram: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DialogEditSaleProgram({
  id,
  openDialogEditSaleProgram,
  onClose,
  setRefresh,
}: DialogEditSaleProgramProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState<"percent" | "fixed_amount">("percent");
  const [value, setValue] = useState<number>(0);
  const [maxDiscount, setMaxDiscount] = useState<number>(0);
  const [typeApply, setTypeApply] = useState<"brand" | "category">("brand");
  const [applyToIds, setApplyToIds] = useState<string[]>([]);
  const [slug, setSlug] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchSaleProgram = async () => {
      try {
        const response: { result: SaleProgram[] } = await clientAPI
          .service(`saleprogram/${id}`)
          .find();
        const saleProgram = response?.result;
        console.log(saleProgram);
        setName(saleProgram[0].name);
        setDescription(saleProgram[0].description);
        setStartDate(formatDateForInput(saleProgram[0].startDate));
        setEndDate(formatDateForInput(saleProgram[0].endDate));
        setType(saleProgram[0].discountType);
        setValue(saleProgram[0].discountValue);
        setMaxDiscount(saleProgram[0].maxDiscount);
        setTypeApply(saleProgram[0].applyType);
        setApplyToIds(saleProgram[0].applyValues ? saleProgram[0].applyValues.split(",") : []);
        setSlug(saleProgram[0].slug);
      } catch (error) {
        console.error("Error fetching sale program:", error);
        toast.error("Failed to fetch sale program.");
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

    fetchSaleProgram();
    fetchCategories();
    fetchBrands();
  }, [id, openDialogEditSaleProgram]);

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

      await clientAPI.service("saleprogram").put(id, formData);
      toast.success("Sale Program updated successfully!");
      setName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setType("percent");
      setValue(0);
      setMaxDiscount(0);
      setTypeApply("brand");
      setApplyToIds([]);
      setSlug("");
      setRefresh((prev) => !prev);
      onClose();
    } catch (err) {
      console.error("Error updating sale program:", err);
      toast.error("Failed to update sale program.");
    }
  };

  return (
    <Dialog open={openDialogEditSaleProgram} onClose={onClose}>
      <DialogTitle>Edit Sale Program</DialogTitle>
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

        <TextField
          margin="dense"
          label="Start Date"
          type="datetime-local"
          fullWidth
          variant="standard"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <TextField
          margin="dense"
          label="End Date"
          type="datetime-local"
          fullWidth
          variant="standard"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
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
              label={typeApply === "brand" ? "Select Brands" : "Select Subcategories"}
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
  );
}