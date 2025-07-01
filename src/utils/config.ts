import { cosmiconfig } from "cosmiconfig";
import { GitterOptions, Theme } from "../types";

const explorer = cosmiconfig("gitter");

const defaultTheme: Required<Theme> = {
  success: "greenBright",
  fail: "red",
  info: "cyan",
  repo: "blue",
  cmd: "gray",
};

export async function loadGlobalOptions(): Promise<GitterOptions> {
  const result = await explorer.search();
  const config = result?.config || {};

  return {
    ...config,
    theme: {
      ...defaultTheme,
      ...(config.theme || {}),
    },
  };
}
