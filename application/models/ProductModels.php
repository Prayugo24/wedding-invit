<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class ProductModels extends CI_Model {

	private $_table = "product";

	public $id;
	public $id_category ;
	public $name_product ;
	public $status ;
	public $id_supplier;
	public $description;
	public $panjang;
	public $lebar;
	public $tinggi;
	public $link;


	public function rules(){
		return [
			[
				'field' => 'name_product',
				'label' => 'Name Product',
				'rules' => 'required'
			],
			
			[
				'field' => 'id_supplier',
				'label' => 'Id Supplier',
				'rules' => 'required'
			],
			
			[
				'field' => 'id_category',
				'label' => 'Id Category',
				'rules' => 'required'
			],
			[
				'field' => 'description',
				'label' => 'Description',
				'rules' => 'required'
			],
			[
				'field' => 'panjang',
				'label' => 'Panjang',
				'rules' => 'required'
			],
			[
				'field' => 'lebar',
				'label' => 'lebar',
				'rules' => 'required'
			],
			[
				'field' => 'tinggi',
				'label' => 'tinggi',
				'rules' => 'required'
			],
		];
	}

	public function getAll(){
		return $this->db->get($this->_table)->result();
	}

	public function getById($id){
		return $this->db->get_where($this->_table,["id" => $id])->row();
	}
	public function save($params){
		
		$this->id_category = $params['id_category'];
		$this->name_product = $params['name_product'];
		$this->status = $params['status'];
		$this->id_supplier = $params["id_supplier"];
		$this->description = $params["description"];
		$this->panjang = $params["panjang"];
		$this->lebar = $params["lebar"];
		$this->tinggi = $params["tinggi"];
		$this->link = $params["link"];
		
		$this->db->insert($this->_table, $this);
		$insert_id = $this->db->insert_id();
		return $insert_id;

	}

	public function update($params){
		
		$this->id = $params['id'];
		$this->id_category = $params['id_category'];
		$this->name_product = $params['name_product'];
		$this->status = $params['status'];
		$this->id_supplier = $params["id_supplier"];
		$this->description = $params["description"];
		$this->panjang = $params["panjang"];
		$this->lebar = $params["lebar"];
		$this->tinggi = $params["tinggi"];
		$this->link = $params["link"];
		return $this->db->update($this->_table, $this, array('id' => $this->id));
	}

	public function delete($id)
	{
		return $this->db->delete($this->_table, array("id" => $id));
	}

	public function getProductInnerJoin(){
		$this->db->select('product.id as id_product,product.name_product, product.status, product.description
			, product.panjang, product.lebar, product.tinggi, product.link,
			category.name_category, supplier.name_supplier, image.name_image')
         ->from('product')
         ->join('category', 'product.id_category = category.id')
		 ->join('supplier', 'product.id_supplier = supplier.id')
		 ->join('image', 'image.id_product = product.id');
		$query = $this->db->get();
		return $query->result();

	}
	public function getProductInnerJoinById($id){
		$this->db->select('product.id as id_product,product.name_product, product.status, product.description
			, product.panjang, product.lebar, product.tinggi, product.id_category, product.id_supplier,
			category.name_category, supplier.name_supplier, image.name_image, image.id as id_image')
         ->from('product')
         ->join('category', 'product.id_category = category.id')
		 ->join('supplier', 'product.id_supplier = supplier.id')
		 ->join('image', 'image.id_product = product.id')
		 ->where('product.id',$id);
		 
		$query = $this->db->get();
		return $query->result();

	}
	public function getProductInnerJoinByIdCategory($id_category){
		$this->db->select('product.id as id_product,product.name_product, product.status, product.description
			, product.panjang, product.lebar, product.tinggi, product.id_category, product.id_supplier,
			category.name_category, supplier.name_supplier, image.name_image, image.id as id_image')
         ->from('product')
         ->join('category', 'product.id_category = category.id')
		 ->join('supplier', 'product.id_supplier = supplier.id')
		 ->join('image', 'image.id_product = product.id')
		 ->where('product.id_category',$id_category);
		 
		$query = $this->db->get();
		return $query->result();

	}

	public function getProductInnerJoinSearch($params){
		$search = $params['search'] ? $params['search'] : '';
		$order_field = $params['order_field'] ? $params['order_field'] : 'id';
		$order_ascdesc = $params['order_ascdesc'] ? $params['order_ascdesc'] : 'asc';
		$limit = $params['limit'] ? $params['limit'] : 0;
		$start = $params['start'] ? $params['start'] : 0;

		$this->db->select('product.id as id_product,product.name_product, product.status, product.description
			, product.panjang, product.lebar, product.tinggi,product.link,
			category.name_category, supplier.name_supplier, image.name_image')
         ->from('product')
         ->join('category', 'product.id_category = category.id')
		 ->join('supplier', 'product.id_supplier = supplier.id')
		 ->join('image', 'image.id_product = product.id');

		if($search) $this->db->like('product.id', $search);
		if($search) $this->db->or_like('product.name_product', $search);
		if($search) $this->db->or_like('product.description', $search);
		if($search) $this->db->or_like('product.link', $search);
		if($search) $this->db->or_like('category.name_category', $search);
		
		$this->db->order_by($order_field, $order_ascdesc); // Untuk menambahkan query ORDER BY 
		$this->db->limit($limit, $start);
		$query = $this->db->get();
		return $query->result_array();

	}	
	function count_filter(){  
		$this->db->select("*"); 
		$this->db->from($this->_table);  
		$query = $this->db->get();  
		return $query->num_rows();  
   }       
   function count_all()  
   {  
		$this->db->select("*");  
		$this->db->from($this->_table);  
		return $this->db->count_all_results();  
   }  
}


