<div class="app-main__inner">
	<div class="app-page-title">
		<div class="page-title-wrapper">
			<div class="page-title-heading">
				<div class="page-title-icon">
					<i class="pe-7s-display1 icon-gradient bg-premium-dark"></i>
				</div>
				<div>Company Profile
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
							<h5 class="card-title">Controls Types</h5>
							<form action="<?php echo site_url('admin/CompanyProfileController/add_profile') ?>"
								method="post" enctype="multipart/form-data">
								<div class="position-relative form-group">
									<label for="name_company" class="">Company Name</label>
									<input name="name_company" id="name_company" placeholder="Company Name" type="text"
										class="form-control">
								</div>
								<div class="position-relative form-group">
									<label for="phone" class="">Number Phone</label>
									<input name="phone" id="phone" placeholder="+6289516142887" type="number"
										class="form-control">
								</div>
								<div class="position-relative form-group">
									<label for="email" class="">Email</label>
									<input name="email" id="email" placeholder="craftvigo@gmail.com" type="email"
										class="form-control">
								</div>
								<div class="position-relative form-group">
									<label for="address" class="">Address</label>
									<textarea name="address" id="address" class="form-control"></textarea>
								</div>
								<div class="position-relative form-group">
									<label for="about" class="">About</label>
									<textarea name="about" id="about" class="form-control"></textarea>
								</div>
								<div class="position-relative form-group">
									<label for="short_about" class="">Short About</label>
									<textarea name="short_about" id="short_about" class="form-control"></textarea>
								</div>

								<div class="position-relative form-group">
									<label for="image_company" class="">Image Company</label>
									<input name="image_company" id="image_company" type="file"
										class="form-control-file">
									<small class="form-text text-muted">This is some placeholder block-level help
										text for the above input. It's a bit lighter and easily wraps to a new
										line.</small>
								</div>
								<button type="submit" class="mt-1 btn btn-primary">Submit</button>
							</form>
						</div>
					</div>
				</div>
				<div class="col-md-6">

					<div class="main-card mb-3 card">
						<div class="card-header-tab card-header">
							<div class="card-header-title">
								<i class="header-icon lnr-bicycle icon-gradient bg-love-kiss"> </i>
								Company Profile
							</div>
							
						</div>
						<div class="card-body">
							<div class="tab-content">
								<div class="tab-pane active" id="tab-eg5-0" role="tabpanel">
									<?php if (isset($profile)){?>
										
										<p>Company Name :<b> <?= $profile->name_company ?></b> </p>
										<p>Phone Number :<b> <?= $profile->phone ?></b></p>
										<p>Email :<b> <?= $profile->email ?></b></p>
										<p>Address :<b> <?= $profile->address ?></b></p>
										<p>About :<b> <?= $profile->about ?></b></p>
										<p>Short About :<b> <?= $profile->short_about ?></b></p>
										<p>Image Company :</p> <img src="<?php echo base_url().'assets/img/profile/'.$profile->image_company;?>" alt="Company Profile" class="img-fluid ">
									<?php } ?>
									
								</div>
								
							</div>
						</div>
						<div class="d-block text-right card-footer">
						<?php 
							$id_company = '';
							if (isset($profile)){
								$id_company = $profile->id;
							}?>
						
							<a href="<?php echo base_url()."admin/CompanyProfileController/delete_profile/".$id_company; ?>" class="btn-wide btn-shadow btn btn-danger">Delete</a>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</div>
