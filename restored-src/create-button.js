// Button Creation Utility Module
// This module provides utilities for creating interactive buttons in FIFA Ultimate Team

"use strict";

// Mark as ES module
Object.defineProperty(exports, "__esModule", { value: true });

// Initialize exports
exports.createButton = void 0;

// Import dependencies
const panelUtils = require('./panel-utils');        // module 66175
const analytics = require('./analytics');           // module 57439

/**
 * Create a customizable button component
 * @param {Object} options - Button configuration options
 * @param {string} options.label - Button text label
 * @param {Function} options.onClick - Click event handler
 * @param {string} [options.customClass] - Custom CSS classes (space-separated)
 * @param {boolean} [options.createWrapper] - Whether to wrap button in a panel row
 * @param {boolean} [options.isSecondaryBtn] - Whether this is a secondary button (affects styling)
 * @param {string} [options.id] - Button identifier for analytics
 * @param {string} [options.subText] - Sub-text for currency buttons
 * @returns {Object} Button component with element and control methods
 */
exports.createButton = function({
  label,
  onClick,
  customClass,
  createWrapper,
  isSecondaryBtn,
  id,
  subText
}) {
  // Create appropriate button control based on whether subText is provided
  const buttonControl = subText
    ? new UTCurrencyButtonControl()
    : new UTStandardButtonControl();

  // Initialize the button control
  buttonControl.init();

  // Add click event handler with analytics tracking
  buttonControl.addTarget(
    buttonControl,
    () => {
      // Fire analytics event for button interaction
      analytics.Analytics.instance.fireEvent("button_click", {
        event_category: "button_interaction",
        event_label: id
      });

      // Execute the provided onClick handler
      onClick();
    },
    EventType.TAP
  );

  // Set button text
  buttonControl.setText(label);

  // Set sub-text for currency buttons
  if (subText && buttonControl instanceof UTCurrencyButtonControl) {
    buttonControl.setSubText(subText);
  }

  // Get the root DOM element
  const rootElement = buttonControl.getRootElement();

  // Apply primary styling unless it's a secondary button or accordion
  if (!isSecondaryBtn && !customClass?.includes("accordion")) {
    rootElement.classList.add("primary");
  }

  // Apply custom CSS classes
  if (customClass) {
    const classNames = customClass.split(" ");
    for (const className of classNames) {
      rootElement.classList.add(className);
    }
  }

  let finalElement;

  // Create wrapper if requested
  if (createWrapper) {
    finalElement = panelUtils.createPanelRow({ customClass });
    finalElement.append(rootElement);
  } else {
    finalElement = rootElement;
  }

  // Return button component with control methods
  return {
    // The DOM element to be inserted into the page
    element: finalElement,

    // Method to destroy the button and clean up resources
    destroy: buttonControl.destroy.bind(buttonControl),

    // Method to set interaction state (enabled/disabled)
    setInteractionState: (state) => buttonControl.setInteractionState(state),

    // Method to update button label text
    updateLabel: (newLabel) => buttonControl.setText(newLabel)
  };
};
