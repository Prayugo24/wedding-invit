<div class="app-wrapper-footer">
    <div class="app-footer">
        <div class="app-footer__inner">
        	<div class="app-footer-left">
              <ul class="nav">
                <li class="nav-item">
                  <a href="javascript:void(0);" class="nav-link">
                    Footer Link 1
                  </a>
                </li>
                <li class="nav-item">
                  <a href="javascript:void(0);" class="nav-link">
                  	Footer Link 2
                  </a>
                </li>
              </ul>
            </div>
            <div class="app-footer-right">
             <ul class="nav">
               	<li class="nav-item">
                	<a href="javascript:void(0);" class="nav-link">
                    	Footer Link 3
                	</a>
                </li>
            	<li class="nav-item">
                    <a href="javascript:void(0);" class="nav-link">
                        <div class="badge badge-success mr-1 ml-0">
                            <small>NEW</small>
                        </div>
                        Footer Link 4
                    </a>
                </li>
             </ul>
            </div>
        </div>
    </div>
</div>    
</div>
<script src="http://maps.google.com/maps/api/js?sensor=true"></script>
</div>
</div>

</body>
<script type="text/javascript" src=<?php echo base_url()."assets/admin/template_1/assets/js/main.js" ?>></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>  
<script src="https://cdn.datatables.net/1.10.12/js/dataTables.bootstrap.min.js"></script>            
<link rel="stylesheet" href="https://cdn.datatables.net/1.10.12/css/dataTables.bootstrap.min.css" />  
<script type="text/javascript" language="javascript" >   
 	var tabel = null;
    $(document).ready(function() {
        tabel = $('#table_product').DataTable({
            "processing": true,
            "serverSide": true,
            "ordering": true, // Set true agar bisa di sorting
            "order": [[ 0, 'asc' ]], // Default sortingnya berdasarkan kolom / field ke 0 (paling pertama)
            "ajax":
            {
                "url": "<?php echo base_url().'admin/ProductController/product_json2'; ?>", // URL file untuk proses select datanya
                "type": "POST",
				"dataType": 'JSON',

            },
            "deferRender": true,
            "aLengthMenu": [[5, 10, 50],[ 5, 10, 50]], // Combobox Limit
            "columns": [
                { "data": 'id_product' }, // Tampilkan nis
				{ "render": function ( data, type, row ) { // Tampilkan kolom aksi
					
                        var html  = '<img width="40" class="rounded-circle" src="assets/img/product/'+row.name_image+'" alt="">'
                        console.log(html);
                        return html
                    }
                },
                { "data": 'name_product' }, // Tampilkan nis
				{ "data": 'description' }, // Tampilkan nis
				{ "data": 'name_supplier' }, // Tampilkan nis
				{ "data": 'name_category' }, // Tampilkan nis
				{ "data": 'link' }, // Tampilkan nis
                { "render": function ( data, type, row ) { // Tampilkan kolom aksi
						
						var url_delete = "<?php echo base_url().'admin/ProductController/delete_product/'; ?>"+row.id_product
                        var html  = '<button type="button" id="PopoverCustomT-2" data-toggle="modal" data-target="#editProductModal" class="mb-2 mr-2 btn-transition btn btn-outline-warning" onclick=edit_modal_product('+row.id_product+') >Edit</button>'
                        html += '<a id="PopoverCustomT-2" href="'+url_delete+'" class="mb-2 mr-2 btn-transition btn btn-outline-danger">Delete</a>'
                        return html
                    }
                },
            ],
        });
    });

	var tabel = null;
    $(document).ready(function() {
        tabel = $('#table_invoice').DataTable({
            "processing": true,
            "serverSide": true,
            "ordering": true, // Set true agar bisa di sorting
            "order": [[ 0, 'asc' ]], // Default sortingnya berdasarkan kolom / field ke 0 (paling pertama)
            "ajax":
            {
                "url": "<?php echo base_url().'admin/InvoiceController/invoice_json'; ?>", // URL file untuk proses select datanya
                "type": "POST",
				"dataType": 'JSON',

            },
            "deferRender": true,
            "aLengthMenu": [[5, 10, 50],[ 5, 10, 50]], // Combobox Limit
            "columns": [
				{ "data": 'invoice' }, // Tampilkan nis
                { "data": 'name_company' }, // Tampilkan nis
				{ "data": 'port_of_discharge' }, // Tampilkan nis
				{ "data": 'date' }, // Tampilkan nis
				{ "render": function ( data, type, row ) { // Tampilkan kolom aksi
						var status = row.status
						var html  = ''
						if(status==1){
							html += '<p>Lunas</p>'
						}else{
							html += '<p>Belum Lunas</p>'
						}
                        return html
                    }
                },
                { "render": function ( data, type, row ) { // Tampilkan kolom aksi
						var url = "<?php echo base_url().'view-proforma-invoice/'; ?>"+row.id_buyer;
                        var html  = ''
                        html += '<a target="_blank"  href="'+url+'" class="mb-2 mr-2 btn-transition btn btn-outline-success">Preview</a>'
                        return html
                    }
                },
				{ "render": function ( data, type, row ) { // Tampilkan kolom aksi
					var url = "<?php echo base_url().'view-comercial-invoice/'; ?>"+row.id_buyer;
						
                        var html  = ''
                        html += '<a target="_blank"  href="'+url+'" class="mb-2 mr-2 btn-transition btn btn-outline-success">Preview</a>'
                        return html
                    }
                },
				{ "render": function ( data, type, row ) { // Tampilkan kolom aksi
						
						var url_delete = "<?php echo base_url().'admin/InvoiceController/delete_invoice/'; ?>"+row.id_buyer
                        var html  = '<button type="button" id="PopoverCustomT-2" data-toggle="modal" data-target="#editInvoiceModal" class="mb-2 mr-2 btn-transition btn btn-outline-warning" onclick=edit_modal_invoice('+row.id_buyer+') >Edit</button>'
                        html += '<a id="PopoverCustomT-2" href="'+url_delete+'" class="mb-2 mr-2 btn-transition btn btn-outline-danger">Delete</a>'
                        return html
                    }
                },
            ],
        });
    });
 </script> 
