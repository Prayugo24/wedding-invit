<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class HomeController extends CI_Controller {

	public function __construct(){
		parent::__construct();
		$this->load->helper('url');
		$this->load->model('CategoryModels');
		$this->load->helper('form');
		
	}
	public function index()
	{
		$params['menu']="home";
		// $params['category']=$this->CategoryModels->getAll();	
		$this->load->view('template_1/nav/header',$params);
		$this->load->view('template_1/section-1',$params);
		$this->load->view('template_1/section-2',$params);
		$this->load->view('template_1/section-3',$params);
		$this->load->view('template_1/home',$params);
		$this->load->view('template_1/nav/footer');
	}
}
