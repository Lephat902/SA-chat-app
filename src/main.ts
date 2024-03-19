import { ClassSerializerInterceptor, INestApplication, InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AuthIoAdapter } from './chat/adapters/auth.adapter';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionsFilter } from './global-exceptions-filter';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService instance
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  // Enable CORS with specific domain patterns
  app.enableCors({
    allowedHeaders: ['content-type'],
    credentials: true,
    methods: 'GET,PUT,POST,PATCH,DELETE,UPDATE,OPTIONS',
    origin: (origin, callback) => {
      if (!origin || origin === 'null') {
        // Allow requests with no origin (like mobile apps or curl requests)
        return callback(null, true);
      }
      // Define the regular expression pattern for localhost
      const localhostPattern = /^https?:\/\/localhost(?::\d+)?$/; // Match http://localhost[:port_number]

      if (
        localhostPattern.test(origin)
        || origin === configService.get<string>('APP_DOMAIN')
      ) {
        callback(null, true);
      } else {
        callback(new InternalServerErrorException('Not allowed by CORS'));
      }
    },
  });

  // Apply the custom exception filter globally
  app.useGlobalFilters(new GlobalExceptionsFilter());

  // Set up global interceptor to standardize output using class serialization
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useWebSocketAdapter(new AuthIoAdapter(app));

  // Set up Swagger documentation
  setUpSwagger(app);

  await setUpAsyncApi(app);

  // Start the application and listen on the specified port
  await app.listen(configService.get<number>('PORT'));
}

bootstrap();

const setUpSwagger = (app: INestApplication<any>) => {
  // Configure Swagger options
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Realtime Chat App for Software Architecture Project')
    .setDescription('Chat created using Nest.js + Websockets')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Create Swagger document and set up Swagger UI
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, swaggerDocument);
};

const setUpAsyncApi = async (app: INestApplication<any>) => {
  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('Realtime Chat App API')
    .setDescription('Chat created using Nest.js + Websockets')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .addSecurity('user-password', { type: 'userPassword' })
    // .addServer('feline-ws', {
    //   url: 'ws://localhost:3000',
    //   protocol: 'socket.io',
    // })
    .build();

  const asyncapiDocument = AsyncApiModule.createDocument(app, asyncApiOptions);
  await AsyncApiModule.setup('socket-api', app, asyncapiDocument);
};