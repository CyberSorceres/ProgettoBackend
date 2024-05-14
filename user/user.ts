export enum Role {
  DEV,
  PM,
  USER,
}

export class User {
  private id: string;
  /**
   * Mappa progettoId -> Ruolo
   */
  private projects: Map<string, Role>;

  getProjectRole(projectId: string) {
    return this.projects[projectId];
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
