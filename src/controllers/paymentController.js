const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const AcademyUser = require('../models/AcademyUser');
const { sendEmail } = require('../services/emailService');

exports.initializeTransaction = async (req, res, next) => {
  try {
    const { items, courseItems, totalAmount, email, phone, shippingAddress, orderType, academyUserId } = req.body;
    const primaryReferenceCode = `AB-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const dynamicTrackingCode = `TRK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const structuralLedger = await Order.create({
      reference: primaryReferenceCode,
      trackingCode: dynamicTrackingCode,
      email,
      phone: phone || '',
      shippingAddress: shippingAddress || null,
      items,
      courseItems,
      totalAmount,
      orderType,
      academyUserId: academyUserId || null,
      status: 'pending'
    });

    const responseStream = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount: totalAmount * 100, reference: primaryReferenceCode, callback_url: `${process.env.FRONTEND_URL}/verify` })
    }).then(res => res.json());

    if (!responseStream.status) return res.status(400).json({ message: 'Paystack transaction channel handshake error.' });
    res.status(200).json({ paystackData: responseStream.data, order: structuralLedger });
  } catch (err) { next(err); }
};

exports.handleWebhook = async (req, res, next) => {
  try {
    const hashSignatureMatch = crypto.createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET).update(JSON.stringify(req.body)).digest('hex');
    if (hashSignatureMatch !== req.headers['x-paystack-signature']) return res.status(401).json({ message: 'Webhook validation failure.' });

    if (req.body.event === 'charge.success') {
      const { reference, customer } = req.body.data;
      const matrixOrder = await Order.findOne({ reference }).populate('items.product courseItems.course');

      if (matrixOrder && matrixOrder.status !== 'paid') {
        matrixOrder.status = 'paid';
        await matrixOrder.save();

        let structuralItemsRowsHtml = '';
       
        if (matrixOrder.orderType === 'academy' && matrixOrder.academyUserId) {
          const studentProfile = await AcademyUser.findById(matrixOrder.academyUserId);
          if (studentProfile) {
            matrixOrder.courseItems.forEach(item => {
              studentProfile.purchasedCourses.push({ course: item.course._id, practicalDate: item.practicalDate });
              structuralItemsRowsHtml += `
                <tr>
                  <td style="padding: 12px 0; color: #4b5563; font-size: 15px;">${item.course.courseTitle} (Academy Course)<br/><small style="color:#6b7280;">Practical Reference Date: ${item.practicalDate || 'Unscheduled'}</small></td>
                  <td style="padding: 12px 0; color: #4b5563; font-size: 15px; text-align: center;">1</td>
                  <td style="padding: 12px 0; color: #1f2937; font-size: 15px; font-weight: 600; text-align: right;">₦${item.price.toLocaleString()}</td>
                </tr>`;
            });
            await studentProfile.save();
          }
        } else {
          matrixOrder.items.forEach(item => {
            const logisticsContext = item.product.shippingFee > 0 ? `<br/><small style="color:#6b7280;">Shipping (${item.product.shippingType}): ₦${item.product.shippingFee}</small>` : '';
            structuralItemsRowsHtml += `
              <tr>
                <td style="padding: 12px 0; color: #4b5563; font-size: 15px;">${item.product.productName}${logisticsContext}</td>
                <td style="padding: 12px 0; color: #4b5563; font-size: 15px; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px 0; color: #1f2937; font-size: 15px; font-weight: 600; text-align: right;">₦${(item.price * item.quantity).toLocaleString()}</td>
              </tr>`;
          });
        }

        const dynamicReceiptMessageHtml = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #0F172A; padding: 35px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Transaction Confirmed</h1>
              <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Applied Biotech International Nigeria Limited</p>
            </div>
            <div style="padding: 35px 30px; background-color: #ffffff;">
              <p style="color: #4b5563; font-size: 15px; line-height: 1.5; margin-top: 0;">Thank you for your purchase. Your payment was safely received and matched against our centralized ledger system logs.</p>
             
              <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Order Reference ID:</td>
                  <td style="padding: 6px 0; color: #1f2937; font-weight: 600; text-align: right;">${reference}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">System Tracking Code:</td>
                  <td style="padding: 6px 0; color: #0284c7; font-weight: 600; text-align: right;">${matrixOrder.trackingCode}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Payment Gateway Channel:</td>
                  <td style="padding: 6px 0; color: #1f2937; text-align: right;">Paystack Secured Engine</td>
                </tr>
              </table>

              <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 8px;">Purchased Manifest Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <th style="text-align: left; padding: 8px 0; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Item Parameter</th>
                    <th style="text-align: center; padding: 8px 0; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Qty</th>
                    <th style="text-align: right; padding: 8px 0; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${structuralItemsRowsHtml}
                </tbody>
                <tfoot>
                  <tr style="border-top: 2px solid #e2e8f0;">
                    <td colspan="2" style="padding: 15px 0 0 0; color: #1f2937; font-weight: 700; font-size: 16px;">Total Amount Settled:</td>
                    <td style="padding: 15px 0 0 0; color: #004B87; font-weight: 700; font-size: 18px; text-align: right;">₦${matrixOrder.totalAmount.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>

              <div style="margin-top: 35px; background-color: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #4b5563; font-size: 14px;">Need to check real-time full logistics fulfillment tracking steps?</p>
                <a href="${process.env.FRONTEND_URL || 'https://appliedbiotechfrontend.vercel.app'}/track/${matrixOrder.trackingCode}" style="color: #004B87; font-weight: 600; text-decoration: none; font-size: 14px; display: inline-block; margin-top: 8px;">Open Live Tracking Dashboard &rarr;</a>
              </div>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">&copy; 2026 Applied Biotech International Nigeria Limited. All rights reserved.</p>
            </div>
          </div>
        `;
       
        await sendEmail(customer.email, "Applied Biotech - Digital Transaction Receipt Statement", dynamicReceiptMessageHtml);

        const globalOperationalStafflist = await User.find({ role: { $in: ['admin', 'editor'] } });
        for (const worker of globalOperationalStafflist) {
          await sendEmail(worker.email, "System Alert Notification Ledger: New Processing Log Secured", `<p>Order Node context with transaction index ${reference} resolved successfully via gateway hook layers.</p>`);
        }
      }
    }
    res.sendStatus(200);
  } catch (err) { next(err); }
};

exports.getTransactionsLedgerLog = async (req, res, next) => {
  try { res.status(200).json(await Order.find().sort({ createdAt: -1 }).populate('items.product courseItems.course')); } catch (err) { next(err); }
};

exports.retrieveSpecificOrderContextViaTracking = async (req, res, next) => {
  try {
    const resultLog = await Order.findOne({ trackingCode: req.params.code }).populate('items.product courseItems.course');
    if (!resultLog) return res.status(404).json({ message: 'Tracking reference mismatch.' });
    res.status(200).json(resultLog);
  } catch (err) { next(err); }
};

exports.retrieveSpecificOrderContextViaReference = async (req, res, next) => {
  try {
    const orderLog = await Order.findOne({ reference: req.params.reference }).populate('items.product courseItems.course');
    if (!orderLog) return res.status(404).json({ message: 'Order reference parameter untraceable.' });
    res.status(200).json(orderLog);
  } catch (err) { next(err); }
};

exports.modifyTrackingOrderStatus = async (req, res, next) => {
  try {
    const { status, eta } = req.body;
    const updateFields = { status };
    if (eta !== undefined) updateFields.eta = eta;

    const updatedModelRecord = await Order.findByIdAndUpdate(req.params.id, updateFields, { new: true });
   
    let etaNotificationSnippet = "";
    if (updatedModelRecord.eta) {
      etaNotificationSnippet = `<p>Estimated Delivery Arrival (ETA): <strong>${new Date(updatedModelRecord.eta).toDateString()}</strong></p>`;
    }

    await sendEmail(
      updatedModelRecord.email,
      `Tracking Update Notice: ${updatedModelRecord.trackingCode}`,
      `<p>Your order state transformation progress indicator has transitioned to: <strong>${status.toUpperCase()}</strong></p>${etaNotificationSnippet}`
    );
    res.status(200).json(updatedModelRecord);
  } catch (err) { next(err); }
};
