export interface AI {
  prompt(desc: string): Promise<string>;
}
