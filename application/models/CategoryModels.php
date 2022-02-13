<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class CategoryModels extends CI_Model {

	private $_table = "category";

	public $id;
	public $name_category ;
	public $image_category ;


	public function rules()
	{
		return [			
			[
				'field' => 'name_category',
				'label' => 'Name Category',
				'rules' => 'required'
			],
		];
	}

	public function getAll()
	{
		
		$query = $this->db->order_by("name_category", "desc");
		$query = $this->db->get($this->_table);
		

		return $query->result();
	}	

	public function getById($id)
	{
		return $this->db->get_where($this->_table, ["id" => $id])->row();
	}

	public function save($params)
	{
		$this->name_category = $params["name_category"];
		$this->image_category = $params["image_category"];
		return $this->db->insert($this->_table, $this);
	}

	public function update($params){

		$this->id = $params["id"];
		$this->name_category = $params["name_category"];
		$this->image_category = $params["image_category"];
		return $this->db->update($this->_table, $this, array('id' => $params['id']));
	}

	public function delete($id)
	{
		return $this->db->delete($this->_table, array("id" => $id));
	}
}
