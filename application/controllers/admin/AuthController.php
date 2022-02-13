<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AuthController extends CI_Controller {


	public function __construct(){
		parent::__construct();
		$this->load->helper('url');
		$this->load->model('AuthModels');
		$this->load->library('form_validation');
	}

	public function index()
	{
		show_404();
	}

	public function login()
	{
		$rules = $this->AuthModels->rules();
		$this->form_validation->set_rules($rules);

		if($this->form_validation->run() == FALSE){
			$this->load->view('admin/login');
		}

		$email = $this->input->post('email');
		$password = $this->input->post('password');
		$password = md5($password);
		$user = $this->AuthModels->login($email, $password);
		if($user){
			redirect('dashboard');
		} else {
			$this->session->set_flashdata('message_login_error', 'Login Gagal, pastikan username dan passwrod benar!');
		}
	}

	public function logout()
	{
		$this->AuthModels->logout();
		redirect(site_url());
	}
}
