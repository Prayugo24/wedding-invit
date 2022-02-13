<div class="app-main__inner">
	<div class="app-page-title">
		<div class="page-title-wrapper">
			<div class="page-title-heading">
				<div class="page-title-icon">
					<i class="pe-7s-display1 icon-gradient bg-premium-dark"></i>
				</div>
				<div>Dashboard Supplier
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
				<div class="col-md-6">
					<div class="main-card mb-3 card">
						<div class="card-body">
							<h5 class="card-title">Data Supplier</h5>
							<form action="<?php echo site_url('admin/SupplierController/add_supplier') ?>" method="post"
								enctype="multipart/form-data">
								<div class="position-relative form-group">
									<label for="name_supplier" class="">Name Supplier</label>
									<input name="name_supplier" id="name_supplier" placeholder="name supplier"
										type="text" class="form-control">
								</div>

								<div class="position-relative form-group">
									<label for="phone" class="">Number Phone</label>
									<input name="phone" id="phone" placeholder="+6289516142887" type="number"
										class="form-control">
								</div>

								<div class="position-relative form-group">
									<label for="address" class="">Address</label>
									<textarea name="address" id="address" class="form-control"></textarea>
								</div>

								<button class="mt-1 btn btn-primary">Submit</button>
							</form>
						</div>
					</div>
				</div>

			</div>
			<div class="row">
				<div class="col-md-12">
					
					<div class="main-card mb-3 card">
						<div class="card-header">Active Supplier
						</div>
						<div class="table-responsive">
							<table class="align-middle mb-0 table table-borderless table-striped table-hover">
								<thead>
									<tr>
										<th class="text-center">#</th>
										<th>Name Supplier</th>
										<th class="text-center">Number Phone</th>
										<th class="text-center">Address</th>
										<th class="text-center">Action</th>
									</tr>
								</thead>
								<tbody>
									<?php $i = 1; ?>
									<?php foreach($supplier as $key => $value): ?>
									<tr>
										<td class="text-center text-muted"><?php echo $i++;?></td>
										<td>
											<div class="widget-content p-0">
												<div class="widget-content-wrapper">
													<div class="widget-content-left mr-3">
														<div class="widget-content-left">
															<img width="40" class="rounded-circle"
																src="assets/images/avatars/4.jpg" alt="">
														</div>
													</div>
													<div class="widget-content-left flex2">
														<div class="widget-heading"><?= $value->name_supplier ?> </div>
														<div class="widget-subheading opacity-7">Web Developer</div>
													</div>
												</div>
											</div>
										</td>

										<td class="text-center"><?= $value->address ?></td>
										<td class="text-center">
											<div class="badge badge-success"><?= $value->phone ?></div>
										</td>
										<td class="text-center">
											<button type="button" id="PopoverCustomT-2" data-toggle="modal"
												data-target="#editSupplierModal"
												class="mb-2 mr-2 btn-transition btn btn-outline-warning" onclick=edit_modal_supplier(<?= $value->id ?>) >Edit</button>
											<a id="PopoverCustomT-2" href="<?php echo base_url()."admin/SupplierController/delete_supplier/".$value->id; ?>"
												class="mb-2 mr-2 btn-transition btn btn-outline-danger">Delete</a>
												

										</td>

									</tr>
									<?php endforeach; ?>

								</tbody>
							</table>
						</div>
						<div class="d-block text-center card-footer">
							<button class="mr-2 btn-icon btn-icon-only btn btn-outline-danger"><i
									class="pe-7s-trash btn-icon-wrapper"> </i></button>
							<button class="btn-wide btn btn-success">Save</button>
						</div>
					</div>
				</div>
			</div>



		</div>

	</div>
</div>


