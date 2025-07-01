import fs from "fs";
import path from "path";

const HISTORY_FILE = path.resolve(process.cwd(), ".gitter-history.json");

interface HistoryData {
  repos: string[];
}

export const loadHistory = (): string[] => {
  try {
    const data = fs.readFileSync(HISTORY_FILE, "utf-8");
    const parsed: HistoryData = JSON.parse(data);
    return parsed.repos || [];
  } catch {
    return [];
  }
};

export const saveHistory = (repos: string[]) => {
  const data: HistoryData = { repos };
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2), "utf-8");
};
