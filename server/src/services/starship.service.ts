import ResourceService from './resource.service';

export default class StarshipsService extends ResourceService {
  constructor() {
    super('starships');
  }
}
