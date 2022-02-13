<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class ImageModels extends CI_Model {

	private $_table = "image";

	public $id;
	public $id_product ;
	public $name_image ;


	public function rules()
	{
		return [
			[
				'field' => 'id_product',
				'label' => 'Id Product',
				'rules' => 'required'
			],

			[
				'field' => 'name_image',
				'label' => 'Name Image',
				'rules' => 'required'
			],
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

	public function save($params)
	{
		
		$this->id_product = $params["id_product"];
		$this->name_image = $params["name_image"];
		return $this->db->insert($this->_table, $this);
	}

	public function update($params)
	{	
		$this->id = $params["id"];
		$this->id_product = $params["id_product"];
		$this->name_image = $params["name_image"];
		return $this->db->update($this->_table, $this, array('id' => $params['id']));
	}

	public function delete($id)
	{
		return $this->db->delete($this->_table, array("id" => $id));
	}
}
