<div class="modal fade" id="addInvoiceModal" tabindex="-1" role="dialog" aria-labelledby="addInvoiceModal"
	aria-hidden="true">
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="addInvoiceModal">Add Invoice</h5>
				<div class="form-check close">
					<input class="form-check-input" type="checkbox" value="" id="checkDeveloper" onclick="developerTest()">
					<label class="form-check-label" for="flexCheckDefault">
						Test Developer
					</label>
				</div>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<form action="<?php echo site_url('admin/InvoiceController/add_invoice') ?>" method="post"
				enctype="multipart/form-data">
				<div class="modal-body">
					<div class="row">
						<div class="col-md-6">
							<div class="modal-header">
								<h5 class="modal-title">Bill To & Ship To</h5>
							</div>
							<div class="position-relative form-group">
								<label for="name_receiver" class="">Name Receiver</label>
								<input name="name_receiver" id="name_receiver" placeholder="Mickael" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="name_company" class="">Company Name</label>
								<input name="name_company" id="name_company" placeholder="PT.Indosiar" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="email" class="">Email</label>
								<input name="email" id="email" placeholder="goocraftindonesia@gmail.com" type="email" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="website" class="">Website</label>
								<input name="website" id="website" placeholder="www.goocraft.com" type="text" class="form-control">
							</div>
							<!-- <div class="position-relative form-group">
								<label for="sea_port" class="">Sea Port</label>
								<input name="sea_port" id="sea_port" placeholder="Hamburg port in GERMANY" type="text" class="form-control">
							</div> -->
							<div class="position-relative form-group">
								<label for="city" class="">City</label>
								<input name="city" id="city" placeholder="City" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="zip_code" class="">Zip Code</label>
								<input name="zip_code" id="zip_code" placeholder="25121" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="address" class="">Address</label>
								<textarea name="address" class="form-control" id="Address" rows="3" placeholder="Jl. H. Agus Salim No."></textarea>
							</div>
							<!-- <div class="position-relative form-group">
								<label for="date" class="">Date</label>
								<div class='input-group date' id='date_picker_invoice'>
									<input name="date" id="date" type='date' class="form-control" placeholder="18/11/2021"/>
									<span class="input-group-addon">
									<span class="glyphicon glyphicon-calendar"></span>
									</span>
								</div>
							</div> -->
							
						
						</div>
						<div class="col-md-6">
							<div class="modal-header">
								<h5 class="modal-title" id="addInvoiceModal">Addtional Information for Customs</h5>
							</div>
							<div class="position-relative form-group">
								<label for="reason_export" class="">Reason for Export </label>
								<input name="reason_export" id="reason_export" placeholder="PRODUCTION AND CHARITY DISTRIBUTION" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="port_embarkation" class="">Port of Embarkation </label>
								<input name="port_embarkation" id="port_embarkation" placeholder="TANJUNG PRIOK JAKARTA PORT" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="country_origin" class="">Country of Origin</label>
								<input name="country_origin" id="country_origin" placeholder="INDONESIA" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="port_discharge" class="">Port of Discharge</label>
								<input name="port_discharge" id="port_discharge" placeholder="SEA PORT OF HAMBURG PORT IN GERMANY" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="awb_bl" class="">AWB/BL</label>
								<input name="awb_bl" id="awb_bl" placeholder="AWB/BL #:" type="text" class="form-control">
							</div>
						</div>
						
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="modal-header">
								<h5 class="modal-title" >Ship Information</h5>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="position-relative form-group">
								<label for="pre_order" class="">P.O</label>
								<input name="pre_order" id="pre_order" placeholder="Baskets Seagras" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="lc_or_credit" class="">Lc/Credit</label>
								<select name="lc_or_credit" class="form-control" aria-label="Default select example">
									<option selected value="no">No</option>
									<option value="yes">Yes</option>
								</select>
							</div>
							<div class="position-relative form-group">
								<label for="currency" class="">Currency</label>
								<input name="currency" id="currency" placeholder="UNITED STATES DOLLAR" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="payment_terms" class="">Payment Terms</label>
								<input name="payment_terms" id="payment_terms" placeholder="50 % FOR DEPOSIT" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="mode_transportation" class="">Mode of Transportation</label>
								<input name="mode_transportation" id="mode_transportation" placeholder="Ship" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="pre_order_date" class="">P.O Date</label>
								<div class='input-group date' id='date_picker_invoice'>
									<input name="pre_order_date" id="pre_order_date" type='date' class="form-control" placeholder="05 August TH, 2021"/>
									<span class="input-group-addon">
									<span class="glyphicon glyphicon-calendar"></span>
									</span>
								</div>
							</div>
							<div class="position-relative form-group">
								<label for="est_ship_date" class="">Est. Ship Date</label>
								<div class='input-group date' id='date_picker_invoice'>
									<input name="est_ship_date" id="est_ship_date" type='date' class="form-control" placeholder="September, 2021"/>
									<span class="input-group-addon">
									<span class="glyphicon glyphicon-calendar"></span>
									</span>
								</div>
							</div>
							
						</div>
						<div class="col-md-6">
							<div class="position-relative form-group">
								<label for="number_package" class="">Number of Packages</label>
								<textarea name="number_package" class="form-control" id="number_package" rows="2" placeholder="Master Boxs @ 10 kg = 10.000 pcs eflute Inner Boxs and plastic @ 1 kg= 100.000 pcs eflute"></textarea>
							</div>
							<div class="position-relative form-group">
								<label for="gross_weight" class="">Est. Gross Weight</label>
								<input name="gross_weight" id="gross_weight" placeholder="30 Metric Tons(1 Container 40feet )" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="net_weight" class="">Est. Net Weight</label>
								<input name="net_weight" id="net_weight" placeholder="25 Metric Tons(1 container 40feet )" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="net_weight_tot" class="">Est. Net Weight Total</label>
								<input name="net_weight_tot" id="net_weight_tot" placeholder="25 Metric Tons x 4 containers" type="text" class="form-control">
							</div>
							<div class="position-relative form-group">
								<label for="container_tot" class="">Container Total</label>
								<input name="container_tot" id="container_tot" placeholder="4 Container Total" type="text" class="form-control">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="modal-header">
								<h5 class="modal-title">Item / Part</h5>
								<input name="count_item" id="count_item" placeholder="count item" type="hidden" class="form-control">
								<button type="button" class="close" onclick="addInputInvoice()">
									<span aria-hidden="true">+</span>
								</button>
							</div>
						</div>
					</div>
					<div class="row" id="addInputInvoice">
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					<button type="submit" class="btn btn-primary">Save changes</button>
				</div>
			</form>
		</div>
	</div>
</div>
