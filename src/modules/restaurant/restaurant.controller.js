import RestaurantService from "./restaurant.service";

class RestaurantController {

    restaurantService = new RestaurantService();

    constructor() { }

    createRestaurant = async (req, res) => {
        const { name, address, operation_hours } = req.body;

        const avatar = req.file;

        if (avatar) {
            const { filename, path } = avatar;
            await this.restaurantService.createRestaurant(name, address, operation_hours, filename, path);
        } else {
            await this.restaurantService.createRestaurant(name, address, operation_hours);
        }

        return res.status(200).json({ message: 'Restaurant created successfully!' });
    }

    findAllRestaurants = async (req, res) => {

        const restaurant = await this.restaurantService.findAllRestaurants();

        if(restaurant.length <= 0){
            res.status(400).json({ message: 'Nobody Restaurants created!'})
        }

        return res.status(200).json(restaurant);
    }

    findRestaurantById = async (req, res) => {

        const { id } = req.params;

        const restaurant = await this.restaurantService.findRestaurantById(id);

        if (restaurant.length <= 0) {
            return res.status(400).json({ message: 'Restaurant not found!' });

        }

        return res.status(200).json(restaurant);
    }

    updateRestaurantById = async (req, res) => {

        const { id } = req.params;
        const { name, address, operation_hours } = req.body;
        const avatar = req.file;

        let restaurantResponse;

        if (avatar) {
            const { filename, path } = avatar;
            restaurantResponse = await this.restaurantService.updateRestaurantById(id, name, address, operation_hours, filename, path);
        } else {
            restaurantResponse = await this.restaurantService.updateRestaurantById(id, name, address, operation_hours);
        }

        if (restaurantResponse.length <= 0) {
            return res.status(400).json({ message: 'Restaurant not found!' });
        }

        return res.status(200).json({ message: 'Restaurant updated successfully!' });

    }

    deleteRestaurantById = async (req, res) => {
        const { id } = req.params;

        const restaurantResponse = await this.restaurantService.deleteRestaurantById(id);

        if (restaurantResponse.length <= 0) {
            return res.status(400).json({ message: 'Restaurant not found!' });
        }

        return res.status(200).json({ message: 'Restaurant deleted successfully' });
    }
}

export default RestaurantController;