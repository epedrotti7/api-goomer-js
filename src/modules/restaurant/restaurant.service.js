
import RestaurantRepository from '../restaurant/restaurant.repository';
import RestaurantEntity from "./restaurant.entity";

class RestaurantService {

  restaurantRepository = new RestaurantRepository();

  constructor() { }

  async createRestaurant(name, address, operation_hours, filename, path) {

    const operation_hours_object = JSON.parse(operation_hours);

    const open_hour = operation_hours_object.open_hour
    const closed_hour = operation_hours_object.closed_hour
    const week_day_0 = operation_hours_object.week_day_0
    const week_day_1 = operation_hours_object.week_day_1
    const week_day_2 = operation_hours_object.week_day_2
    const week_day_3 = operation_hours_object.week_day_3
    const week_day_4 = operation_hours_object.week_day_4
    const week_day_5 = operation_hours_object.week_day_5
    const week_day_6 = operation_hours_object.week_day_6

    const restaurant = new RestaurantEntity({
      name,
      address,
      operation_hours: {
        open_hour,
        closed_hour,
        week_day_0,
        week_day_1,
        week_day_2,
        week_day_3,
        week_day_4,
        week_day_5,
        week_day_6
      },
      filename,
      path
    })

    if (!filename && !path) {
      const restaurantNoImage = new RestaurantEntity({
        name,
        address,
        operation_hours: {
          open_hour,
          closed_hour,
          week_day_0,
          week_day_1,
          week_day_2,
          week_day_3,
          week_day_4,
          week_day_5,
          week_day_6
        }
      });

      return await this.restaurantRepository.createRestaurant(restaurantNoImage);
    } else {
      return await this.restaurantRepository.createRestaurant(restaurant);

    }
  }

  async findAllRestaurants() {

    const returnQueryRestaurant = await this.restaurantRepository.findAllRestaurants();

    const allRestaurants = returnQueryRestaurant[0];

    return allRestaurants;

  }

  async findRestaurantById(id) {

    const oneRestaurant = await this.restaurantRepository.findRestaurantById(id);

    const restaurant = JSON.parse(JSON.stringify(oneRestaurant[0]));

    /**Verifica se o restaurante tem um avatar, caso não tenha, retorna null */
    restaurant.forEach((item) => item.path ? item.path : restaurant[0].path = null);

    return restaurant;

  }

  async updateRestaurantById(id, name, address, operation_hours, filename, path) {

    const operation_hours_object = JSON.parse(operation_hours);

    if (!filename && !path) {

      const restaurantNoImage = {
        id,
        name,
        address,
        operation_hours_object,
      }

      return await this.restaurantRepository.updateRestaurantById(restaurantNoImage);

    } else {

      const restaurant = {
        id,
        name,
        address,
        operation_hours_object,
        filename,
        path
      }

      return await this.restaurantRepository.updateRestaurantById(restaurant);
    }
  }

  async deleteRestaurantById(id) {
    return await this.restaurantRepository.deleteRestaurantById(id);
  }
}


export default RestaurantService;