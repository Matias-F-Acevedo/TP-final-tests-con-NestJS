import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { validate } from 'class-validator';



describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe("findAll", () => {

    it("should be defined", () => {
      expect(controller.findAll).toBeDefined();
    });

    it("should return an array of products", async () => {
      const products: Product[] = [
        { id: "1", name: "Product 1", description: "Description 1", price: 100 },
        { id: "2", name: "Product 2", description: "Description 2", price: 200 },
      ];

      jest.spyOn(service, "findAll").mockImplementation(async () => products);

      const result = await controller.findAll();

      expect(result).toEqual(products);
    });

    it('should return an empty array if productService.findAll returns empty', async () => {
      jest.spyOn(service, 'findAll').mockImplementation(async () => []);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });

    it("should throw NotFoundException if products not found", async () => {

      jest.spyOn(service, "findAll").mockImplementation(async () => {
        throw new Error("Not found");
      });

      // expect(....).rejects: La función rejects se utiliza para afirmar que la promesa devuelta por la expresión anterior (en este caso, controller.findAll()) será rechazada (con una excepción).
      await expect(controller.findAll()).rejects.toThrow(new NotFoundException("Not found"));
    });

  });




  describe("findOne", () => {
    it("should be defined", () => {
      expect(controller.findOne).toBeDefined();
    });

    it("should return product when found", async () => {
      const productId = "1";
      const product: Product = { id: "1", name: "Product 1", description: "Description 1", price: 100 };

      jest.spyOn(service, "findOne").mockImplementation(async () => product);

      const result = await controller.findOne(productId);

      expect(result).toEqual(product);
    });

    it("Should throw NotFoundException if the product is not found or does not exist", async () => {

      const productId = '1';

      jest.spyOn(service, "findOne").mockImplementation(async () => {
        throw new Error("Not found");
      });

      await expect(controller.findOne(productId)).rejects.toThrow(new NotFoundException("Not found"));
    });

  });


  describe("create", () => {

    it("should be defined", () => {
      expect(controller.create).toBeDefined();
    });

    it("should create and return the product", async () => {
      const createProductDto: CreateProductDto = { name: "Product 1", description: "Description 1", price: 100 };

      const product = { ...createProductDto, id: "1" };

      jest.spyOn(service, "create").mockImplementation(async () => product);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(product);
    });


    it("should throw BadRequestException on creation failure", async () => {
      const createProductDto: CreateProductDto = { name: "Product 1", description: "Description 1", price: 100 };

      jest.spyOn(service, "create").mockImplementation(async () => {
        throw new Error("Created failed");
      });

      await expect(controller.create(createProductDto)).rejects.toThrow(BadRequestException);

    });

  });


    describe("update", () => {

      it("should be defined", () => {
        expect(controller.update).toBeDefined();
      });

      it("should update a product", async () => {

        const product: Product = { id: "1", name: "Product 1", description: "Description 1", price: 100 };

        const updateProductDto: UpdateProductDto = { description: "DescriptionUpdate" };

        const updateProductMock = { ...product, ...updateProductDto };

        jest.spyOn(service, "update").mockImplementation(async () => updateProductMock);

        const result = await controller.update(product.id, updateProductDto);

        expect(result).toEqual(updateProductMock);
      });

      it("Should throw NotFoundException if the product is not found or does not exist", async () => {
        const productId = "899";
        const updateProductDto: UpdateProductDto = { name: "nameUpdate" };

        jest.spyOn(service, "update").mockImplementation(async () => {
          throw new Error(`Product with ID ${productId} not found`);
        });

        await expect(controller.update(productId, updateProductDto)).rejects.toThrow(new NotFoundException("Update failed"));
      });

    });

    describe("remove", () => {

      it("should be defined", () => {
        expect(controller.remove).toBeDefined();
      });

      it("should remove a product", async () => {
        const productId = "1";
        const productMock = { id: "1", name: "Product 1", description: "Description 1", price: 100 };

        jest.spyOn(service, "remove").mockImplementation(async () => productMock);

        const result = await controller.remove(productId);

        expect(result).toEqual(productMock);
      });

      it("Should throw NotFoundException if the product is not found or does not exist", async () => {
        const productId = "1";

        jest.spyOn(service, "remove").mockImplementation(async () => {
          throw new Error(`Product with ID ${productId} not found`);
        });

        await expect(controller.remove(productId)).rejects.toThrow(new NotFoundException("Delete failed"));

      });
    });



  });



