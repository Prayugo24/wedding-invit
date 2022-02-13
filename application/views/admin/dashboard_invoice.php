<div class="app-main__inner">
	<div class="app-page-title">
		<div class="page-title-wrapper">
			<div class="page-title-heading">
				<div class="page-title-icon">
					<i class="pe-7s-display1 icon-gradient bg-premium-dark"></i>
				</div>
				<div>Dashboard Product
					<div class="page-title-subheading">Wide selection of forms controls, using the
						Bootstrap 4 code base, but built with React.
					</div>
				</div>
			</div>

		</div>
	</div>
	<?php if ($this->session->flashdata('success')): ?>
	<div class="alert alert-success" role="alert">
		<?php echo $this->session->flashdata('success'); ?>
	</div> 
	<?php elseif ($this->session->flashdata('delete')): ?>
		<div class="alert alert-danger" role="alert">
		<?php echo $this->session->flashdata('delete'); ?>
	</div> 
	<?php endif; ?>
	<div class="tab-content">
		<div class="tab-pane tabs-animation fade show active" id="tab-content-0" role="tabpanel">
			<div class="row">
				<div class="col-md-12">
					
					<div class="main-card mb-3 card">
						<div class="card-header">
							<button type="button" onclick="add_modal_invoice()" class="btn btn-success" data-toggle="modal" data-target="#addInvoiceModal">Add Invoice</button>
							
						</div>
						<div class="table-responsive">
							<table class="align-middle mb-0 table table-borderless table-striped table-hover" id="table_invoice">
								<thead>
									<tr>
										<th class="text-center">Invoice #</th>
										<th class="text-center">Company Name</th>
										<th class="text-center">Ship To</th>
										<th class="text-center">Date</th>
										<th class="text-center">Status</th>
										<th class="text-center">Proforma Invoice</th>
										<th class="text-center">Invoice</th>
										<th class="text-center">Action</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
						<div class="d-block text-center card-footer">
							
						</div>
					</div>
				</div>

			</div>
		</div>

	</div>
</div>

