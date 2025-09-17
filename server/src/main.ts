import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'; // default import
import csurf from 'csurf'; // default import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true, // penting supaya cookie bisa dikirim
  });

  // Cookie parser
  app.use(cookieParser());

  // CSRF middleware
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
      },
    }),
  );

  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
}
bootstrap();
