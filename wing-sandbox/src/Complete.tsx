import React from "react";
import { Button, Divider, Paper, Typography } from "@material-ui/core";
import { Text, Group, createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    marginBottom: rem(20),
  },
  header: {
    marginBottom: rem(10),
    textAlign: "center", // Center the text
  },
  paragraph: {
    textAlign: "center", // Center the text
  },
  dropzone: {
    borderWidth: rem(1),
    paddingBottom: rem(50),
  },
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },
  control: {
    position: "absolute",
    width: rem(250),
    left: `calc(50% - ${rem(125)})`,
    bottom: rem(-20),
  },
}));


const Complete = () => {
  const { classes, theme } = useStyles();

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className="customize-element">
        <div className="customize-header">
        </div>
        <textarea className="customize-text-field"></textarea>
      </div>
    </div>
  );
};

export default Complete;
