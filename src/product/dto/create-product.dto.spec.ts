
import { CreateProductDto } from './create-product.dto';
import { validate } from 'class-validator';


describe('CreateProductDto', () => {
  let createProductDto: CreateProductDto;

  beforeEach(() => {
    createProductDto = new CreateProductDto();
  });

  it('should be defined', () => {
    expect(createProductDto).toBeDefined();
  });


  it("should pass validation with valid data", async () => {
    const dto = new CreateProductDto();
    dto.name = 'Product Name';
    dto.description = 'Product Description';
    dto.price = 100;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);

  });


  it("Should not accept name, description and price with empty values", async () => {
    const dto = new CreateProductDto();
    dto.name = '';  
    dto.description = ''; 
    dto.price = null; 

    const errors = await validate(dto);
    expect(errors.length).toEqual(3);

  });

  it("Validation should fail if the description and name are not of type string and the price is not of type number", async () => {
    const dto = new CreateProductDto();
    dto.name = 12 as any;
    dto.description = 12 as any;
    dto.price = "100" as any;

    const errors = await validate(dto);
    expect(errors.length).toEqual(3);
  });


  it("validation should fail with short name: MinLength(4) and short description: @MinLength(4)", async () => {
    const dto = new CreateProductDto();
    dto.name = '1';
    dto.description = 'Des';
    dto.price = 100;

    const errors = await validate(dto);
    expect(errors.length).toEqual(2);
  });

  it("validation should fail with long name: MaxLength(20) and long description: @MaxLength(255)", async () => {
    const dto = new CreateProductDto();
    dto.name = '123456789012345678901';
    dto.description = 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.';
    dto.price = 100;

    const errors = await validate(dto);
    expect(errors.length).toEqual(2);
  });

});