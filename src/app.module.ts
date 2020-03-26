import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

const URI = 'mongodb+srv://aplus:aplusaplus@cluster0-eiohc.mongodb.net/nestjs-demo?retryWrites=true&w=majority';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forRoot(
      URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
