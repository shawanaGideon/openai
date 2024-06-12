import { TextField } from "@mui/material";

type Props = {
  label: string;
  name: string;
  type: string;
};

const CustomizedInput = (props: Props) => {
  return (
    <TextField
      margin="normal"
      InputLabelProps={{ style: { color: "white" } }}
      name={props.name}
      label={props.label}
      type={props.type}
      inputProps={{
        style: {
          width: "350px",
          borderRadius: 10,
          fontSize: 15,
          color: "white",
          padding: 15,
        },
      }}
    />
  );
};

export default CustomizedInput;
