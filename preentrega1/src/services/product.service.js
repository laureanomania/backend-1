import fs from "fs";
import { v4 as uuid } from "uuid";

class ProductService {
  constructor({ path }) {
    this.path = path;
    this.products = fs.existsSync(path)
      ? JSON.parse(fs.readFileSync(path, "utf-8"))
      : [];
  }

  async getAll() {
    return this.products;
  }

  async getById({ id }) {
    return this.products.find((product) => product.id === id);
  }

  async create({
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails = [],
  }) {
    const id = uuid();
    const product = {
      id,
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
      status: true,
    };
    this.products.push(product);
    await this.saveOnFile();
    return product;
  }

  async update({
    id,
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  }) {
    const product = this.products.find((product) => product.id === id);
    if (!product) return null;
    Object.assign(product, {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    });
    await this.saveOnFile();
    return product;
  }

  async delete({ id }) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) return null;
    const [product] = this.products.splice(index, 1);
    await this.saveOnFile();
    return product;
  }

  async saveOnFile() {
    fs.promises.writeFile(this.path, JSON.stringify(this.products));
  }
}

export const productService = new ProductService({
  path: "./src/db/products.json",
});
