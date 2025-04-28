const PDFDocument = require('pdfkit');
const db = require('../config/db');

// Add helper functions for styling
const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
};

const drawHorizontalLine = (doc, y) => {
    doc.moveTo(50, y).lineTo(550, y).stroke();
};

const drawTableHeader = (doc, y) => {
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .text('Item', 50, y)
       .text('Category', 200, y)
       .text('Subcategory', 300, y)
       .text('Quantity', 400, y)
       .text('Return Date', 480, y);
    
    drawHorizontalLine(doc, y + 20);
};

exports.generateInvoice = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Create a new PDF document with better margins
        const doc = new PDFDocument({
            margin: 50,
            size: 'A4'
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${id}.pdf`);
        doc.pipe(res);

        const query = `
            SELECT o.*, c.name as customer_name, c.address, c.mobile
            FROM in_out o
            LEFT JOIN customer c ON o.customer = c.name
            WHERE o.in_out_id = ?
        `;
        
        db.query(query, [id], async (err, results) => {
            if (err) {
                console.error('Error fetching invoice data:', err);
                return res.status(500).json({ error: 'Error generating invoice' });
            }
            
            const outData = results[0];

            // Add company logo (if available)
            // doc.image('path/to/logo.png', 50, 45, { width: 150 });

            // Company Details - Right aligned
            doc.font('Helvetica-Bold')
               .fontSize(20)
               .text('INVOICE', 400, 45, { align: 'right' });

            doc.font('Helvetica')
               .fontSize(10)
               .text('Your Company Name', 400, 75, { align: 'right' })
               .text('Address Line 1', 400, 90, { align: 'right' })
               .text('City, State, ZIP', 400, 105, { align: 'right' })
               .text('Phone: +91 XXXXXXXXXX', 400, 120, { align: 'right' })
               .text('Email: company@example.com', 400, 135, { align: 'right' });

            // Invoice details
            doc.font('Helvetica-Bold')
               .text('Invoice No:', 50, 90)
               .font('Helvetica')
               .text(`INV-${id}`, 120, 90)
               .font('Helvetica-Bold')
               .text('Date:', 50, 105)
               .font('Helvetica')
               .text(new Date().toLocaleDateString('en-IN'), 120, 105);

            // Customer Information
            doc.roundedRect(50, 160, 500, 100, 5).stroke();
            doc.font('Helvetica-Bold')
               .fontSize(12)
               .text('Bill To:', 60, 175)
               .fontSize(10)
               .font('Helvetica')
               .text(outData.customer_name, 60, 195)
               .text(outData.address || 'N/A', 60, 210)
               .text(`Mobile: ${outData.mobile || 'N/A'}`, 60, 225);

            // Items Table
            drawTableHeader(doc, 290);
            
            // Add material info
            const materialQuery = 'SELECT * FROM material_info WHERE insert_id IN (?)';
            db.query(materialQuery, [outData.material_info.split(',')], (err, materials) => {
                if (err) {
                    console.error('Error fetching material data:', err);
                    return;
                }

                let yPosition = 320;
                let totalItems = 0;

                materials.forEach((item, index) => {
                    totalItems++;
                    doc.font('Helvetica')
                       .text((index + 1).toString(), 50, yPosition)
                       .text(item.category, 200, yPosition)
                       .text(item.subcategory, 300, yPosition)
                       .text(item.quantity.toString(), 400, yPosition)
                       .text(item.date ? new Date(item.date).toLocaleDateString('en-IN', {
                           day: '2-digit',
                           month: '2-digit', 
                           year: 'numeric'
                       }) : 'N/A', 480, yPosition);
                    
                    yPosition += 20;
                });

                // Summary section
                const summaryY = yPosition + 40;
                doc.font('Helvetica-Bold');
                drawHorizontalLine(doc, summaryY - 10);

                doc.text('Summary', 50, summaryY)
                   .font('Helvetica')
                   .text(`Total Items: ${totalItems}`, 50, summaryY + 20)
                   .text(`Deposit Amount: ${formatCurrency(outData.deposit)}`, 50, summaryY + 40);
                   
                // Footer
                const footerY = doc.page.height - 100;
                drawHorizontalLine(doc, footerY);
                doc.font('Helvetica')
                   .fontSize(8)
                   .text('Thank you for your business!', 50, footerY + 10, { align: 'center' })
                   .text('This is a computer generated invoice.', 50, footerY + 25, { align: 'center' });

                // Finalize the PDF
                doc.end();
            });
        });
        
    } catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).json({ error: 'Error generating invoice' });
    }
};

exports.getInvoice = async (req, res) => {
    // Similar to generateInvoice but for retrieving existing invoices
    // You might want to store generated PDFs and serve them from storage
    // For now, we'll generate them on demand
    return this.generateInvoice(req, res);
};
