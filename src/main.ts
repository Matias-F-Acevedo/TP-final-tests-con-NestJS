import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // esta linea de codigo es como decir: cuando cree validaciones en multiples dto, siempre van a validar.
  // es una clase que valida todo. 
  app.useGlobalPipes(new ValidationPipe({ whitelist: true,
    forbidNonWhitelisted: true}));
  app.enableCors();
  app.setGlobalPrefix('api')
  await app.listen(3000);
}
bootstrap();


