import React, {FC, ReactElement, ReactNode} from "react";
import {FormGroup} from "../../common/types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography
} from "@mui/material";

interface GroupComponentProps {
  children: ReactNode,
  props: FormGroup
}

/**
 * A functional component that renders a group container which can be displayed as a card, an accordion collapse, or a simple box.
 * @property {string} [title] - The title of the group, optionally displayed at the top.
 * @property {string} [description] - A description providing more details about the group, optionally displayed under the title.
 * @property {Object} [styles] - Custom styles to be applied to the container. This defaults to an empty object.
 * @property {boolean} [isCard] - Determines if the component should render as a card.
 * @property {boolean} [isCollapse] - Determines if the component should render as an accordion collapse.
 * @component
 * @param {ReactNode} children
 * @param {FormGroup} props
 * @returns {ReactElement} The rendered group component.
 */
export const GroupComponent: FC<GroupComponentProps> = ({children, props}: GroupComponentProps): ReactElement => {

  const {
    title,
    description,
    styles = {},
    isCard,
    isCollapse,
  } = props;

  const renderTitleAndDescription = () => (
    <Box>
      {title && <Typography variant="h6">{title}</Typography>}
      {description && <Typography variant="body2">{description}</Typography>}
    </Box>
  );

  if (isCard) {
    return (
      <Card sx={styles}>
        <CardHeader title={title ?? ""} subheader={description ?? ""}/>
        <CardContent>{children}</CardContent>
      </Card>
    );
  }

  if (isCollapse) {
    return (
      <Accordion defaultExpanded sx={styles}>
        <AccordionSummary>{renderTitleAndDescription()}</AccordionSummary>
        <AccordionDetails>
          <Box>{children}</Box>
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Box sx={styles}>
      {renderTitleAndDescription()}
      {children}
    </Box>
  );
};
