<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ProductController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('ProductModels');
		$this->load->model('CategoryModels');
		$this->load->model('SupplierModels');
		$this->load->model('ImageModels');
		$this->load->library('zend');
		$this->load->library('form_validation');
		$this->load->helper('url');
		$this->load->model('AuthModels');
		if(!$this->AuthModels->current_user()){
			redirect('super-power');
		}
	}
	public function index()
	{
		$params['active_product']='mm-active';
		$params['product']=$this->ProductModels->getProductInnerJoin();
		
		$params['category']=$this->CategoryModels->getAll();
		
		$params['suppliers']=$this->SupplierModels->getAll();
		
		$this->load->view('admin/nav/header',$params);
		$this->load->view('admin/dashboard_product',$params);
		$this->load->view('admin/nav/footer');
		$this->load->view('admin/modal/edit_modal_product');
	}

	public function add_product()
	{
		if ($this->input->method() === 'post') {
			$post = $this->input->post();
		
				$file_name =  rand();
				
				$config['upload_path']          = FCPATH.'/assets/img/product';
				$config['allowed_types']        = 'gif|jpg|jpeg|png';
				$config['file_name']            = $file_name;
				$config['overwrite']            = true;
				
				$this->load->library('upload', $config);
	
				if (!$this->upload->do_upload('image_product')) {
					$data['error'] = $this->upload->display_errors();
					$this->session->set_flashdata('delete', 'File gagal disimpan cek kembali form inputan !!');
					redirect('dashboard-product');
				} else {
					
					$uploaded_data = $this->upload->data();
					$params = [
						'id_category' => $post['id_category'],
						'name_product' => $post['name_product'],
						'status' => 1,
						'id_supplier' => $post['id_supplier'],
						'link' => $post['link'],
						'description' => $post['description'],
						'panjang' => $post['panjang'],
						'lebar' => $post['lebar'],
						'tinggi' => $post['tinggi'],
						
					];
					
					$product = $this->ProductModels;
					$validation = $this->form_validation;
					$validation = $validation->set_rules($product->rules());
					if ($validation->run()) {
						$id_product = $product->save($params);
						$params_image = [
							'id_product' => $id_product,
							'name_image' => $uploaded_data['file_name'],
						];
						$image = $this->ImageModels;
						$save_image = $image->save($params_image);
						
						$this->session->set_flashdata('success', 'Berhasil disimpan');
						redirect('dashboard-product');
					}else{
						$this->session->set_flashdata('delete', 'File gagal disimpan cek kembali form inputan !!');
						redirect('dashboard-product');
					}
				}
			
		}
		
	}

	public function edit_product()
	{

		if (isset($post['id_product'])) redirect('dashboard-product');
		$post = $this->input->post();
		
		$file_name =  rand();
		$config['upload_path']          = FCPATH.'/assets/img/product';
		$config['allowed_types']        = 'gif|jpg|jpeg|png';
		$config['file_name']            = $file_name;
		$config['overwrite']            = true;
		
		$this->load->library('upload', $config);
		$productJoin = $this->ProductModels->getProductInnerJoinById($post['id_product']);
		$productJoin = json_encode($productJoin[0]);
		$productJoin = json_decode($productJoin,true);
		if (!$this->upload->do_upload('image_product')) {
			$name_image = $productJoin['name_image'];
		}else{
			$path_to_file =FCPATH.'/assets/img/product/';
			unlink($path_to_file.$productJoin['name_image']);
			$uploaded_data = $this->upload->data();
			$name_image = $uploaded_data['file_name'];
		}
		
		$product = $this->ProductModels;
		$validation = $this->form_validation;
		$validation = $validation->set_rules($product->rules());
		if ($validation->run()) {
			
			$params = [
				'id' => $post['id_product'],
				'id_category' => $post['id_category'],
				'name_product' => $post['name_product'],
				'status' => 1,
				'link' => $post['link'],
				'id_supplier' => $post['id_supplier'],
				'description' => $post['description'],
				'panjang' => $post['panjang'],
				'lebar' => $post['lebar'],
				'tinggi' => $post['tinggi'],
				
			];
			$id_product = $product->update($params);
			
			
			$params_image = [
				'id'=> $productJoin['id_image'],
				'id_product' => $post['id_product'],
				'name_image' => $name_image,
			];
			
			$image = $this->ImageModels;
			$save_image = $image->update($params_image);
			
			$this->session->set_flashdata('success', 'Berhasil disimpan');
			redirect('dashboard-product');
		}else{
			$this->session->set_flashdata('delete', $validation);
			redirect('dashboard-product');
		} 
		
	}

	public function delete_product($id=null)
	{
		if (!isset($id)) show_404();
		$path_to_file =FCPATH.'/assets/img/product/';
		$productJoin = $this->ProductModels->getProductInnerJoinById($id);
		$productJoin = json_encode($productJoin[0]);
		$productJoin = json_decode($productJoin,true);
		
		if (!empty($productJoin)) {
			if(unlink($path_to_file.$productJoin['name_image'])) {
				$this->ProductModels->delete($id);
				$this->session->set_flashdata('delete', 'Berhasil Di Hapus');
				redirect('dashboard-product');
			}
			else {
				$this->session->set_flashdata('delete', 'Gagal Di Hapus');
				redirect('dashboard-product');
			}
			
			
		}
	}


   public function product_json2(){
    $search = isset($_POST['search']['value']) ? $_POST['search']['value'] : '';
    $limit = isset($_POST['length']) ? $_POST['length'] : 10;
    $start = isset($_POST['start']) ? $_POST['start'] : 0;
    $order_index = isset($_POST['order'][0]['column']) ? $_POST['order'][0]['column'] : 0;
    $order_field = isset($_POST['columns'][$order_index]['data']) ? $_POST['columns'][$order_index]['data'] : 'id_product';
    $order_ascdesc = isset($_POST['order'][0]['dir']) ? $_POST['order'][0]['dir'] : 'desc';
	$params = [
		'search' => $search,
		'limit' => $limit,
		'start' => $start,
		'order_field' => $order_field,
		'order_ascdesc' => $order_ascdesc
	];
	$sql_total = $this->ProductModels->count_all(); // Panggil fungsi count_all pada SiswaModel
    $sql_data = $this->ProductModels->getProductInnerJoinSearch($params); // Panggil fungsi filter pada SiswaModel
    $sql_filter = $this->ProductModels->count_filter(); // Panggil fungsi count_filter pada SiswaModel
    $callback = array(
        'draw'=>$_POST['draw'], // Ini dari datatablenya
        'recordsTotal'=>$sql_total,
        'recordsFiltered'=>$sql_filter,
        'data'=>$sql_data
    );
    header('Content-Type: application/json');
    echo json_encode($callback); // Convert array $callback ke json
  }

	public function get_product_by_id($id=null)
	{
		if (!isset($id)) show_404();
		$product = $this->ProductModels->getProductInnerJoinById($id);
		echo json_encode($product);
	}
}


