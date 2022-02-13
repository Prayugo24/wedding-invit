<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class CompanyProfilModels extends CI_Model {

	private $_table = "profile";

	public $id;
	public $name_company ;
	public $address ;
	public $phone ;
	public $email;
	public $about;
	public $short_about;
	public $image_company;

	public function rules(){
		return [
			[
				'field' => 'name_company',
				'label' => 'Name Company',
				'rules' => 'required'
			],
			[
				'field' => 'address',
				'label' => 'Address',
				'rules' => 'required'
			],
			[
				'field' => 'phone',
				'label' => 'Phone',
				'rules' => 'required'
			],
			[
				'field' => 'email',
				'label' => 'Email',
				'rules' => 'required'
			],
			[
				'field' => 'about',
				'label' => 'About',
				'rules' => 'required'
			],
			[
				'field' => 'short_about',
				'label' => 'Short About',
				'rules' => 'required'
			],
		];
	}

	public function getFirstRow(){
		return $this->db->get($this->_table)->first_row();
	}

	public function getById($id){
		return $this->db->get_where($this->_table,["id" => $id])->row();
	}
	public function save($params){
		
		$this->name_company = $params['name_company'];
		$this->address = $params['address'];
		$this->email = $params['email'];
		$this->phone = $params["phone"];
		$this->about = $params["about"];
		$this->short_about = $params["short_about"];
		$this->image_company = $params["image_company"];
		return $this->db->insert($this->_table, $this);

	}

	public function update($params){
		$post = $this->input->post();
		$this->id = $params['id'];
		$this->name_company = $params['name_company'];
		$this->address = $params['address'];
		$this->email = $params['email'];
		$this->phone = $params["phone"];
		$this->about = $params["about"];
		$this->short_about = $params["short_about"];
		$this->image_company = $params["image_company"];
		return $this->db->update($this->_table, $this, array('id' => $this->id));
	}

	public function delete($id)
	{
		return $this->db->delete($this->_table, array("id" => $id));
	}
}
