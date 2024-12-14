import {Backdrop, Box, ButtonProps, CircularProgress, Typography} from "@mui/material";
import React, {FC, FormEvent, ReactElement} from "react";
import {FormIsLoadingOpts} from "../../../common/types";
import {CircularProgressProps} from "@mui/material/CircularProgress/CircularProgress";


const defaultStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1200,
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  color: 'red',
}

/**
 * BackdropFormLoading is a functional component designed to show a loading state
 * with customizable options for visual feedback.
 *
 * This component displays a backdrop with a spinner and a label. Both can be
 * customized through the `options` prop. If custom elements are provided for
 * the spinner or label, the component will use them; otherwise, it will render
 * the default CircularProgress and Typography elements, respectively.
 *
 * @property {FormIsLoadingOpts} options - Configuration object for the loading state.
 * This object can contain the spinner and label elements, or their corresponding
 * properties for customization.
 */
export const BackdropFormLoading: FC<{ options: FormIsLoadingOpts }> = ({options}) => {

  const renderSpinner = () => {
    if (React.isValidElement(options.spinner)) {
      return React.cloneElement(options.spinner as ReactElement<CircularProgressProps>);
    }

    return (
      <CircularProgress
        {...options}/>
    );
  }


  const renderLabel = () => {

    if (React.isValidElement(options.label)) {
      return React.cloneElement(options.label as ReactElement);
    }

    return (
      <Typography variant="body2" color="textSecondary" component="div">
        {options.label}
      </Typography>
    )
  }

  const styles = {
    ...defaultStyles,
    ...(options.sx ?? {})
  }

  return (
    <Backdrop
      open={true}
      sx={styles}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {renderSpinner()}
        <Box sx={{mt: 2}}>
          {renderLabel()}
        </Box>
      </Box>
    </Backdrop>
  )
}
