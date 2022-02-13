<div class="modal fade" id="editCategoryModal" tabindex="-1" role="dialog" aria-labelledby="editCategoryModal"
	aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="editCategoryModal">Edit Data Category</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<form action="<?php echo site_url('admin/CategoryController/edit_category') ?>" method="post"
				enctype="multipart/form-data">
				<div class="modal-body">
					
						<div class="position-relative form-group">
							<label for="name_category" class="">Name Category</label>
							<input name="id_category" id="id_category_ed" placeholder="id category" type="hidden" class="form-control" >
							<input name="name_category" id="name_category_ed" placeholder="Name Category" type="text"
								class="form-control">
						</div>
						
						<div class="position-relative form-group">
							<label for="image_category" class="">Image</label>
							<input name="image_category" id="image_category" type="file" class="form-control-file">
							<small class="form-text text-muted">This is some placeholder block-level help
								text for the above input. It's a bit lighter and easily wraps to a new
								line.</small>
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
