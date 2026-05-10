export const generateEstimatePDF = (estimate: any) => {
  const companyLogoBase64 = 'https://customer-assets.emergentagent.com/job_anurag-estimate-tool/artifacts/s326dyhr_image.png';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      padding: 40px;
      background: white;
      color: #000;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #333;
    }
    
    .logo {
      max-width: 300px;
      height: auto;
      margin-bottom: 15px;
    }
    
    .company-name {
      font-size: 32px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 5px;
    }
    
    .company-tagline {
      font-size: 18px;
      color: #666;
      margin-bottom: 15px;
    }
    
    .company-address {
      font-size: 14px;
      color: #444;
      line-height: 1.6;
    }
    
    .company-contacts {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 10px;
      font-weight: bold;
    }
    
    .estimate-title {
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      margin: 30px 0 20px;
      color: #1a1a1a;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 30px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    
    .info-row {
      margin-bottom: 10px;
    }
    
    .info-label {
      font-weight: bold;
      color: #333;
      font-size: 14px;
      margin-bottom: 3px;
    }
    
    .info-value {
      color: #555;
      font-size: 14px;
    }
    
    .table-container {
      margin: 30px 0;
      overflow-x: auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    th {
      background-color: #2c3e50;
      color: white;
      padding: 12px;
      text-align: left;
      font-size: 13px;
      font-weight: bold;
      border: 1px solid #1a252f;
    }
    
    td {
      padding: 10px 12px;
      border: 1px solid #ddd;
      font-size: 13px;
    }
    
    tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-center {
      text-align: center;
    }
    
    .totals-section {
      max-width: 400px;
      margin-left: auto;
      margin-top: 20px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 15px;
      font-size: 14px;
      border-bottom: 1px solid #eee;
    }
    
    .total-row.subtotal {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    
    .total-row.discount {
      color: #e74c3c;
    }
    
    .total-row.final {
      background-color: #2c3e50;
      color: white;
      font-size: 18px;
      font-weight: bold;
      border-bottom: none;
      margin-top: 10px;
    }
    
    .payment-info {
      background-color: #e8f5e9;
      padding: 15px;
      margin: 20px 0;
      border-left: 4px solid #4caf50;
      border-radius: 4px;
    }
    
    .payment-info.partial {
      background-color: #fff3e0;
      border-left-color: #ff9800;
    }
    
    .payment-info.pending {
      background-color: #fff9c4;
      border-left-color: #fbc02d;
    }
    
    .payment-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .note-section {
      margin-top: 30px;
      padding: 20px;
      background-color: #fff8e1;
      border-left: 4px solid #fbc02d;
      border-radius: 4px;
    }
    
    .note-title {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 14px;
      color: #f57f17;
    }
    
    .note-text {
      font-size: 13px;
      line-height: 1.6;
      color: #555;
    }
    
    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
      padding-top: 20px;
    }
    
    .signature-box {
      text-align: center;
      width: 200px;
    }
    
    .signature-line {
      border-top: 2px solid #000;
      margin-bottom: 10px;
      padding-top: 50px;
    }
    
    .signature-label {
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
    
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${companyLogoBase64}" class="logo" alt="Company Logo" />
    <div class="company-address">
      55, Sainath Colony, Alakhdham Nagar, Indore Road, Ujjain
    </div>
    <div class="company-contacts">
      <span>9827086001</span>
      <span>9131001671</span>
    </div>
  </div>
  
  <div class="estimate-title">ESTIMATE</div>
  
  <div class="info-section">
    <div>
      <div class="info-row">
        <div class="info-label">Customer Name:</div>
        <div class="info-value">${estimate.customer_name}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Site Address:</div>
        <div class="info-value">${estimate.site_address}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Mobile Number:</div>
        <div class="info-value">${estimate.mobile_number}</div>
      </div>
    </div>
    <div>
      <div class="info-row">
        <div class="info-label">Estimate No:</div>
        <div class="info-value">#${estimate.id.substring(0, 8).toUpperCase()}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Date:</div>
        <div class="info-value">${new Date(estimate.created_at).toLocaleDateString('en-IN')}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Field Expert:</div>
        <div class="info-value">${estimate.field_expert_name}</div>
      </div>
    </div>
  </div>
  
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th style="width: 5%;">Sr.</th>
          <th style="width: 30%;">Window Type</th>
          <th class="text-center" style="width: 15%;">Width (in)</th>
          <th class="text-center" style="width: 15%;">Height (in)</th>
          <th class="text-right" style="width: 10%;">Area (sq ft)</th>
          <th class="text-right" style="width: 10%;">Qty</th>
          <th class="text-right" style="width: 10%;">Rate/sq ft</th>
          <th class="text-right" style="width: 15%;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${estimate.measurements.map((m: any, index: number) => `
          <tr>
            <td class="text-center">${index + 1}</td>
            <td>${m.window_type}</td>
            <td class="text-center">${m.width_inches.toFixed(2)}</td>
            <td class="text-center">${m.height_inches.toFixed(2)}</td>
            <td class="text-right">${m.area_sqft.toFixed(3)}</td>
            <td class="text-right">${m.quantity}</td>
            <td class="text-right">${m.rate ? m.rate.toFixed(2) : '-'}</td>
            <td class="text-right"><strong>${m.amount ? m.amount.toFixed(2) : '-'}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="totals-section">
    <div class="total-row subtotal">
      <span>Subtotal:</span>
      <span>₹ ${estimate.subtotal.toFixed(2)}</span>
    </div>
    ${estimate.discount > 0 ? `
      <div class="total-row discount">
        <span>Discount:</span>
        <span>- ₹ ${estimate.discount.toFixed(2)}</span>
      </div>
    ` : ''}
    ${estimate.cartage > 0 ? `
      <div class="total-row">
        <span>Cartage:</span>
        <span>₹ ${estimate.cartage.toFixed(2)}</span>
      </div>
    ` : ''}
    <div class="total-row final">
      <span>Total Amount:</span>
      <span>₹ ${estimate.total.toFixed(2)}</span>
    </div>
  </div>
  
  ${estimate.advance_received > 0 || estimate.payment_status !== 'pending' ? `
    <div class="payment-info ${estimate.payment_status}">
      ${estimate.advance_received > 0 ? `
        <div class="payment-row">
          <span><strong>Advance Received:</strong></span>
          <span>₹ ${estimate.advance_received.toFixed(2)}</span>
        </div>
      ` : ''}
      <div class="payment-row">
        <span><strong>Balance Due:</strong></span>
        <span>₹ ${(estimate.total - estimate.advance_received).toFixed(2)}</span>
      </div>
      <div class="payment-row">
        <span><strong>Payment Status:</strong></span>
        <span style="text-transform: uppercase; font-weight: bold;">
          ${estimate.payment_status === 'full' ? 'PAID' : estimate.payment_status === 'partial' ? 'PARTIAL' : 'PENDING'}
        </span>
      </div>
    </div>
  ` : ''}
  
  <div class="note-section">
    <div class="note-title">Note:</div>
    <div class="note-text">
      This is an estimate based on the measurements provided. Final amount may vary based on actual installation and
      material availability. Please verify all measurements before confirming the order. <strong>GST extra.</strong>
    </div>
  </div>
  
  <div class="signature-section">
    <div class="signature-box">
      <div class="signature-line"></div>
      <div class="signature-label">Customer Signature</div>
    </div>
    <div class="signature-box">
      <div class="signature-line"></div>
      <div class="signature-label">Authorized Signature</div>
    </div>
  </div>
  
  <div class="footer">
    <p>Thank you for your business!</p>
    <p>Anurag Aluminium & Glass House</p>
  </div>
</body>
</html>
  `.trim();
};
