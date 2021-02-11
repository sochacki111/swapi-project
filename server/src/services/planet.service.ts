import ResourceService from './resource.service';

export default class Planet extends ResourceService {
  constructor() {
    super('planets');
  }
}
