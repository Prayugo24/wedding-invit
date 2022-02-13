<title>PDF invoice</title>
<!-- <link rel="stylesheet" type="text/css" href="assets/admin/template_1/assets/css_pdf/shopify-styling.css" media="all"> -->
<link rel="stylesheet" type="text/css" href="<?php echo base_url().'assets/admin/template_1/assets/css_pdf/font-primary-36045.css'; ?>" media="all">
<link rel="stylesheet" type="text/css" href="<?php echo base_url().'assets/admin/template_1/assets/css_pdf/preview-content.css'; ?>" media="all">
<link rel="stylesheet" type="text/css" href="<?php echo base_url().'assets/admin/template_1/assets/css_pdf/specific-styling.css'; ?>" media="all">


</head>

<body>
    <script src='https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
    <div class='printer-preview-content'>
        
        <script>
            $.ajaxSetup({
                cache: true
            });
            var url = 'https://orderprintertemplates.com/JsBarcode.all.min.js';
            var options = {
                format: 'CODE128',
                width: 1,
                height: 16,
                quite: 1,
                lineColor: '#000000',
                displayValue: false, //Show the text below the barcode (can be true or false)
                fontSize: 11,
                font: 'Lato',
                textAlign: 'left'
            }
            $.getScript(url, function () {
                // Barcode Generator for Order Number
                $('.barcode-64931').each(function () {
                    $(this).JsBarcode('9999', options);
                });
            });
        </script>

        <div class='printer-preview-content' contenteditable='true' spellcheck='false' title='invoice'>
            <div class='t36045'>
                <div class='row'>
					<div class='template-title' style="text-align: center;">
                        <h1 class='editable' data-key='template_type_name'>Proforma Invoice</h1>
                    </div>
                    <div id='header-row'>
                        <div class='col-xs-6'>
                            
                            <ul class='order-details'>
                                <li class='order-details-invoice'>
                                    <span class='order-details-title editable' data-key='invoice_number'>Page :</span>
                                    <span class='order-details-text'>1 Of 1</span>
                                </li>
                                <img style="height: 38px;width: 33%;padding: 3px;" class='' src='<?php echo base_url()."/assets/img/barcode/".$Shipment['image_barcode'] ?>'>
                                <li class='order-details-date'>
                                    <span class='order-details-title editable' data-key='date'>Date :</span>
                                    <span class='order-details-text'><?= date("Y-M-d", strtotime($Shipment['date'])) ?></span>
                                </li>
                                <li class='order-details-payment'>
                                    <span class='order-details-title editable' data-key='payment_method'>Date of Expiry : </span>
                                    <span class='order-details-text'><?= date("Y-M-d", strtotime($Shipment['date'])) ?></span>
                                </li>

                                <li class='order-details-shipping'>
                                    <span class='order-details-title editable' data-key='shipping_method'>Invoice #: </span>
                                    <span class='order-details-text'>[<?= $Shipment['invoice'] ?>]</span>
                                </li>
								<li class='order-details-shipping'>
                                    <span class='order-details-title editable' data-key='shipping_method'>Customer ID: </span>
                                    <span class='order-details-text'><?= 'CHR-000'.$Shipment['id_buyer'] ?></span>
                                </li>
                            </ul>
                        </div>
                        <div class='col-xs-6 col-no-margin'>
                            <div class='logo-wrapper'>
                                <img class='logo' alt='Logo'
                                    src='https://d1sv15muvzgtp9.cloudfront.net/api/file/03dmPHx9TAu9YQawyyT.png'>
                            </div>
                        </div>
                    </div>
                </div>
				
                <!--  bill to ship to -->
                <div class="row">
                    <div class='col-xs-6'>
                        <div class="bil-to">
                            <div class='address-title bill-to-title editable left' data-key='bill_to'>Bill To :</div>
                        </div>
                        
                    </div>
                    <div class="col-xs-6">
                        <div class="ship-to">
                            <div class='address-title bill-to-title editable right' data-key='bill_to'>Ship To :</div>
                        </div>
                    </div>
                </div>
				
                <div class='row'>
                    <div class='col-xs-6'>
					
                        <ul class='address bil-too'>
                            <li><b><?= $Shipment['name_company'] ?></b></li>
                            <li><b>EMAIL : <?= $Shipment['email'] ?></b></li>
                        </ul>
                    </div>
                    <div class='col-xs-6'>
                        <ul class='address ship-too'>
							<li><b><?= $Shipment['name_company'] ?></b></li>
                            <li><b>SEA PORT : <?= $Shipment['port_of_discharge'] ?></b></li>
                            <li><b>EMAIL : <?= $Shipment['email'] ?></b></li>
                        </ul>
                    </div>
                </div>
                <!-- End bill to ship to -->
                <!-- Shipment Information -->
                <div class="row">
                    <div class="col-xs-12">
                        <div class="shipment-information">
                            <div class='address-title bill-to-title editable left' data-key='bill_to'>Shipment Information :</div>
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class='col-xs-2'>
                        <ul class='shipment-info-text-left'>
                            <li>P.O.# :</li>
                            <li>P.O.Date :</li>
                            <li>Letter Of Credit # :</li>
                            <li>Currency :</li>
                            <li>Payment Terms :</li>
                            <li>Est. Ship Date :</li>
                        </ul>
                    </div>
                    <div class='col-xs-4'>
                        <ul class='shipment-info-input-left'>
                            <li><b> <input type="text" size="41" value="<?= $Shipment['invoice'].'-HNCF' ?>"> </b></li>
                            <li><b> <input type="text" size="41" value="<?= date("Y-M-d", strtotime($Shipment['date'])) ?>"> </b></li>
                            <li><b> <input type="text" size="41" value="<?= $Shipment['lc_or_credit'] ?>"> </b></li>
                            <li><b> <input type="text" size="41" value="<?= $Shipment['currency'] ?>"> </b></li>
                            <li><b> <input type="text" size="41" value="<?= $Shipment['payment_terms'] ?>"> </b></li>
                            <li><b> <input type="text" size="41" value="<?= date("Y-M", strtotime($Shipment['est_ship_date'])) ?>"> </b></li>
                        </ul>
                    </div>
                    <div class='col-xs-3'>
                        <ul class='shipment-info-text-right'>
                            <li>Mode Of Transportation :</li>
                            <li>Transportation Terms :</li>
                            <li>Number Of Packages :</li>
                            <li>Est. Gross Weight :</li>
                            <li>Est. Net Weight :</li>
                            <li>Container Total :</li>
                        </ul>
                    </div>
                    <div class='col-xs-3'>
						<!-- <table class='order-table table'>
							<tr>
								<td></td>
							</tr>
						</table> -->
                        <ul class='shipment-info-input-right'>
							<li><b> <input type="text" size="32" value="<?= $Shipment['mode_of_transport'] ?>"> </b></li>
                            <li><b> <input type="text" size="32" value="-"></b></li>
                            <li><b> <input type="text" size="32" value="<?= $Shipment['num_of_package'] ?>"> </b></li>
                            <li><b> <input type="text" size="32" value="<?= $Shipment['gross_weight'] ?>"> </b></li>
                            <li><b> <input type="text" size="32" value="<?= $Shipment['net_weight'] ?>"> </b></li>
                            <li><b> <input type="text" size="32" value="<?= $Shipment['container_total'] ?>"> </b></li>
                        </ul>
                    </div>
                </div>
                <!-- Shipment End Information -->
                <!-- Addtional Information -->
                <div class="row">
                    <div class="col-xs-12">
                        <div class="addtional-information">
                            <div class='address-title bill-to-title editable left' data-key='bill_to'>Addtional Information for Customs :</div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-2">
                        <ul class='addtional-info-text-left'>
                            <li>Reason For Export :</li>
                        </ul>
                    </div>
                    <div class="col-xs-10">
                        <ul class='addtional-info-input-left'>
                            <li><b> <input type="text" size="103" value="<?= $Shipment['reason_for_exp'] ?>"> </b></li>
                        </ul>
                    </div>
                </div>
                <div class='row'>
                    <div class='col-xs-3'>
                        <ul class='addtional-info-text-left'>
                            <li>Port of Embarkation :</li>
                            <li>Country of Origin :</li>
                            
                        </ul>
                    </div>
                    <div class='col-xs-3'>
                        <ul class='addtional-info-input-left_2'>
							<li><b> <input type="text" size="41" value="<?= $Shipment['port_of_embarkation'] ?>"> </b></li>
                            <li><b> <input type="text" size="41" value="<?= $Shipment['country_of_orgn'] ?>"> </b></li>
                            
                        </ul>
                    </div>
                    <div class='col-xs-2'>
                        <ul class='addtional-info-text-right'>
                            <li>Port Of Discharge :</li>
                            <li>AWB/BL # :</li>
                            
                        </ul>
                    </div>
                    <div class='col-xs-4'>
                        <ul class='addtional-info-input-right'>
							<li><b> <input type="text" size="40" value="<?= $Shipment['port_of_discharge'] ?>"> </b></li>
                            <li><b> <input type="text" size="40" value="<?= $Shipment['awb_or_bl'] ?>"> </b></li>
                            
                        </ul>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-xs-12 col-no-margin'>
                        <table class='order-table table as'>
                            <thead>
                                <tr>
                                    <th class='order-table-title editable' data-key='item'>Item/Part #</th>
									<th class='order-table-title editable' data-key='item'>UOM</th>
                                    <th class='order-table-title text-center editable' data-key='qty'>Description</th>
									<th class='order-table-qty text-center editable' data-key='qty'>Qty</th>
									<th class='order-table-qty text-center editable' data-key='qty'>Unit Price</th>
									<th class='order-table-qty text-center editable' data-key='qty'>Line Total</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
								<?php 
								$i = 1;
                                $subtotal = 0;
								foreach($ItemOrder as $key => $value) {?>
                                <tr>
                                    <td class='-image-wrapper'><p style='font-weight: bold;'> <b>#<?= $i++ ?></b></p>
                                    </td>
									<td class='-image-wrapper'>
										<p style='font-weight: bold;'> <?= $value->uom ?></p>
                                    </td>
                                    <td class='line-item-description text-center' >
                                        <p style='font-weight: bold;'>
										<?= $value->name_or_descrip ?></p>
											<img class='-image' src='<?php echo base_url().'assets/img/order/'.$value->image ?>' >
                                    </td>
                                    <td class='text-center line-item-qty'><?= 'x'.$value->qty ?></td>
                                    <td class='text-right no-wrap line-item-price'>
                                        <p><?= '$'.$value->price_sell ?></p>
                                    </td>
                                    
									<td class='text-right no-wrap line-item-line-price'><?= '$'.$value->price_total ?></td>
                                </tr>
								<?php 
                                    $subtotal += $value->price_total;   
                                } ?>
                            </tbody>
                        </table>

                    </div>
                </div>
                <div class='row'>
                    <div class='col-xs-8'>
                        <div class='notes'>
							<div class="special-information">
								<div class='address-title bill-to-title editable left' data-key='bill_to'>Special Note, Terms Of Sale :</div>
							</div>
								<div class="row">
									<div class="col-xs-2">
										<div class="term-conditions">
											<ul>
												<li style="margin-bottom: 45%;">Payment Terms : </li>
												<li style="margin-bottom: 20%;">Note :</li>
												<li>Bank Name :</li>
												<li style="margin-bottom: 19%;">Bank Address :</li>
												<li>Beneficiary :</li>
												<li>Account No :</li>
												<li>Swift Code :</li>
											</ul>
										</div>
									</div>
									<div class="col-xs-10">
									<div class="term-conditions-desc">
										<ul>
											<li> <b> T/T 50% Advance Deposit, 50% Settlement must 
												be made 7 days before loading the goods into the container 
												(after you pay, we will send the product and 
												original bill of lading) <br></b></li>
											<li> <b> We provide 7 days before 
												loading the goods into the container so that you can 
												pay the remaining payment, if you are late paying 
												your deposit will be lost.<br></b></li>
											<li> <b>PT BANK PEMBANGUNAN DAERAH JAWA TIMUR (bankjatim)</b></li>
											<li> <b>Jl. Jend. A. Yani No.82, Caruban, Sidoharjo, Kec. Pacitan, Kabupaten Pacitan, Jawa Timur 63511</b></li>
											<li> <b>CV. Putra Jaya</b></li>
											<li> <b>211014041</b></li>
											<li> <b>BJTMIDJA</b></li>
											
											
										</ul>
									</div>									
								</div>
								<div class="row">
									<div class="col-xs-12">
										<div class="declar">
											<b>I declare that the information mentioned above is true and correct to the best of my knowledge.</b>
										</div>
									</div>
								</div>
								
							</div>					
                        </div>
                    </div>

                    <div class='col-xs-4'>
                        <table class='pricing-table table'>
                            <tbody>

                                <tr>
                                    <td class='pricing-table-title editable' data-key='subtotal'>Subtotal</td>
                                    <td class='pricing-table-text'><?= '$'.$subtotal ?></td>
                                </tr>
								<tr>
                                    <td class='pricing-table-title editable' data-key='subtotal'>Payment Deposit 50%</td>
									<?php $paymrnt_deposit= $subtotal/2; ?>
                                    <td class='pricing-table-text'><?= '$'.($paymrnt_deposit) ?></td>
                                </tr>
                                <tr>
                                    <td class='pricing-table-title editable' data-key='shipping_handling'>S & H Insurance</td>
                                    <td class='pricing-table-text'>-</td>
                                </tr>
                                <tr class='pricing-table-total-row'>
                                    <td class='pricing-table-title editable' data-key='total'>Total</td>
                                    <td class='pricing-table-text'><?= '$'.($subtotal-$paymrnt_deposit) ?></td>
                                </tr>




                            </tbody>
                        </table>
                    </div>
                </div>

				<div class="row">
					<div class="col-xs-4">
						<b>&nbsp;&nbsp;&nbsp;&nbsp;Signature</b>
						<img style="height: 82px;display: flex;margin-top: -15px;" src="<?php echo base_url().'assets/admin/template_1/assets/images/tanda_tangan.png'; ?>" alt="">
						<b>(CEO) Prayugo Dwi </b></p>
					</div>
					<div class="col-xs-4">
						<b>Date : <?php echo date("Y-M-d") ?></b>
					</div>
				</div>
                <div class='row'>
                    <div class='col-xs-12 margin-bottom'>
                        <div class='thanks-text full-editable' data-key='thanks'>
                            <p>
                            </p>
                            <p>
                            </p>
                            <p>
                            </p>
                            <p><br>
                            </p>
                            <p><br>
                            </p>
                            <p>Thank You Very Much
                            </p>
                            <p></p>
                            <p></p>
                            <p></p>
                        </div>
                        <div class='terms-text full-editable' data-key='terms_and_conditions'>
                            <p>
                            </p>
                            <p>
                            </p>
                            <p>Have a Question? Do not hesitate to contact us</p>
                            <p><b>Goocraft.com/contact-us</b></p>
                            <p></p>
                            <p></p>
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class='col-xs-12 shop-block col-no-margin'>
                        <div class='shop-address-block full-editable' data-key='shop_block'>
                            <p>
                                <b>CEO | Prayugo Dwi </b></p>
                            <br>
                            </p>
                            <p><b>e</b>: goocraftindonesia@gmail.com <b>t</b>: +6289516142887</p>
                            <p><br>
                            </p>
                            <p>Goocraft Indonesia</p>
                        </div>
                        <div class='shop-social'>
                            
                            <img class='social-icons'
                                src='https://cdn.shopify.com/s/files/1/0398/5025/files/IG-_ICon.png?11755453313570768267'>
                            <img class='social-icons'
                                src='https://cdn.shopify.com/s/files/1/0398/5025/files/googleplus.png?4839939554867445933'>
                        </div>
                        <div class='shop-domain editable' data-key='shop_domain'>
                            Goocraft.com
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>

</html>
