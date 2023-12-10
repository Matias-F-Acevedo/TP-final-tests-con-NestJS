import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {


  private readonly products: Product[] = [{ id: "1", name: "Product 1", description: "Description 1", price: 100 }];

  findAll(): Promise<Product[]> {
    return new Promise((resolve) => {
        resolve(this.products);
    });

  }


  async findOne(id: string): Promise<Product> {
    return new Promise((resolve, reject) => {
      const product = this.products.find((p) => p.id === id);

      if (!product) {
        //  reject es una función que se utiliza para rechazar una promesa con un motivo (un error).
        reject(new Error("Not found"));
      } else {
        resolve(product);
      }
    });
  }


  async create(createProductDto: CreateProductDto): Promise<Product> {

    // try {
      return new Promise((resolve) => {

        if(!Object.keys(createProductDto).length){
          throw new Error("Creation failed");
        }
        
        const newProduct: Product = {
          ...createProductDto,
          // crea un id aleatoria:
          id: Math.random().toString(36).substring(7),
        };
        this.products.push(newProduct);
        resolve(newProduct);
     
      });
    // } catch (error) {
    //   throw new Error("Creation failed");
    // }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return new Promise((resolve, reject) => {
      
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) {
          reject(new Error(`Product with ID ${id} not found`));
          return ;
        }
        // Sobreescribe lo anterior en caso de que se repita:
        const updatedProduct:Product = { ...this.products[index], ...updateProductDto, id: id };

        this.products[index] = updatedProduct;

        resolve(updatedProduct);
    });
  }

  async remove(id: string): Promise<Product> {
    return new Promise((resolve, reject) => {
      
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) {
          reject(new Error(`Product with ID ${id} not found`));
          return;
        }
  
        const deletedProduct = this.products[index];
        this.products.splice(index, 1);
  
        resolve(deletedProduct);
    });
  }

}

