<div class="app-main__inner">
	<div class="app-page-title">
		<div class="page-title-wrapper">
			<div class="page-title-heading">
				<div class="page-title-icon">
					<i class="pe-7s-display1 icon-gradient bg-premium-dark"></i>
				</div>
				<div>Dashboard Category
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
							<h5 class="card-title">Data Category</h5>
							<form action="<?php echo site_url('admin/CategoryController/add_category') ?>" method="post"
								enctype="multipart/form-data">
								<div class="position-relative form-group">
									<label for="name_category" class="">Name Category</label>
									<input name="name_category" id="name_category" placeholder="Name Category"
										type="text" class="form-control">
								</div>
								<div class="position-relative form-group">
									<label for="image_category" class="">Image</label>
									<input name="image_category" id="image_category" type="file" class="form-control-file">
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
							<h5 class="card-title">Data Category</h5>
						</div>
					</div>
					<div class="main-card mb-3 card">
						<div class="card-header">Active Category	
							
						</div>
						<div class="table-responsive">
							<table class="align-middle mb-0 table table-borderless table-striped table-hover">
								<thead>
									<tr>
										<th class="text-center">#</th>
										<th class="text-center">Image</th>
										<th class="text-center">Name Category</th>
										
									</tr>
								</thead>
								<tbody>
									<?php $i = 1; ?>
									<?php foreach($category as $key => $value): ?>
									<tr>
										<td class="text-center text-muted"><?php echo $i++;?></td>
										<td class="text-center text-muted">
											<img width="40" class="rounded-circle" src="<?php echo base_url()."assets/img/category/".$value->image_category; ?>" alt=""></td>
										<td>
											<div class="widget-content p-0">
												<div class="widget-content-wrapper">
													<div class="widget-content-left flex2">
														<div class="widget-heading"><?= $value->name_category ?> </div>
														<div class="widget-subheading opacity-7">Category Handicraft</div>
													</div>
												</div>
											</div>
										</td>
										<td class="text-center">
										<button type="button" id="PopoverCustomT-2" data-toggle="modal"
												data-target="#editCategoryModal"
												class="mb-2 mr-2 btn-transition btn btn-outline-warning" onclick=edit_modal_category(<?= $value->id ?>) >Edit</button>
											<a id="PopoverCustomT-2" href="<?php echo base_url()."admin/CategoryController/delete_category/".$value->id; ?>"
												class="mb-2 mr-2 btn-transition btn btn-outline-danger">Delete</a>
										</td>
									</tr>
									<?php endforeach; ?>
									
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
