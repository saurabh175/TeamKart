import React, { useState } from 'react';
import './Customize.css'; // Import the CSS file for styling
import { Text, Group, Button, createStyles, rem } from "@mantine/core";

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


const Customize: React.FC = () => {
  const [themeColor, setThemeColor] = useState('white');
  const [sliderValue, setSliderValue] = useState(0.3);

  const handleColorChange = (color: string) => {
    setThemeColor(color);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseFloat(event.target.value));
  };

  
  const { classes, theme } = useStyles();

  return (
    <div className="customize-container">
      <div className="customize-element">
        <div className="customize-header">
          <div className="customize-question-mark" title="Modifies the creativity of the chatbot. Higher numbers mean more creativity">
            ?
          </div>
        </div>
        <div className="customize-slider-container">
          <input type="range" min="0" max="1" step="0.01" value={sliderValue} className="customize-slider" onChange={handleSliderChange} />
          <span className="customize-slider-value">{sliderValue}</span>
        </div>
      </div>
    </div>
  );
};

export default Customize;
