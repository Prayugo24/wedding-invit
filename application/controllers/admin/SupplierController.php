<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class SupplierController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('SupplierModels');
		$this->load->library('form_validation');
		$this->load->helper('url');
		$this->load->model('AuthModels');
		if(!$this->AuthModels->current_user()){
			redirect('super-power');
		}
	}
	public function index()
	{
		$params['active_supplier']='mm-active';
		$params['supplier']=$this->SupplierModels->getAll();
		$this->load->view('admin/nav/header',$params);
		$this->load->view('admin/dashboard_supplier',$params);
		$this->load->view('admin/nav/footer');
		$this->load->view('admin/modal/edit_modal_supplier');
	}

	public function add_supplier()
	{
		$supplier = $this->SupplierModels;
		$validation = $this->form_validation;
		$validation->set_rules($supplier->rules());
		if ($validation->run()) {
			$supplier->save();
			$this->session->set_flashdata('success', 'Berhasil disimpan');
			redirect('dashboard-supplier');
		}
	}

	public function edit_supplier()
	{
		$post = $this->input->post();
		
		if (!isset($post['id'])) redirect('dashboard-supplier');

		$supplier = $this->SupplierModels;
		$validation = $this->form_validation;
		$validation->set_rules($supplier->rules());
		if($validation->run()){
			
			$supplier->update();
			$this->session->set_flashdata('success', 'Berhasil disimpan');
			redirect('dashboard-supplier');
		}
	}

	public function delete_supplier($id=null)
	{
		if (!isset($id)) show_404();

		if ($this->SupplierModels->delete($id)) {
			$this->session->set_flashdata('delete', 'Berhasil Di Hapus');
			redirect(site_url('dashboard-supplier'));
		}
	}

	public function get_supplier_by_id($id=null)
	{
		if (!isset($id)) show_404();
		
		$supplier = $this->SupplierModels->getById($id);
		echo json_encode($supplier);
	}
}
