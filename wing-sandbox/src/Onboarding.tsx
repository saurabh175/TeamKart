import React, { useState } from 'react';
import './OnboardingView.css'; // Import the CSS file for styling
import Drop from './Drop';
import Customize from './Customize';
import Complete from './Complete';
import { Text, Group, Button, createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  onboardingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },

  submitButton: {
    position: 'absolute',
    bottom: rem(20),
    right: rem(20),
    borderRadius: rem(8),
    padding: `${rem(12)} ${rem(30)}`,
    backgroundColor: theme.colors.blue[5],
    color: theme.colors.white,
    fontWeight: 500,
    fontSize: 14,
    cursor: 'pointer',
  },
}));
const OnboardingView: React.FC = () => {
   const { classes } = useStyles();


  return (
    <div className="onboarding-container">
      <div className="header-row">
        <div className="header-container">
          <div className="header-col">
            <h1>Upload Product Inventory</h1>
            <h4>Import and update your product inventory by uploading CSV, PDF, or other supported file formats.</h4>
          </div>
        </div>
        <div className="header-container">
          <div className="header-col">
            <h1>Configure Temperature</h1>
            <h4>Adjust the temperature setting to control the creativity and unpredictability of conversations.</h4>
          </div>
        </div>
        <div className="header-container">
          <div className="header-col">
            <h1>Describe Test User</h1>
            <h4>Provide a detailed description of the target user to test the chatbot from their perspective. Consider demographics, needs, and expectations.</h4>
          </div>
        </div>
      </div>
      <div className="module-row">
        <div className="module-wrapper">
          <div className="module">
            <Drop />
          </div>
        </div>
        <div className="separator"></div>
        <div className="module-wrapper">
          <div className="module">
            <Customize />
          </div>
        </div>
        <div className="separator"></div>
        <div className="module-wrapper">
          <div className="module">
            <Complete />
          </div>
        </div>

      </div>
    </div>
  );
};





export default OnboardingView;
