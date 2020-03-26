import { Controller, Post, Body, Get, Param, Patch, Delete, Put } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService){}

  @Post()
  async addProduct(
  // @Body() completeBody: {title: string, desc: string, price: number},
  @Body('title') prodTitle: string, 
  @Body('desc') prodDesc: string,
  @Body('price') prodPrice: number,) {
    const newProductId = await this.productService.insertProduct(prodTitle,prodDesc,prodPrice);
    return { id: newProductId }
  }

  @Get()
  async getAllProducts(){
    const products = await this.productService.getAllProducts();
    //return products;
    return products.map((prod)=>({id: prod.id, title: prod.title, description: prod.description, price: prod.price, 
      createdAt: prod.createdAt, updatedAt:prod.updatedAt}));
  }

  @Get(':id')
  async getProduct(@Param('id') prodId: string){
    const prod = await this.productService.getProduct(prodId);
    return {id: prod.id, title: prod.title, description: prod.description, price: prod.price, 
      createdAt: prod.createdAt, updatedAt:prod.updatedAt};
  }

  @Patch(':id')// patch product will update the given values only. ie) PATCH applies a partial update to the resource.
  async updateProduct(@Param('id') prodId: string,  @Body('title') prodTitle: string, 
    @Body('description') prodDesc: string, @Body('price') prodPrice: number)  {
      const prod = await this.productService.updateProduct(prodId, prodTitle,prodDesc,prodPrice);
      return {id: prod.id, title: prod.title, description: prod.description, price: prod.price};
  }
  @Delete(':id')
  async deleteProduct(@Param('id') prodId: string){
    const deletedcount = await this.productService.deleteProduct(prodId);
    return (deletedcount===1)?'Object deleted!':'Object not deleted!';
  }
/*
  @Put(':id')// PUT overwrites the entire entity if it already exists, and creates a new resource if it doesn’t exist.
  editProduct(@Param('id') id: string,  @Body() completeBody: {title: string, description: string, price: number})  {
      return this.productService.editProduct(id, completeBody.title,completeBody.description,completeBody.price);
  }

  @Delete(':id')
  deleteProduct(@Param('id') prodId: string){
    this.productService.deleteProduct(prodId);
  }
  */
}