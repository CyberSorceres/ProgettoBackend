export enum Role {
  DEV = 1,
  PM,
  USER,
}

interface ProjectData {
  id: string;
  role: Role;
}

export class User {
  private id: string;
  private role: Role;
  /**
   * Mappa progettoId -> Ruolo
   */
  private projects: string[] = [];

  getRole() {
    return this.role;
  }

  getProjectIds(): string[] {
    return this.projects;
  }

  addToProject(projectId: string) {
    this.projects.push(projectId);
  }

  get Id(): string {
    return this.id;
  }

  constructor(id: string, projects: string[] = [], role: Role = Role.USER) {
    this.id = id;
    this.projects = projects;
    this.role = role;
  }
}
