<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class InvoiceController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('InvoiceModels');
		$this->load->library('form_validation');
		$this->load->library('zend');
		$this->load->helper('url');
		$this->load->model('AuthModels');
		if(!$this->AuthModels->current_user()){
			redirect('super-power');
		}
	}
	public function index()
	{
		$params['active_invoice']='mm-active';
		$this->load->view('admin/nav/header',$params);
		$this->load->view('admin/dashboard_invoice',$params);
		$this->load->view('admin/nav/footer');
		$this->load->view('admin/modal/add_modal_invoice');
		$this->load->view('admin/modal/edit_modal_invoice');
	}

	public function add_invoice()
	{
		if ($this->input->method() === 'post') {
			$post = $this->input->post();
			//? Bill To & Ship To
			$params_buyer['name'] = $post['name_receiver'];
			$params_buyer['name_company'] = $post['name_company'];
			$params_buyer['email'] = $post['email'];
			$params_buyer['website'] = $post['website'];
			
			$params_buyer['city'] = $post['city'];
			$params_buyer['zip_code'] = $post['zip_code'];
			$params_buyer['address'] = 	$post['address'];
			
			$Invoice = $this->InvoiceModels;
			$validation = $this->form_validation;
			$validation = $validation->set_rules($Invoice->rulesBuyer());

			if ($validation->run()) {
				$id_buyers = $Invoice->saveBuyer($params_buyer);
				//? Ship Information
				$params_ship['id_buyer'] = $id_buyers;
				$params_ship['pre_order'] = $post['pre_order'];
				$params_ship['date'] = $post['pre_order_date'];
				$params_ship['lc_or_credit'] = $post['lc_or_credit'];
				$params_ship['currency'] = $post['currency'];
				$params_ship['payment_terms'] = $post['payment_terms'];
				$params_ship['est_ship_date'] = $post['est_ship_date'];
				$params_ship['mode_of_transport'] = $post['mode_transportation'];
				$params_ship['num_of_package'] = $post['number_package'];
				$params_ship['gross_weight'] = $post['gross_weight'];
				$params_ship['net_weight'] = $post['net_weight'];
				$params_ship['invoice'] = 'INV'.rand();
				$params_ship['image_barcode'] = $this->create_barcode($params_ship['invoice']);
				$params_ship['status'] = 0;
				$params_ship['carrier'] = '';
				$params_ship['container_total'] = $post['container_tot'];
				$params_ship['reason_for_exp'] = $post['reason_export'];
				$params_ship['port_of_embarkation'] = $post['port_embarkation'];
				$params_ship['country_of_orgn'] = $post['country_origin'];
				$params_ship['port_of_discharge'] = $post['port_discharge'];
				$params_ship['awb_or_bl'] = $post['awb_bl'];
				
				$validation = $this->form_validation;
				$validation = $validation->set_rules($Invoice->rulesShipment());
				if ($validation->run() && !empty($params_ship['id_buyer'])) {
					$id_shipment = $Invoice->saveShipment($params_ship);
					//? Item
					$file_name =  rand();
					$config['upload_path']          = FCPATH.'/assets/img/order';
					$config['allowed_types']        = 'gif|jpg|jpeg|png';
					$config['file_name']            = $file_name;
					$config['overwrite']            = true;
						 
					$this->load->library('upload', $config);
					$count_item = $post['count_item'];
					for ($i=0; $i < $count_item; $i++) { 
						if (!$this->upload->do_upload('image_product_'.$i)) {
							$data['error'] = $this->upload->display_errors();
							$this->session->set_flashdata('delete', 'File gagal disimpan cek kembali form inputan Item !!');
							redirect('dashboard-invoice');
						} else {
							$uploaded_data = $this->upload->data();
							$params_order['id_shipment'] = $id_shipment;
							$params_order['id_buyer'] = $id_buyers;
							$params_order['name_or_descrip'] = $post['name_product_'.$i];
							$params_order['image'] = $uploaded_data['file_name'];
							$params_order['date'] = $params_ship['date'];
							$params_order['qty'] = $post['qty_'.$i];
							$params_order['uom'] = 'Unit'; 
							$params_order['price_normal'] = $post['price_normal_'.$i];
							$params_order['price_sell'] = $post['price_sell_'.$i];
							$params_order['price_total'] = $post['price_sell_'.$i]*$post['qty_'.$i];
							$save_order = $Invoice->saveOrder($params_order);
							
						}
					}
					$this->session->set_flashdata('success', 'Berhasil disimpan');
					redirect('dashboard-invoice');
				}else{
					$this->session->set_flashdata('delete', 'File gagal disimpan Id Buyer tidak ditemukan');
					redirect('dashboard-invoice');
				}
				
			}else{
				$this->session->set_flashdata('delete', 'File gagal disimpan cek kembali form inputan Bill To & Ship To !!');
				redirect('dashboard-invoice');

			}			
		}
	}

	function create_barcode($kode){
		$this->zend->load('Zend/Barcode');
		// $imageResource=Zend_Barcode::factory('code128', 'image', $barcodeOptions, $rendererOptions)->render();
		$imageResource = Zend_Barcode::draw('code128', 'image', array('text' => $kode), array());
		$path_to_file =FCPATH.'/assets/img/barcode/';
		$file_name = $kode.'.png';
		$store_image = imagepng($imageResource,$path_to_file.$file_name);
		return $file_name;


	 }

	public function edit_invoice()
	{

		if ($this->input->method() === 'post') {
			$post = $this->input->post();
			//? Bill To & Ship To
			$params_buyer['id_buyer'] = $post['id_buyer'];
			$params_buyer['name'] = $post['name_receiver'];
			$params_buyer['name_company'] = $post['name_company'];
			$params_buyer['email'] = $post['email'];
			$params_buyer['website'] = $post['website'];
			
			$params_buyer['city'] = $post['city'];
			$params_buyer['zip_code'] = $post['zip_code'];
			$params_buyer['address'] = 	$post['address'];
			$Invoice = $this->InvoiceModels;
			$validation = $this->form_validation;
			$validation = $validation->set_rules($Invoice->rulesBuyer());
			if ($validation->run()) {
				$id_product = $Invoice->updateBuyer($params_buyer);
				//? Ship Information
				$params_ship['id_buyer'] = $params_buyer['id_buyer'];
				$params_ship['id_shipment'] = $post['id_shipment'];
				$params_ship['pre_order'] = $post['pre_order'];
				$params_ship['date'] = $post['pre_order_date'];
				$params_ship['lc_or_credit'] = $post['lc_or_credit'];
				$params_ship['currency'] = $post['currency'];
				$params_ship['payment_terms'] = $post['payment_terms'];
				$params_ship['est_ship_date'] = $post['est_ship_date'];
				$params_ship['mode_of_transport'] = $post['mode_transportation'];
				$params_ship['num_of_package'] = $post['number_package'];
				$params_ship['gross_weight'] = $post['gross_weight'];
				$params_ship['net_weight'] = $post['net_weight'];
				$params_ship['invoice'] = 'INV'.rand();
				$params_ship['image_barcode'] = $this->create_barcode($params_ship['invoice']);
				$params_ship['status'] = 0;
				$params_ship['carrier'] = '';
				$params_ship['container_total'] = $post['container_tot'];
				$params_ship['reason_for_exp'] = $post['reason_export'];
				$params_ship['port_of_embarkation'] = $post['port_embarkation'];
				$params_ship['country_of_orgn'] = $post['country_origin'];
				$params_ship['port_of_discharge'] = $post['port_discharge'];
				$params_ship['awb_or_bl'] = $post['awb_bl'];
				$validation = $this->form_validation;
				$validation = $validation->set_rules($Invoice->rulesShipment());
				if ($validation->run() && !empty($params_ship['id_buyer'])) {
					$id_shipment = $Invoice->updateShipment($params_ship);
					//? Item
					$file_name =  rand();
					$config['upload_path']          = FCPATH.'/assets/img/order';
					$config['allowed_types']        = 'gif|jpg|jpeg|png';
					$config['file_name']            = $file_name;
					$config['overwrite']            = true;
					$count_item = $post['count_item'];
					$this->load->library('upload', $config);
					for ($i=0; $i < $count_item; $i++) { 
						$getOrder = isset($post['id_order_'.$i]) ? $Invoice->getOrderById($post['id_order_'.$i]) :'';
						
						if($getOrder){
							$getOrder = json_encode($getOrder[0]);
							$getOrder = json_decode($getOrder,true);
							
							if (!$this->upload->do_upload('image_product_'.$i)) {
								$name_image = $getOrder['image'];
							} else {
								$path_to_file =FCPATH.'/assets/img/order/';
								unlink($path_to_file.$name_image['image']);
								$uploaded_data = $this->upload->data();
								$name_image = $uploaded_data['file_name'];
							}
							$params_order['id_shipment'] = $params_ship['id_shipment'];
							$params_order['id_buyer'] = $params_buyer['id_buyer'];
							$params_order['id_order'] = $post['id_order_'.$i];
							$params_order['name_or_descrip'] = $post['name_product_'.$i];
							$params_order['image'] = $name_image;
							$params_order['date'] = $params_ship['date'];
							$params_order['qty'] = $post['qty_'.$i];
							$params_order['uom'] = 'Unit'; 
							$params_order['price_normal'] = $post['price_normal_'.$i];
							$params_order['price_sell'] = $post['price_sell_'.$i];
							$params_order['price_total'] = $post['price_sell_'.$i]*$post['qty_'.$i];
							
							$save_order = $Invoice->updateOrder($params_order);
						}else{
							if (!$this->upload->do_upload('image_product_'.$i)) {
								$data['error'] = $this->upload->display_errors();
								$this->session->set_flashdata('delete', 'File gagal disimpan cek kembali form inputan Item !!');
								redirect('dashboard-invoice');
							} else {
								$uploaded_data = $this->upload->data();
								$params_orders['id_shipment'] = $params_ship['id_shipment'];
								$params_orders['id_buyer'] = $params_buyer['id_buyer'];
								$params_orders['name_or_descrip'] = $post['name_product_'.$i];
								$params_orders['image'] = $uploaded_data['file_name'];
								$params_orders['date'] = $params_ship['date'];
								$params_orders['qty'] = $post['qty_'.$i];
								$params_orders['uom'] = 'Unit'; 
								$params_orders['price_normal'] = $post['price_normal_'.$i];
								$params_orders['price_sell'] = $post['price_sell_'.$i];
								$params_orders['price_total'] = $post['price_sell_'.$i]*$post['qty_'.$i];
								$save_order = $Invoice->saveOrder($params_orders);
							}
						}
					}
					$this->session->set_flashdata('success', 'Berhasil diubah');
					redirect('dashboard-invoice');
				}else{
					$this->session->set_flashdata('delete', 'File gagal diubah Id Buyer tidak ditemukan');
					redirect('dashboard-invoice');
				}
			}else{
				$this->session->set_flashdata('delete', 'File gagal diubah cek kembali form inputan Bill To & Ship To !!');
				redirect('dashboard-invoice');
			}
		}
		
		
	}

	public function delete_invoice($id=null)
	{
		if (!isset($id)) show_404();
		$path_to_file =FCPATH.'/assets/img/order/';
		$invoiceJoin = $this->InvoiceModels->getInvoiceInnerJoinOrderbyBuyer($id);
		$invoiceJoin = json_encode($invoiceJoin[0]);
		$invoiceJoin = json_decode($invoiceJoin,true);
		if (!empty($invoiceJoin)) {
			$order = $this->InvoiceModels->getOrderByBuyer($invoiceJoin['id_buyer']);
			foreach ($order as $key => $value) {
				if(unlink($path_to_file.$value->image)) {
					$this->InvoiceModels->deleteOrder($value->id_order);
				}
			}
			$this->InvoiceModels->deleteBuyer($invoiceJoin['id_buyer']);
			$this->InvoiceModels->deleteShipment($invoiceJoin['id_shipment']);
			$this->session->set_flashdata('delete', 'Berhasil Di Hapus');
			redirect('dashboard-invoice');
		}else {
			$this->session->set_flashdata('delete', 'Gagal Di Hapus');
			redirect('dashboard-invoice');
		}
	}


   public function invoice_json(){
    $search = isset($_POST['search']['value']) ? $_POST['search']['value'] : '';
    $limit = isset($_POST['length']) ? $_POST['length'] : 10;
    $start = isset($_POST['start']) ? $_POST['start'] : 0;
    $order_index = isset($_POST['order'][0]['column']) ? $_POST['order'][0]['column'] : 0;
    $order_field = isset($_POST['columns'][$order_index]['data']) ? $_POST['columns'][$order_index]['data'] : 'id_buyer';
    $order_ascdesc = isset($_POST['order'][0]['dir']) ? $_POST['order'][0]['dir'] : 'desc';
	$params = [
		'search' => $search,
		'limit' => $limit,
		'start' => $start,
		'order_field' => $order_field,
		'order_ascdesc' => $order_ascdesc
	];
	$sql_total = $this->InvoiceModels->count_all(); // Panggil fungsi count_all pada SiswaModel
    $sql_data = $this->InvoiceModels->getInvoiceInnerJoin($params); // Panggil fungsi filter pada SiswaModel
    $sql_filter = $this->InvoiceModels->count_filter(); // Panggil fungsi count_filter pada SiswaModel
    $callback = array(
        'draw'=>$_POST['draw'], // Ini dari datatablenya
        'recordsTotal'=>$sql_total,
        'recordsFiltered'=>$sql_filter,
        'data'=>$sql_data
    );
    header('Content-Type: application/json');
    echo json_encode($callback); // Convert array $callback ke json
  }

	public function get_invoice_by_id($id=null)
	{
		if (!isset($id)) show_404();
		$invoiceJoin = $this->InvoiceModels->getInvoiceInnerJoinOrderbyBuyer($id);
		$getOrderByIdBuyer = $this->InvoiceModels->getOrderByBuyer($id);
		$invoiceJoin = json_encode($invoiceJoin[0]);
		$result = [
			'Shipment' => json_decode($invoiceJoin,true),
			'ItemOrder' => $getOrderByIdBuyer
		];
		
		echo json_encode($result);
	}
}


