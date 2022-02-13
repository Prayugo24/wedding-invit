<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CategoryController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('CategoryModels');
		$this->load->library('form_validation');
		$this->load->helper('url');
		$this->load->model('AuthModels');
		if(!$this->AuthModels->current_user()){
			redirect('super-power');
		}
	}
	public function index()
	{
		$params['active_category']='mm-active';
		$params['category']=$this->CategoryModels->getAll();		
		
		$this->load->view('admin/nav/header',$params);
		$this->load->view('admin/dashboard_category',$params);
		$this->load->view('admin/nav/footer');
		$this->load->view('admin/modal/edit_modal_category');
	}

	public function add_category()
	{
		if ($this->input->method() === 'post') {
			$post = $this->input->post();
		
				$file_name = rand();
				
				$config['upload_path']          = FCPATH.'/assets/img/category';
				$config['allowed_types']        = 'gif|jpg|jpeg|png';
				$config['file_name']            = $file_name;
				$config['overwrite']            = true;
				
				$this->load->library('upload', $config);
	
				if (!$this->upload->do_upload('image_category')) {
					$data['error'] = $this->upload->display_errors();
					$this->session->set_flashdata('delete', 'File gagal disimpan cek kembali form inputan !!');
					redirect('dashboard-category');
				} else {
					$uploaded_data = $this->upload->data();
					$params = [
						'name_category' => $post['name_category'],
						'image_category' => $uploaded_data['file_name'],
					];
					
					$category = $this->CategoryModels;
					$validation = $this->form_validation;
					$validation = $validation->set_rules($category->rules());
					if ($validation->run()) {
						$id_product = $category->save($params);
						$this->session->set_flashdata('success', 'Berhasil disimpan');
						redirect('dashboard-category');
					}
				}
			
		}
		
	}

	public function edit_category()
	{

		if (isset($post['id_category'])) redirect('dashboard-category');
		$post = $this->input->post();
		
		$file_name =  rand();
		$config['upload_path']          = FCPATH.'/assets/img/category';
		$config['allowed_types']        = 'gif|jpg|jpeg|png';
		$config['file_name']            = $file_name;
		$config['overwrite']            = true;
		
		$this->load->library('upload', $config);
		$get_category = $this->CategoryModels->getById($post['id_category']);
		
		if (!$this->upload->do_upload('image_category')) {
			$image_category = $get_category->image_category;
		}else{
			$path_to_file =FCPATH.'assets/img/category/';
			unlink($path_to_file.$get_category->image_category);
			$uploaded_data = $this->upload->data();
			$image_category = $uploaded_data['file_name'];
		}
		
		$category = $this->CategoryModels;
		$validation = $this->form_validation;
		$validation = $validation->set_rules($category->rules());
		if ($validation->run()) {
			
			$params = [
				'id' => $post['id_category'],
				'name_category' => $post['name_category'],
				'image_category' => $image_category,
				
			];
			$id_category = $category->update($params);
			$this->session->set_flashdata('success', 'Berhasil disimpan');
			redirect('dashboard-category');
		}else{
			$this->session->set_flashdata('delete', $validation);
			redirect('dashboard-category');
		} 
		
	}

	public function delete_category($id=null)
	{
		if (!isset($id)) show_404();
		$path_to_file =FCPATH.'/assets/img/category/';
		$get_category = $this->CategoryModels->getById($id);
		
		
		if (!empty($get_category)) {
			if($get_category->image_category != null){
				unlink($path_to_file.$get_category->image_category);
				$this->CategoryModels->delete($id);
				$this->session->set_flashdata('delete', 'Berhasil Di Hapus');
				redirect('dashboard-category');
			}else{
				$this->CategoryModels->delete($id);
				$this->session->set_flashdata('delete', 'Berhasil Di Hapus');
				redirect('dashboard-category');
			}
			
			
			
		}
	}

	public function get_category_by_id($id=null)
	{
		if (!isset($id)) show_404();
		$get_category = $this->CategoryModels->getById($id);
		echo json_encode($get_category);
	}
}


