import { v4 as uuid } from 'uuid'

class RestaurantEntity {

    constructor({id, name, address, operation_hours, filename, path }){
        this.id = id;
        this.name = name;
        this.address = address;
        this.operation_hours = operation_hours;
        this.filename = filename;
        this.path = path;

        if (!this.id) {
            this.id = uuid();
          }
     }
}


export default RestaurantEntity;