<script>
	function developerTest(){
		var checkBox = document.getElementById("checkDeveloper")

		if (checkBox.checked == true){
			$('#name_receiver').val("Developer");
			$('#name_company').val("PT Indo Abadi");
			$('#email').val("goocraftindonesia@gmail.com");
			$('#website').val("www.goocraft.com");
			$('#sea_port').val("Hamburg port in GERMANY");
			$('#city').val("City");
			$('#zip_code').val("25121");
			$('#Address').val("Jl. H. Agus Salim No.");
			$('#date').val("18/11/2021");
			$('#reason_export').val("PRODUCTION AND CHARITY DISTRIBUTION");
			$('#port_embarkation').val("TANJUNG PRIOK JAKARTA PORT");
			$('#country_origin').val("INDONESIA");
			$('#port_discharge').val("SEA PORT OF HAMBURG PORT IN GERMANY");
			$('#awb_bl').val("AWB/BL #:");
			$('#pre_order').val("Baskets Seagras");
			$('#currency').val("UNITED STATES DOLLAR");
			$('#payment_terms').val("50 % FOR DEPOSIT");
			$('#mode_transportation').val("Ship");
			$('#pre_order_date').val("18/11/2021");
			$('#est_ship_date').val("18/12/2021");
			$('#number_package').val("Master Boxs @ 10 kg = 10.000 pcs eflute Inner Boxs and plastic @ 1 kg= 100.000 pcs eflute");
			$('#gross_weight').val("30 Metric Tons(1 Container 40feet )");
			$('#net_weight').val("25 Metric Tons(1 container 40feet )");
			$('#net_weight_tot').val("25 Metric Tons x 4 containers");
			$('#container_tot').val("4 Container Total");

		} else {
			$('#name_receiver').val("");
			$('#name_company').val("");
			$('#email').val("");
			$('#website').val("");
			$('#sea_port').val("");
			$('#city').val("");
			$('#zip_code').val("");
			$('#Address').val("");
			$('#date').val("");
			$('#reason_export').val("");
			$('#port_embarkation').val("");
			$('#country_origin').val("");
			$('#port_discharge').val("");
			$('#awb_bl').val("");
			$('#pre_order').val("");
			$('#currency').val("");
			$('#payment_terms').val("");
			$('#mode_transportation').val("");
			$('#pre_order_date').val("");
			$('#est_ship_date').val("");
			$('#number_package').val("");
			$('#gross_weight').val("");
			$('#net_weight').val("");
			$('#net_weight_tot').val("");
			$('#container_tot').val("");
		}

	}
	
	function addInputInvoice(){
		var count = $('#count_item').val() ? $('#count_item').val() : 0;
		
		numbers = parseInt(count);
		console.log(numbers);
		var newRow = `<div class="col-md-4">
			<br>
			<h5 class="modal-title">Product `+numbers+`</h5>
			<div class="position-relative form-group">
				<label for="name_product_`+numbers+`" class="">Name Product</label>
				<input name="name_product_`+numbers+`" id="name_product_`+numbers+`" placeholder="Baskets Seagrass" type="text" class="form-control">
			</div>
			<div class="position-relative form-group">
				<label for="price_normal_`+numbers+`" class="">Price Normal</label>
				<input name="price_normal_`+numbers+`" id="price_normal_`+numbers+`" placeholder="200000" type="number" class="form-control">
			</div>
			<div class="position-relative form-group">
				<label for="price_sell_`+numbers+`" class="">Price Sell</label>
				<input name="price_sell_`+numbers+`" id="price_sell_`+numbers+`" placeholder="200000" type="number" class="form-control">
			</div>
			<div class="position-relative form-group">
				<label for="qty_`+numbers+`" class="">Qty</label>
				<input name="qty_`+numbers+`" id="qty_`+numbers+`" placeholder="0" type="number" class="form-control">
			</div>
			<div class="position-relative form-group">
				<label for="image_product_`+numbers+`" class="">Image</label>
				<input name="image_product_`+numbers+`" id="image_product_`+numbers+`" type="file" class="form-control-file">
				<small class="form-text text-muted">This is some placeholder block-level help
					text for the above input. It's a bit lighter and easily wraps to a new
				line.</small>
			</div>
		</div>`;
		
		numbers = parseInt(count)+1;
		$('#count_item').val(numbers);
		// $(newRow).append("#"+idTransaction );
		$('#addInputInvoice').append(newRow);
	}
	
	function addInputInvoiceEdit(){
		
		var count = $('#ed_count_item').val();
		numberss = parseInt(count);
		console.log(numberss);
		var newRow = `<div class="col-md-4">
			<br>
			<h5 class="modal-title">Product `+numberss+`</h5>
			<div class="position-relative form-group">
				<label for="name_product_`+numberss+`" class="">Name Product</label>
				<input name="name_product_`+numberss+`" id="name_product_`+numberss+`" placeholder="Baskets Seagrass" type="text" class="form-control">
			</div>
			<div class="position-relative form-group">
				<label for="price_normal_`+numberss+`" class="">Price Normal</label>
				<input name="price_normal_`+numberss+`" id="price_normal_`+numberss+`" placeholder="200000" type="number" class="form-control">
			</div>
			<div class="position-relative form-group">
				<label for="price_sell_`+numberss+`" class="">Price Sell</label>
				<input name="price_sell_`+numberss+`" id="price_sell_`+numberss+`" placeholder="200000" type="number" class="form-control">
			</div>
			<div class="position-relative form-group">
				<label for="qty_`+numberss+`" class="">Qty</label>
				<input name="qty_`+numberss+`" id="qty_`+numberss+`" placeholder="0" type="number" class="form-control">
			</div>
			<div class="position-relative form-group">
				<label for="image_product_`+numberss+`" class="">Image</label>
				<input name="image_product_`+numberss+`" id="image_product_`+numberss+`" type="file" class="form-control-file">
				<small class="form-text text-muted">This is some placeholder block-level help
					text for the above input. It's a bit lighter and easily wraps to a new
				line.</small>
			</div>
		</div>`;
		numberss = parseInt(count)+1;
		$('#ed_count_item').val(numberss);
		// $(newRow).append("#"+idTransaction );
		$('#ed_editInputInvoice').append(newRow);
	}
