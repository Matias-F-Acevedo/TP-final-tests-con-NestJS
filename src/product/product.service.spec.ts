import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from '../product/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {

    it("should be defined", () => {
      expect(service.findAll).toBeDefined();
    });

    it("should return an array of products", async () => {
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array);
    });

  });


  describe("findOne", () => {

    it("should be defined", () => {
      expect(service.findOne).toBeDefined();
    });

    it("should return a product", async () => {
      const product: Product = { id: "1", name: "Product 1", description: "Description 1", price: 100 }
      const result = await service.findOne("1");
      expect(result).toEqual(product);
    });

    it("should throw Error if product not found", async () => {

      try {
        await service.findOne("id-that-does-not-exist");
      } catch (error) {
        expect(error.message).toBe("Not found");
        console.log(error.message);
      }
    });
  });

  describe("create", () => {

    it("should be defined", () => {
      expect(service.create).toBeDefined();
    });

    it("should create a product and return it", async () => {
      const newProduct: CreateProductDto = { name: "newProduct", description: "Description 2", price: 200 }
      const result: Product = await service.create(newProduct);
      //no me funciona:
      // expect(result).toBeInstanceOf(Product);
      expect(typeof result.id).toBe('string');
      expect(result.name).toEqual(newProduct.name);
      expect(result.description).toEqual(newProduct.description);
      expect(result.price).toEqual(newProduct.price);
    });

    it('should throw an error for an invalid product', async () => {
      const invalidProduct = {};

      try {
        await service.create(invalidProduct as any)
      } catch (error) {
        console.log(error.message);
        expect(error.message).toBe("Creation failed");
      }
    });
  });


  describe("update", () => {

    it("should be defined", () => {
      expect(service.update).toBeDefined();
    });

    it("should update and return the updated product", async () => {

      const updateProduct: UpdateProductDto = {name: "UpdateProduct"}

      const result: Product = await service.update("1",updateProduct);
      expect(result.name).toEqual(updateProduct.name);
    });

    it("should return an error if it does not find the product", async () => {
      const updateProduct: UpdateProductDto = {name: "UpdateProduct"}
      try {
        await service.update("id-that-does-not-exist",updateProduct)
      } catch (error) {
        expect(error.message).toBe("Product with ID id-that-does-not-exist not found");
      }
    });
  });


  describe("remove", () => {

    it("should be defined", () => {
      expect(service.remove).toBeDefined();
    });

    it("should remove a product and return it", async () => {
      const removedProduct:Product= { id: "1", name: "Product 1", description: "Description 1", price: 100 }

      const result: Product = await service.remove("1");
      expect(result).toEqual(removedProduct);

    });

    it("should return an error if it does not find the product", async () => {
      try {
        await service.remove("id-that-does-not-exist")
      } catch (error) {
        console.log(error.message);
        expect(error.message).toBe("Product with ID id-that-does-not-exist not found");
      }
    });
  });



});
