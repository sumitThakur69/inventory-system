const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendLowStockAlert = async (product, recipients) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients.join(','),
    subject: `Low Stock Alert: ${product.name}`,
    html: `
      <h2>Low Stock Alert</h2>
      <p>The following product is running low on stock:</p>
      <ul>
        <li><strong>Product:</strong> ${product.name}</li>
        <li><strong>SKU:</strong> ${product.sku}</li>
        <li><strong>Current Stock:</strong> ${product.stock.current}</li>
        <li><strong>Minimum Stock:</strong> ${product.stock.minimum}</li>
      </ul>
      <p>Please restock this item as soon as possible.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Low stock alert sent successfully');
  } catch (error) {
    console.error('Error sending low stock alert:', error);
  }
};

const sendOrderConfirmation = async (order, customerEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <ul>
        <li><strong>Order Number:</strong> ${order.orderNumber}</li>
        <li><strong>Total:</strong> $${order.total}</li>
        <li><strong>Status:</strong> ${order.status}</li>
      </ul>
      <p>We'll send you updates as your order progresses.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation:', error);
  }
};

module.exports = {
  sendLowStockAlert,
  sendOrderConfirmation
};