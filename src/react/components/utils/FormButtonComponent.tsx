import {FormButton} from "../../../common/types";
import {Button} from "@mui/material";
import React from "react";

interface FormButtonProps {
  submitButton: FormButton,
  handleSubmit: any,
  isDisabled: boolean
}

export const FormButtonComponent = (props: FormButtonProps) => {

  const {
    submitButton,
    handleSubmit,
    isDisabled
  } = props;

  const {
    label,
    variant = 'contained',
    color = 'primary',
    sx = {},
  } = submitButton;

  return (
    <Button
      onClick={handleSubmit}
      disabled={isDisabled}
      variant={variant}
      color={color}
      sx={sx}>
      {label}
    </Button>
  );
};
