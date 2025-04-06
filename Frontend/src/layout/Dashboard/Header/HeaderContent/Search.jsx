import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import SearchOutlined from "@ant-design/icons/SearchOutlined";

export default function Search({ value, onChange, placeholder, label, ...props }) {
  return (
    <Box sx={{ width: "100%", ml: { xs: 0, md: 1 } }}>
      <FormControl sx={{ width: { xs: "100%", md: 224 } }} variant="outlined">
        {/* Label for the input */}
        {label && <InputLabel shrink>{label}</InputLabel>}
        <OutlinedInput
          size="small"
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5 }}>
              <SearchOutlined />
            </InputAdornment>
          }
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      </FormControl>
    </Box>
  );
}
