import ResourceService from './resource.service';

export default class Vehicle extends ResourceService {
  constructor() {
    super('vehicles');
  }
}
