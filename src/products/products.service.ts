import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as uuid from 'uuid/v4';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>){}

  async insertProduct(title: string, desc: string, price: number) {
    //const newProdId = uuid();
    //const newProduct = new Product(newProdId,title,desc,price);
    const newProduct = new this.productModel({title, description: desc, price,});  
    //this.products.push(newProduct);
    const result = await newProduct.save();
    console.log(result);
    //return newProdId;
    return result.id as string;
  }

  async getAllProducts() {
    const products = await this.productModel.find().exec();
    //return products;//
    return products.map((prod)=>({id: prod.id, title: prod.title, description: prod.description, price: prod.price}));
    //return [...this.products]; //returns all products as newly created array
  }

  async getProduct(prodId: string){
  //  const product = this.findProduct(prodId)[0];
  //  return { ...product }; //returns a single product as newly created product.
    return await this.findOnlineProduct(prodId); 
  }
  async updateProduct(prodId: string, title: string, desc: string, price: number){
    const updatedProduct = await this.findOnlineProduct(prodId);
    
    if(title){
      updatedProduct.title = title;
    }
    if(desc){
      updatedProduct.description = desc;
    }
    if(price){
      updatedProduct.price = price;
    }
    await updatedProduct.save();

    return await this.getProduct(prodId);
  }

  async deleteProduct(prodId: string){
    try{
      const deleted = await this.productModel.deleteOne({_id:prodId}).exec();
      return deleted.deletedCount;
    } catch(err){
      throw new NotFoundException('Could not find product.');
    }
  }

/*
  updateProduct(prodId: string, title: string, desc: string, price: number){
    const [product, index] = this.findProduct(prodId);
    const updatedProduct = {...product};
    if(title){
      updatedProduct.title = title;
    }
    if(desc){
      updatedProduct.description = desc;
    }
    if(price){
      updatedProduct.price = price;
    }
    this.products[index] = updatedProduct;

    return {...this.products[index]};
  }

  editProduct(id: string, title: string, description: string, price: number){
    const index = this.findProduct(id)[1];
    const product = {id,title,description,price};
    this.products[index]={...product};
    
    return {...this.products[index]};
  }

  deleteProduct(prodId: string){
    const index = this.findProduct(prodId)[1];
    this.products.splice(index,1);
  }

  private findProduct(id: string): [Product, number] {
    const productIndex = this.products.findIndex((prod) => prod.id === id);
    const product = this.products[productIndex];
    if(!product){
      throw new NotFoundException('Could not find product.');
    }
    return [product, productIndex];
  }
*/
  private async findOnlineProduct(id: string): Promise<Product> {
    let product;
    try{
      product = await this.productModel.findById(id);
    } catch(err){
      throw new NotFoundException('Could not find product.');
    }
    if(!product){
      throw new NotFoundException('Could not find product.');
    }
    return product;
    //return {id: product.id, title: product.title, description: product.description, price: product.price};
  }
}