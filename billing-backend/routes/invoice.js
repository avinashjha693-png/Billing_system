import PDFDocument from "pdfkit";
import {Router} from 'express';
import {Invoice, NextInvoiceId,Products} from '../data/store.js';
import {Customer} from '../data/store.js';

const router = Router();
const taxRate=0.1;

router.get("/", (req, res) => {
    return res.json(Invoice);
})
router.post("/", (req, res) => {
    const {customerId, items,discountPercent=0} = req.body;
    const customer = Customer.find((c) => c.id === customerId);
    if(!customer){
        return res.status(400).json({error: "Invalid customerId"});
    }
    if(!items || !Array.isArray(items) || items.length === 0){
        return res.status(400).json({error: "Invalid request body"});
    }
    const lineItems = [];
    for(const item of items){
        const product = Products.find((p) => p.id === item.productId);
        if(!product){
    return res.status(400).json
    ({error:`Invalid productId: ${item.productId}` })

    }
    const lineTotal=product.price*item.qty;

    lineItems.push({
        productId: product.id,
      name: product.name,
      price: product.price,
      qty: item.qty,
      lineTotal: lineTotal


    });
    
    
    
    
    
    
}
const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

    const discountAmount = subtotal * (discountPercent / 100);

    const discountedSubtotal = subtotal - discountAmount;

    const tax = discountedSubtotal * taxRate;

    
    const total = discountedSubtotal + tax;


    const newInvoice = {
        id: NextInvoiceId(),
        customerName: customer.name,
        items: lineItems,
        subtotal: subtotal,
        discountPercent: discountPercent,
        discountAmount: discountAmount,
        tax: tax,
        total: total,
        status: "unpaid",
        paymentMode:"",
    
    };

    
    Invoice.push(newInvoice);

    
    res.status(201).json(newInvoice);
});
router.get("/:id",(req,res)=>{
    const invoice=Invoice.find((inv)=>inv.id===Number(req.params.id));
    if(!invoice){
        return res.status(404).json({error:"invoice not ffound"});
    }
    else{
        return res.json(invoice);
    }



});
router.patch("/:id",(req,res)=>{
    const invoice=Invoice.find((inv)=>inv.id===Number(req.params.id));
    if(!invoice){
    return res.status(404).json({error:"invoice not ffound"});
    }
    const {status,paymentMode}=req.body;
    if (status !== "paid" && status !== "unpaid"){
        return res.status(400).json({error:"Invalid status value"});
    }
    
        invoice.status=status;
        invoice.paymentMode=paymentMode||"";
        res.json(invoice);

    });
//pdf
router.get("/:id/pdf", (req, res) => {
  const invoice = Invoice.find((inv) => inv.id === Number(req.params.id));
  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found" });
  }

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=invoice-${invoice.id}.pdf`);
  doc.pipe(res);
  // Header
  doc.fontSize(24).font("Helvetica-Bold").text("INVOICE", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(10).font("Helvetica").text(`Invoice #${invoice.id}`, { align: "center" });
  doc.moveDown(1.5);

  // Customer info
  doc.fontSize(12).font("Helvetica-Bold").text("Bill To:");
  doc.font("Helvetica").text(invoice.customerName);
  doc.moveDown(1);

  // Line separator
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  // Table header
  doc.font("Helvetica-Bold");
  doc.text("Item", 50, doc.y, { width: 200, continued: false });
  doc.text("Qty", 260, doc.y - doc.currentLineHeight(), { width: 60 });
  doc.text("Price", 330, doc.y - doc.currentLineHeight(), { width: 80 });
  doc.text("Total", 420, doc.y - doc.currentLineHeight(), { width: 80 });
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.3);

  // Table rows
  doc.font("Helvetica");
  invoice.items.forEach((item) => {
    const rowY = doc.y;
    doc.text(item.name, 50, rowY, { width: 200 });
    doc.text(String(item.qty), 260, rowY, { width: 60 });
    doc.text(`Rs. ${item.price}`, 330, rowY, { width: 80 });
    doc.text(`Rs. ${item.lineTotal}`, 420, rowY, { width: 80 });
    doc.moveDown(0.7);
  });

  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1);

  // Totals section, right-aligned
  const totalsX = 350;
  doc.font("Helvetica").text(`Subtotal:`, totalsX, doc.y, { continued: true, width: 100 });
  doc.text(`Rs. ${invoice.subtotal}`, { align: "right" });

  if (invoice.discountPercent) {
    doc.text(`Discount (${invoice.discountPercent}%):`, totalsX, doc.y, { continued: true, width: 100 });
    doc.text(`- Rs. ${invoice.discountAmount}`, { align: "right" });
  }

  doc.text(`Tax:`, totalsX, doc.y, { continued: true, width: 100 });
  doc.text(`Rs. ${invoice.tax}`, { align: "right" });

  doc.moveDown(0.3);
  doc.font("Helvetica-Bold").fontSize(13);
  doc.text(`Total:`, totalsX, doc.y, { continued: true, width: 100 });
  doc.text(`Rs. ${invoice.total}`, { align: "right" });

  doc.moveDown(1.5);
  doc.fontSize(11).font("Helvetica");
  doc.text(`Status: ${invoice.status.toUpperCase()}`);

  
  

  
  
  

  
  
  
  
  
  
  
  

  
  
  
  
  
  

  doc.end();
});    
  





export default router;
