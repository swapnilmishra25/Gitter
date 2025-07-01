#!/usr/bin/env node

import { Command } from "commander";
import { registerAllCommands } from "./utils/registerAllCommands.js";

const program = new Command();

program
  .name("gitter")
  .description("Automated Git workflow for microservice repos")
  .version("1.0.0")
  .option("--config <path>", "Path to config file")
  .option("--dry-run", "Preview commands without executing")
  .option("--log", "Log output to gitter.log")
  .option("--parallel", "Run commands in parallel")
  .option("--pre <cmd>", "Run a pre-hook git command before main one");

await registerAllCommands(program);

await program.parseAsync();
