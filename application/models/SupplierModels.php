<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class SupplierModels extends CI_Model {

	private $_table = "supplier";

	public $id;
	public $name_supplier ;
	public $address ;
	public $phone ;

	public function rules()
	{
		return [
			[
				'field' => 'name_supplier',
				'label' => 'Name Supplier',
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
			]
		];
	}

	public function getAll()
	{
		return $this->db->get($this->_table)->result();
	}	

	public function getById($id)
	{
		return $this->db->get_where($this->_table, ["id" => $id])->row();
	}

	public function save()
	{
		$post = $this->input->post();
		$this->name_supplier = $post["name_supplier"];
		$this->address = $post["address"];
		$this->phone = $post["phone"];
		return $this->db->insert($this->_table, $this);
	}

	public function update()
	{
		$post = $this->input->post();
		$this->id = $post["id"];
		$this->name_supplier = $post["name_supplier"];
		$this->address = $post["address"];
		$this->phone = $post["phone"];
		
		return $this->db->update($this->_table, $this, array('id' => $this->id));
	}

	public function delete($id)
	{
		return $this->db->delete($this->_table, array("id" => $id));
	}
}
