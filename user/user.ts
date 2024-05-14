export enum Role {
  DEV = 1,
  PM,
  USER,
}

export class User {
  private id: string;
  /**
   * Mappa progettoId -> Ruolo
   */
  private projects: Map<string, Role> = new Map();

  getProjectRole(projectId: string) {
    return this.projects.get(projectId);
  }

  getProjectIds(): string[] {
    return Array.from(this.projects.keys());
  }

  addToProject(projectId: string, role: Role) {
    this.projects.set(projectId, role);
  }

  get Id(): string {
    return this.id;
  }

  constructor(id: string) {
    this.id = id;
  }
}
