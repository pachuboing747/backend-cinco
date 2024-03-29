const fs = require("fs/promises");
const path = require("path");


class CartsManager {
  #carts = [];

  constructor(filename) {
    this.filename = filename;
    this.filepath = path.join(__dirname, "../data", this.filename);
  }

  #readFile = async () => {
    try {
      const data = await fs.readFile(this.filepath, "utf-8");
      if (data == "") {
        this.#carts = [];
      } else {
        this.#carts = JSON.parse(data);
      }
    } catch (e) {
      this.#carts = [];
    }
  };

  #writeFile = async () => {
    const data = JSON.stringify(this.#carts, null, 2);
    await fs.writeFile(this.filepath, data);
  };

  async getById(id) {
    await this.#readFile();

    return this.#carts.find((c) => c.id == id);
  }

  async create(carts) {
    await this.#readFile();

    const id = (this.#carts[this.#carts.length - 1]?.id || 0) + 1;

    const newcarts = {
      id,
      ...carts,
      products: [],
    };

    this.#carts.push(newcarts);

    await this.#writeFile();

    return newcarts;
  }

  async existInCart(cart, productId) {
    return cart.products.find((p) => p.product == productId);
  }

  async createProduct(carts, productId, cantidad) {
    await this.#readFile();
  
    const existingProductIndex = carts.products.findIndex((p) => p.product === productId);
  
    if (existingProductIndex !== -1) {
      carts.products[existingProductIndex].quantity += cantidad;
    } else {
      const newProduct = {
        product: productId,
        quantity: cantidad,
      };
  
      carts.products.push(newProduct);
    }
  
    await this.#writeFile();
  
    return carts;
  }
  
  
  async updateProduct(carts, productId) {
  await this.#readFile();

  const existingProduct = carts.products.find((p) => p.product === productId);

  if (!existingProduct) {

    return null;
  }

  existingProduct.quantity++;

  await this.#writeFile();


  return existingProduct;
  }

  async getAll() {
    await this.#readFile();

    return this.#carts;
  }

  async save(id, producto) {
    await this.#readFile();

    const existing = await this.getById(id);

    if (!existing) {
      return;
    }

    const { title, description, stock, price, keywords } = producto;

    existing.title = title;
    existing.description = description;
    existing.stock = stock;
    existing.price = price;
    existing.keywords = keywords;

    await this.#writeFile();
  }

  async delete(id) {
    await this.#readFile();

    this. #carts = this. #carts.filter((p) => p.id != id);

    await this.#writeFile();
  }

  async deleteAll() {
    this. #carts = [];
    await this.#writeFile();
  }
}

module.exports = CartsManager;