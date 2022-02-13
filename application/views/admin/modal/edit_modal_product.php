<div class="modal fade" id="editProductModal" tabindex="-1" role="dialog" aria-labelledby="editSupplierModal"
	aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="editSupplierModal">Edit Data Product</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<form action="<?php echo site_url('admin/ProductController/edit_product') ?>" method="post"
				enctype="multipart/form-data">
				<div class="modal-body">
					
						<div class="position-relative form-group">
							<label for="name_product" class="">Name Product</label>
							<input name="id_product" id="id_product_ed" placeholder="id product" type="hidden" class="form-control" >
							<input name="name_product" id="name_product_ed" placeholder="Name product" type="text"
								class="form-control">
						</div>
						<div class="position-relative form-group">
							<label for="panjang" class="">Panjang</label>
							<input name="panjang" id="panjang_ed" placeholder="10 Cm" type="text" class="form-control">
						</div>
						<div class="position-relative form-group">
							<label for="lebar" class="">Lebar</label>
							<input name="lebar" id="lebar_ed" placeholder="5 Cm" type="text" class="form-control">
						</div>
						<div class="position-relative form-group">
							<label for="tinggi" class="">Tinggi</label>
							<input name="tinggi" id="tinggi_ed" placeholder="11 Cm" type="text" class="form-control">
						</div>
						<div class="position-relative form-group">
							<label for="link" class="">Link</label>
							<input name="link" id="link_ed" placeholder="https://shopee.co.id/BASKET" type="text" class="form-control">
						</div>
						<div class="position-relative form-group">
							<label for="category" class="">Category</label>
							<select name="id_category" id="id_category_ed" class="form-control">
								<?php foreach ($category as $key => $value) { ?>
								<option value="<?= $value->id ?>"><?= $value->name_category; ?></option>
								<?php } ?>
							</select>
						</div>

						<div class="position-relative form-group">
							<label for="supplier" class="">Supplier</label>

							<select name="id_supplier" id="id_supplier_ed" class="form-control">
								<?php foreach($suppliers as $key => $value): ?>

								<option value="<?= $value->id ?>"><?= $value->name_supplier; ?></option>
								<?php endforeach; ?>
							</select>
						</div>

						<div class="position-relative form-group">
							<label for="description" class="">Description</label>
							<textarea name="description" id="description_ed" class="form-control"></textarea>
						</div>
						<div class="position-relative form-group">
							<label for="image_product" class="">Image</label>
							<input name="image_product" id="image_product" type="file" class="form-control-file">
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
