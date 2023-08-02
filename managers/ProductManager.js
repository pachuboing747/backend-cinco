const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  #products = [];

  constructor(filename) {
    this.filename = filename;
    this.filepath = path.join(__dirname, "../data", this.filename);
  }

  #readFile = async () => {
    const data = await fs.readFile(this.filepath, "utf-8");

    if (data == "") {
      this.#products = [
        "El archivo se encuentra vacío, por favor, ingrese un producto",
      ];
    } else {
      this.#products = JSON.parse(data);
    }
  };

  #writeFile = async () => {
    const data = JSON.stringify(this.#products, null, 2);
    await fs.writeFile(this.filepath, data);
  };

  async getAll() {
    await this.#readFile();

    return this.#products;
  }

  async getById(id) {
    await this.#readFile();

    return this.#products.find((p) => p.id == id);
  }

  async create(product) {
    await this.#readFile();

    const id = (this.#products[this.#products.length - 1]?.id || 0) + 1;

    const newProduct = {
      id,
      ...product,
    };

    if (
      this.#products[0] ==
      "El archivo se encuentra vacío, por favor, ingrese un producto"
    ) {
      this.#products.pop();
    }

    this.#products.push(newProduct);

    await this.#writeFile();

    return newProduct;
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

    this.#products = this.#products.filter((p) => p.id != id);

    await this.#writeFile();
  }

  async deleteAll() {
    this. #products = [];
    await this.#writeFile();
  }

  async createProduct(product, productId, cantidad) {
    await this.#readFile();
  
    const existingProductIndex = product.products.findIndex((p) => p.product === productId);
  
    if (existingProductIndex !== -1) {
      product.products[existingProductIndex].quantity += cantidad;
    } else {
      const newProduct = {
        product: productId,
        quantity: cantidad,
      };
  
      product.products.push(newProduct);
    }
  
    await this.#writeFile();
  
    return product;
  }

  async existInCart(product, productId) {
    return product.products.find((p) => p.product == productId);
  }
  
  
  async updateProduct(product, productId) {
  await this.#readFile();

  const existingProduct = product.products.find((p) => p.product === productId);

  if (!existingProduct) {

    return null;
  }

  existingProduct.quantity++;

  await this.#writeFile();


  return existingProduct;
  }

  async existInCart(product, productId) {
    return product.products.find((p) => p.product == productId);
  }
}

module.exports = ProductManager;
