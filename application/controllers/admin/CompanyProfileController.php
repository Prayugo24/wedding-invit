<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CompanyProfileController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('AuthModels');
		$this->load->library('form_validation');
		$this->load->helper('url');
		$this->load->model('CompanyProfilModels');
		if(!$this->AuthModels->current_user()){
			redirect('super-power');
		}
	}
	public function index()
	{
		$params['active_profile']='mm-active';
		$params['profile']= $this->CompanyProfilModels->getFirstRow();
		
		$this->load->view('admin/nav/header',$params);
		$this->load->view('admin/company_profile',$params);
		$this->load->view('admin/nav/footer');
	}

	public function add_profile(){
		if ($this->input->method() === 'post') {
			// the user id contain dot, so we must remove it
			$post = $this->input->post();
			$profile = $this->CompanyProfilModels->getFirstRow();
			
			if(empty($profile)){
				$file_name =  $post['name_company'];
				$config['upload_path']          = FCPATH.'/assets/img/profile';
				$config['allowed_types']        = 'gif|jpg|jpeg|png';
				$config['file_name']            = $file_name;
				$config['overwrite']            = true;
				// $config['max_size']             = 1024; // 1MB
				// $config['max_width']            = 1080;
				// $config['max_height']           = 1080;
	
				
				$this->load->library('upload', $config);
	
				if (!$this->upload->do_upload('image_company')) {
					$data['error'] = $this->upload->display_errors();
				} else {
					
					$uploaded_data = $this->upload->data();
					$params = [
						'name_company' => $post['name_company'],
						'address' => $post['address'],
						'email' => $post['email'],
						'phone' => $post['phone'],
						'about' => $post['about'],
						'short_about' => $post['short_about'],
						'image_company' => $uploaded_data['file_name'],
					];
					
					$company_profil = $this->CompanyProfilModels;
					$validation = $this->form_validation;
					$validation->set_rules($company_profil->rules());
					if($validation->run()){
						$company_profil->save($params);
						$this->session->set_flashdata('success', 'Berhasil disimpan');
						redirect('dashboard-profile');
					}
				}
			}else{
				$this->edit_profile($profile->id);
			}
		}		
	}

	public function edit_profile($id = null)
	{
		if (!isset($id)) redirect('dashboard-profile');
		$post = $this->input->post();
		$file_name =  $post['name_company'];
		
		$config['upload_path']          = FCPATH.'/assets/img/profile';
		$config['allowed_types']        = 'gif|jpg|jpeg|png';
		$config['file_name']            = $file_name;
		$config['overwrite']            = true;
		// $config['max_size']             = 4024; // 1MB
		// $config['max_width']            = 2080;
		// $config['max_height']           = 2080;

		
		$this->load->library('upload', $config);

		if (!$this->upload->do_upload('image_company')) {
			$data['error'] = $this->upload->display_errors();
			
		} else {
			
			$uploaded_data = $this->upload->data();
			$params = [
				'id' => $id,
				'name_company' => $post['name_company'],
				'address' => $post['address'],
				'email' => $post['email'],
				'phone' => $post['phone'],
				'about' => $post['about'],
				'short_about' => $post['short_about'],
				'image_company' => $uploaded_data['file_name'],
			];
			
			$company_profil = $this->CompanyProfilModels;
			$validation = $this->form_validation;
			$validation->set_rules($company_profil->rules());
			if($validation->run()){
				$company_profil->update($params);
				$this->session->set_flashdata('success', 'Berhasil Diupdate');
				redirect('dashboard-profile');
			}
		}
	}

	public function delete_profile($id=null)
	{
		if (!isset($id)) show_404();
		$path_to_file =FCPATH.'/assets/img/profile';
		$profile = $this->CompanyProfilModels->getFirstRow();
		if (!empty($profile)) {
			if(unlink($path_to_file.$profile->image_company)) {
				$this->CompanyProfilModels->delete($id);
				$this->session->set_flashdata('delete', 'Berhasil Di Hapus');
				redirect('dashboard-profile');
			}
			else {
				$this->session->set_flashdata('delete', 'Gagal Di Hapus');
			}
			
			
		}
	}
}
