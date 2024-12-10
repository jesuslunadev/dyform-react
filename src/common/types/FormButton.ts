import {SxProps} from "@mui/material";

export interface FormButton {
  label: string;
  sx?: SxProps | object;
  startIcon?: any;
  endIcon?: any;
  size?: 'small' | 'medium' | 'large'
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}
