export const Invoice=[];
export const Products = [
    { id: 1, name: "Laptop", price: 1200 },
    { id: 2, name: "Mouse", price: 25 },
    { id: 3, name: "Keyboard", price: 60 }
];
export const Customer=[];

let invoiceId=1;
export function NextInvoiceId(){
    return invoiceId++;
}
let productId = Products.length + 1;
export function NextProductId(){
    return productId++;
}
let customerId=1;
export function NextCustomerId(){
    return customerId++;
}