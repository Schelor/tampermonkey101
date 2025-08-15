// Store Module Aggregator
// This module serves as the main entry point for store-related functionality

"use strict";

// Helper function for creating bindings (equivalent to __createBinding)
const createBinding = (Object.create
  ? function(target, source, key, alias) {
      if (alias === undefined) alias = key;
      const descriptor = Object.getOwnPropertyDescriptor(source, key);

      if (!descriptor ||
          ("get" in descriptor
            ? !source.__esModule
            : descriptor.writable || descriptor.configurable)) {
        descriptor = {
          enumerable: true,
          get: function() {
            return source[key];
          }
        };
      }

      Object.defineProperty(target, alias, descriptor);
    }
  : function(target, source, key, alias) {
      if (alias === undefined) alias = key;
      target[alias] = source[key];
    });

// Helper function for re-exporting all exports (equivalent to __exportStar)
const exportStar = function(source, target) {
  for (const key in source) {
    if (key === "default" || Object.prototype.hasOwnProperty.call(target, key)) {
      continue;
    }
    createBinding(target, source, key);
  }
};

// Mark as ES module
Object.defineProperty(exports, "__esModule", { value: true });

// Re-export all from store-related modules
exportStar(require('./in-memory-store'), exports);     // module 76097
exportStar(require('./persistent-store'), exports);    // module 77208
exportStar(require('./store-utils'), exports);         // module 84582
exportStar(require('./store-types'), exports);         // module 33386
