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
  /**
   * Mappa progettoId -> Ruolo
   */
  private projects: ProjectData[] = [];

  getProjectRole(projectId: string) {
    return this.projects.find((p) => p.id === projectId)?.role;
  }

  getProjectIds(): string[] {
    return this.projects.map((p) => p.id);
  }

  addToProject(projectId: string, role: Role) {
    this.projects.push({ id: projectId, role });
  }

  get Id(): string {
    return this.id;
  }

  constructor(id: string, projects: ProjectData[] = []) {
    this.id = id;
    this.projects = projects;
  }
}
