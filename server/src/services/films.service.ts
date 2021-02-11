import ResourceService from './resource.service';

export default class FilmsService extends ResourceService {
  constructor() {
    super('films');
  }

  public async getRecordNameById(resourceId: string): Promise<string> {
    const { title: recordName } = await this.getDetailsById(resourceId);
    return recordName;
  }
}
