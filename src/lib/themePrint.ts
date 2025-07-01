import chalk from "chalk";

export type ChalkColor =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray"
  | "grey"
  | "redBright"
  | "greenBright"
  | "yellowBright"
  | "blueBright"
  | "magentaBright"
  | "cyanBright"
  | "whiteBright";

export type ThemeKey = "success" | "fail" | "info" | "repo" | "cmd";

export type Theme = Partial<Record<ThemeKey, ChalkColor>>;

export const defaultTheme: Record<ThemeKey, ChalkColor> = {
  success: "greenBright",
  fail: "red",
  info: "cyan",
  repo: "blue",
  cmd: "gray",
};

export const print = (themeOverrides?: Theme) => {
  const theme: Record<ThemeKey, ChalkColor> = {
    ...defaultTheme,
    ...(themeOverrides || {}),
  };

  const getColorFn = (key: ThemeKey) => {
    const color = theme[key];
    const fn = (chalk as any)[color];
    return typeof fn === "function" ? fn : chalk.white;
  };

  return {
    success: (msg: string) => console.log(getColorFn("success")(msg)),
    fail: (msg: string) => console.log(getColorFn("fail")(msg)),
    info: (msg: string) => console.log(getColorFn("info")(msg)),
    repo: (msg: string) => getColorFn("repo")(msg),
    cmd: (msg: string) => getColorFn("cmd")(msg),
  };
};
