<div class="modal fade" id="editSupplierModal" tabindex="-1" role="dialog" aria-labelledby="editSupplierModal"
	aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="editSupplierModal">Edit Data Supplier</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<form action="<?php echo site_url('admin/SupplierController/edit_supplier') ?>" method="post" enctype="multipart/form-data">
			<div class="modal-body">
					<div class="position-relative form-group">
						<input type="hidden" id="id_supplier_ed" name="id">
						<label for="name_supplier" class="">Name Supplier</label>
						<input name="name_supplier" id="name_supplier_ed" placeholder="name supplier" type="text"
							class="form-control">
					</div>

					<div class="position-relative form-group">
						<label for="phone" class="">Number Phone</label>
						<input name="phone" id="phone_ed" placeholder="number phone" type="number" class="form-control">
					</div>

					<div class="position-relative form-group">
						<label for="address" class="">Address</label>
						<textarea name="address" id="address_ed" class="form-control"></textarea>
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
