import { ChalkInstance } from "chalk";

// src/types.ts
export type ThemeColor =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray"
  | "redBright"
  | "greenBright"
  | "yellowBright"
  | "blueBright"
  | "magentaBright"
  | "cyanBright"
  | "whiteBright";


export interface Theme {
  success?: ThemeColor;
  fail?: ThemeColor;
  info?: ThemeColor;
  repo?: ThemeColor;
  cmd?: ThemeColor;
}

export interface GitterOptions {
  config?: string;
  dryRun?: boolean;
  log?: boolean;
  parallel?: boolean;
  pre?: string;
  repos?: string[];
  macros?: Record<string, string[]>;
  theme?: Theme;
}