</script>
<script type="text/javascript">
	$(function () {
        $('#date_picker_invoice').datetimepicker();
	});
</script> 
<script>
 function add_modal_invoice(){
	$('#addInputInvoice').empty();
	$('#count_item').val(0)
	
 }
 function edit_modal_invoice(id)
 {
	$('#ed_editInputInvoice').empty();
 	var url = "<?php echo base_url()."admin/InvoiceController/get_invoice_by_id/"; ?>"+id;
 	$.ajax({
 		url: url,
 		type: "GET",
 		dataType: "JSON",
 		success: function(data){
			var shipment =data['Shipment']
			var data_item =data['ItemOrder']
			// console.log(data_item);
			$('#ed_name_receiver').val(shipment["name"]);
			$('#ed_name_company').val(shipment["name_company"]);
			$('#ed_email').val(shipment["email"]);
			$('#ed_website').val(shipment["website"]);
			$('#ed_id_buyer').val(shipment["id_buyer"]);
			$('#ed_id_shipment').val(shipment["id_shipment"]);
			$('#ed_city').val(shipment["city"]);
			$('#ed_zip_code').val(shipment["zip_code"]);
			$('#ed_Address').val(shipment["address"]);
			$('#ed_date').val(shipment["date"]);
			$('#ed_reason_export').val(shipment["reason_for_exp"]);
			$('#ed_port_embarkation').val(shipment["port_of_embarkation"]);
			$('#ed_country_origin').val(shipment["country_of_orgn"]);
			$('#ed_port_discharge').val(shipment["port_of_discharge"]);
			$('#ed_awb_bl').val(shipment["awb_or_bl"]);
			$('#ed_pre_order').val(shipment["pre_order"]);
			$('#ed_currency').val(shipment["currency"]);
			$('#ed_payment_terms').val(shipment["payment_terms"]);
			$('#ed_mode_transportation').val(shipment["mode_of_transport"]);
			$('#ed_pre_order_date').val(shipment["date"].split(' ')[0]);
			$('#ed_est_ship_date').val(shipment["est_ship_date"].split(' ')[0]);
			console.log(shipment["est_ship_date"].split(' ')[0]);
			$('#ed_number_package').val(shipment["num_of_package"]);
			$('#ed_gross_weight').val(shipment["gross_weight"]);
			$('#ed_net_weight').val(shipment["net_weight"]);
			// $('#ed_net_weight_tot').val(shipment[""]);
			$('#ed_container_tot').val(shipment["container_total"]);
			var newRows =''
			for (var i = 0; i < data_item.length; i++) {
				
				newRows += `<div class="col-md-4">
					<br>
					<h5 class="modal-title">Product `+i+`</h5>
					<input value='`+data_item[i]['id_order']+`' name="id_order_`+i+`" id="ed_id_order_`+i+`" placeholder="count item" type="hidden" class="form-control">
					<div class="position-relative form-group">
						<label for="name_product_`+i+`" class="">Name Product</label>
						<input value='`+data_item[i]['name_or_descrip']+`' name="name_product_`+i+`" id="name_product_`+i+`" placeholder="Baskets Seagrass" type="text" class="form-control">
						
					</div>
					<div class="position-relative form-group">
						<label for="price_normal_`+i+`" class="">Price Normal</label>
						<input value='`+data_item[i]['price_normal']+`' name="price_normal_`+i+`" id="price_normal_`+i+`" placeholder="200000" type="number" class="form-control">
					</div>
					<div class="position-relative form-group">
						<label for="price_sell_`+i+`" class="">Price Sell</label>
						<input value='`+data_item[i]['price_sell']+`' name="price_sell_`+i+`" id="price_sell_`+i+`" placeholder="200000" type="number" class="form-control">
					</div>
					<div class="position-relative form-group">
						<label for="qty_`+i+`" class="">Qty</label>
						<input value='`+data_item[i]['qty']+`' name="qty_`+i+`" id="qty_`+i+`" placeholder="0" type="number" class="form-control">
					</div>
					<div class="position-relative form-group">
						<label for="image_product_`+i+`" class="">Image</label>
						<input name="image_product_`+i+`" id="image_product_`+i+`" type="file" class="form-control-file">
						<small class="form-text text-muted">This is some placeholder block-level help
							text for the above input. It's a bit lighter and easily wraps to a new
						line.</small>
					</div>
				</div>`;
				
			}
			$('#ed_count_item').val(data_item.length);
			$('#ed_editInputInvoice').append(newRows);
 		}
 	});
 }
 function edit_modal_supplier(id)
 {
 	var url = "<?php echo base_url()."admin/SupplierController/get_supplier_by_id/"; ?>"+id;
 	$.ajax({
 		url: url,
 		type: "GET",
 		dataType: "JSON",
 		success: function(data){
			$('#name_supplier_ed').val(data['name_supplier']);
			$('#id_supplier_ed').val(data['id']);
			$('#address_ed').val(data['address']);
			$('#phone_ed').val(data['phone']);
 		}
 	});
 }

 function edit_modal_product(id)
 {
	 
 	var url = "<?php echo base_url()."admin/ProductController/get_product_by_id/"; ?>"+id;
 	$.ajax({
 		url: url,
 		type: "GET",
 		dataType: "JSON",
 		success: function(data){
			var data = data[0]
			$('#id_product_ed').val(data['id_product']);
			$('#name_product_ed').val(data['name_product']);
			$('#panjang_ed').val(data['panjang']);
			$('#lebar_ed').val(data['lebar']);
			$('#tinggi_ed').val(data['tinggi']);
			$('#link_ed').val(data['link']);
			$('#id_category_ed').val(data['id_category']);
			$('#id_supplier_ed').val(data['id_supplier']);
			$('#description_ed').val(data['description']);
			
 		}
 	});
 }

 function edit_modal_category(id)
 {
	 
 	var url = "<?php echo base_url()."admin/CategoryController/get_category_by_id/"; ?>"+id;
 	$.ajax({
 		url: url,
 		type: "GET",
 		dataType: "JSON",
 		success: function(data){
		
			$('#id_category_ed').val(data['id']);
			$('#name_category_ed').val(data['name_category']);
 		}
 	});
 }
</script>
</html>
