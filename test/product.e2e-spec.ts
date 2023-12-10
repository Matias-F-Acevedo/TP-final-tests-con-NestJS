import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductModule } from '../src/product/product.module';
import { Product } from '../src/product/entities/product.entity';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';



describe('Product (e2e)', () => {
  let app: INestApplication;
    let product:Product = {
    id: "1",
    name: "Product 1",
    description: "Description 1",
    price: 100
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductModule],
    })
        .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async()=>{
    await app.close();
  })


//http://localhost:3000/api/product

describe("GET", () => {
  it("/product (GET) should return an array of products", async () => {
    return request(app.getHttpServer())
      .get('/product')
      .expect(200)
      .expect([product]);
  });

  it("/product/id (GET) should return a product", async () => {
    const idProduct = "1"
    return request(app.getHttpServer())
      .get('/product/'+idProduct)
      .expect(200)
      .expect(product);
  });

  it("/product/invalidID (GET) should return a NotFoundException", async () => {
    const idProduct = "invalidID"
    return request(app.getHttpServer())
      .get('/product/'+idProduct)
      .expect(404)
      .expect((res)=>{expect(res.body.message).toBe("Not found")});   
  });
});

  describe("POST/CREATE", () => {

  it("/product (POST) should create and return the product", async () => {

    const newProduct: CreateProductDto = {
        name:"newProduct",
        description:"description 23",
        price: 200
    }

    return request(app.getHttpServer())
      .post('/product')
      .send(newProduct)
      .expect(201)
      .expect((res)=>{
        expect(res.body).toMatchObject({
            id: expect.any(String),
            ...newProduct
          });
      });
  });



  it("/product (POST) Should return a badrequest exception if the name, description and price have empty values", async () => {

    const newProduct = {
        name:"",
        description:"",
        price: null
    }

    return request(app.getHttpServer())
      .post('/product')
      .send(newProduct)
      .expect(400)
      .expect((res)=>{
        expect(res.body.error).toEqual("Bad Request");
      });

  });


  it("/product (POST) Should return a badrequest exception if the name and description are not of type string and the price of type number", async () => {

    const newProduct = {
        name: 12,
        description:12,
        price: "12"
    }

    return request(app.getHttpServer())
      .post('/product')
      .send(newProduct)
      .expect(400)
      .expect((res)=>{
        expect(res.body.error).toEqual("Bad Request");
      });
  });


  it("/product (POST) Should return a badrequest exception if the name and description are less than 4 characters", async () => {

    const newProduct = {
        name: "pro",
        description:"des",
        price: 100
    }

    return request(app.getHttpServer())
      .post('/product')
      .send(newProduct)
      .expect(400)
      .expect((res)=>{
        expect(res.body.error).toEqual("Bad Request");
      });
  });

  it("/product (POST) Should return a badrequest exception if the name is more than 20 characters and the description is more than 255", async () => {

    const newProduct = {
        name: "123456789012345678901",
        description:"Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.",
        price: 100
    }

    return request(app.getHttpServer())
      .post('/product')
      .send(newProduct)
      .expect(400)
      .expect((res)=>{
        expect(res.body.error).toEqual("Bad Request");
      });
  });

  });

  describe("PATCH/UPDATE", () => {

    it("/product (PATCH) should update a product to return it", async () => {

        const idProduct = "1"
        const updateProduct: UpdateProductDto = {
            name:"UpdateProductTest"
        }
    
        return request(app.getHttpServer())
          .patch('/product/'+idProduct)
          .send(updateProduct)
          .expect(200)
          .expect((res)=>{
            expect(res.body.id).toEqual(idProduct);
            expect(res.body.name).toEqual(updateProduct.name);
          });
      });

      it("/product/invalidID (PATCH) should return a NotFoundException with an invalid id", async () => {
        const idProduct = "invalidID"
        const updateProduct: UpdateProductDto = {
            name:"UpdateProductTest"
        }
        return request(app.getHttpServer())
          .patch('/product/'+idProduct)
          .send(updateProduct)
          .expect(404)
          .expect((res)=>{expect(res.body.message).toBe("Update failed")});  
      });



      it("/product (PATCH) The id should not be updated if it is sent in the body", async () => {

        const idProduct = "1"
        const updateProduct = {
            id:"223423"
        }
    
        return request(app.getHttpServer())
          .patch('/product/'+idProduct)
          .send(updateProduct)
          .expect(200)
          .expect((res)=>{
           expect(res.body.id).toEqual(idProduct);
          });
      });
  });

  describe("DELETE/REMOVE", () => {

    it("/product/id (DELETE) should delete a product and return it", async () => {

      const idProduct = "1"
      
      return request(app.getHttpServer())
        .delete('/product/'+idProduct)
        .expect(200)
        .expect((res)=>{
         expect(res.body.id).toEqual(idProduct);
         expect(res.body).toEqual(product);
         
        });
    });

    it("/product/invalidID (DELETE) should return a NotFoundException if not found or does not exist", async () => {
      const idProduct = "invalidID"
      return request(app.getHttpServer())
        .delete('/product/'+idProduct)
        .expect(404)
        .expect((res)=>{expect(res.body.message).toBe("Delete failed")});   
    });
  });
});
