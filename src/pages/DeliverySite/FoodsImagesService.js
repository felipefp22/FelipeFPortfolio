import noFood from '../../assets/noFood.jpg';
import burguer from '../../assets/defaultsFoodsImages/burguer.png';
import cake from '../../assets/defaultsFoodsImages/cake.png';
import cokeBottle from '../../assets/defaultsFoodsImages/cokeBottle.png';
import cokeCan from '../../assets/defaultsFoodsImages/cokeCan.png';
import fanta from '../../assets/defaultsFoodsImages/fanta.png';
import fries from '../../assets/defaultsFoodsImages/fries.png';
import iceCream from '../../assets/defaultsFoodsImages/iceCream.png';
import pepsi from '../../assets/defaultsFoodsImages/pepsi.png';
import pizza from '../../assets/defaultsFoodsImages/pizza.png';
import salad from '../../assets/defaultsFoodsImages/salad.png';
import sprite from '../../assets/defaultsFoodsImages/sprite.png';
import sushi from '../../assets/defaultsFoodsImages/sushi.png';
import taco from '../../assets/defaultsFoodsImages/taco.png';
import tiramisu from '../../assets/defaultsFoodsImages/tiramisu.png';
import water from '../../assets/defaultsFoodsImages/water.png';

export async function getAllDefaultsImagesFoodService() {
    return [
        new DefaultImageCategory('Foods', [
            {'name': 'noFood', 'path': noFood },
            {'name': 'burguer', 'path': burguer},
            {'name': 'fries', 'path': fries},
            {'name': 'pizza', 'path': pizza},
            {'name': 'salad', 'path': salad},
            {'name': 'sushi', 'path': sushi},
            {'name': 'taco', 'path': taco},
        ]),
        new DefaultImageCategory('Beverages', [
            {'name': 'cokeBottle', 'path': cokeBottle},
            {'name': 'cokeCan', 'path': cokeCan},
            {'name': 'fanta', 'path': fanta},
            {'name': 'pepsi', 'path': pepsi},
            {'name': 'sprite', 'path': sprite},
            {'name': 'water', 'path': water},
        ]),
        new DefaultImageCategory('Desserts', [
            {'name': 'cake', 'path': cake},
            {'name': 'iceCream', 'path': iceCream},
            {'name': 'tiramisu', 'path': tiramisu},
        ]),
    ];
}

export async function getImageFoodService(foodName) {
    if (!foodName) return noFood;
    if (foodName.includes('https://') || foodName.includes('http://')) return foodName;

    switch (foodName) {
        case 'burguer':
            return burguer;
        case 'cake':
            return cake;
        case 'cokeBottle':
            return cokeBottle;
        case 'cokeCan':
            return cokeCan;
        case 'fanta':
            return fanta;
        case 'fries':
            return fries;
        case 'iceCream':
            return iceCream;
        case 'pepsi':
            return pepsi;
        case 'pizza':
            return pizza;
        case 'salad':
            return salad;
        case 'sprite':
            return sprite;
        case 'sushi':
            return sushi;
        case 'taco':
            return taco;
        case 'tiramisu':
            return tiramisu;
        case 'water':
            return water;
        default:
            return noFood;
    }
}

class DefaultImageCategory {
    constructor(name, items) {
        this.name = name;
        this.items = items;
    }
}
