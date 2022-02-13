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
				<div class="col-md-6">
					<div class="main-card mb-3 card">
						<div class="card-body">
							<h5 class="card-title">Data Product</h5>
							<form action="<?php echo site_url('admin/ProductController/add_product') ?>" method="post"
								enctype="multipart/form-data">
								<div class="position-relative form-group">
									<label for="name_product" class="">Name Product</label>
									<input name="name_product" id="name_product" placeholder="Name product"
										type="text" class="form-control">
								</div>
								<div class="position-relative form-group">
									<label for="panjang" class="">Panjang</label>
									<input name="panjang" id="panjang" placeholder="10 Cm"
										type="text" class="form-control">
								</div>
								<div class="position-relative form-group">
									<label for="lebar" class="">Lebar</label>
									<input name="lebar" id="lebar" placeholder="5 Cm"
										type="text" class="form-control">
								</div>
								<div class="position-relative form-group">
									<label for="tinggi" class="">Tinggi</label>
									<input name="tinggi" id="tinggi" placeholder="11 Cm"
										type="text" class="form-control">
								</div>
								<div class="position-relative form-group">
									<label for="link" class="">Link</label>
									<input name="link" id="link" placeholder="https://shopee.co.id/BASKET"
										type="text" class="form-control">
								</div>
								<div class="position-relative form-group">
									<label for="category" class="">Category</label>
									<select name="id_category" id="category" class="form-control">
										<?php foreach ($category as $key => $value) { ?>
											<option value="<?= $value->id ?>"><?= $value->name_category; ?></option>
										<?php } ?>
									</select>
								</div>
								
								<div class="position-relative form-group">
									<label for="supplier" class="">Supplier</label>
									
									<select name="id_supplier" id="supplier" class="form-control">
											<?php foreach($suppliers as $key => $value): ?>
											
											<option value="<?= $value->id ?>"><?= $value->name_supplier; ?></option>
											<?php endforeach; ?>
									</select>
								</div>

								<div class="position-relative form-group">
									<label for="description" class="">Description</label>
									<textarea name="description" id="description" class="form-control"></textarea>
								</div>
								<div class="position-relative form-group">
									<label for="image_product" class="">Image</label>
									<input name="image_product" id="image_product" type="file" class="form-control-file">
									<small class="form-text text-muted">This is some placeholder block-level help
										text for the above input. It's a bit lighter and easily wraps to a new
										line.</small>
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
						<div class="card-body">
							<h5 class="card-title">Data Product</h5>
						</div>
					</div>
					<div class="main-card mb-3 card">
						<div class="card-header">Active Product	
							
						</div>
						<div class="table-responsive">
							<table class="align-middle mb-0 table table-borderless table-striped table-hover" id="table_product">
								<thead>
									<tr>
										<th class="text-center">#</th>
										<th class="text-center">Image</th>
										<th class="text-center">Name Product</th>
										<th class="text-center">Desctiption</th>
										<th class="text-center">Supplier</th>
										<th class="text-center">Category</th>
										<th class="text-center">Link</th>
										<th class="text-center">Actions</th>
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

