import { ProjectEntity } from '../../../entities/projectEntity';
import { TableEntity } from '../../../entities/tableEntity';
import { UserEntity } from '../../../entities/userEntity';
import { pgConnection } from '../../data-source';

export class TableDB {
  private tableRepository = pgConnection.getRepository(TableEntity);

  public async createTable(project: ProjectEntity, projectId: number, name: string): Promise<TableEntity | null> {
    try {
      const table = new TableEntity();
      table.projectid = projectId;
      table.name = name;
      table.project = project;
      const newTable = await this.tableRepository.save(table);
      return newTable;
    } catch (err) {
      throw err;
    }
  }

  public async getTableInfoWithProject(tableId: number, projectId: number): Promise<TableEntity | null> {
    try {
      const projectInfo = await this.tableRepository.findOne({
        where: {id: tableId, project: {id: projectId}},
        relations: ['project', 'cards']
      });
      return projectInfo
    } catch (err) {
      throw err;
    }
  }

  public async getTableInfo(tableId: number): Promise<void> {
    try {
      await this.tableRepository.findOne({
        where: {id: tableId},
        relations: ['project']
      });
    } catch (err) {
      throw err;
    }
  }

  public async updateTable(tableId: number, name: string): Promise<void> {
    try {
      await this.tableRepository.update(tableId, {name: name});
    } catch (err) {
      throw err;
    }
  }
}
