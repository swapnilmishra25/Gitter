export function buildArgs(...args: string[]): string[] {
  return args.filter(Boolean); 
}
