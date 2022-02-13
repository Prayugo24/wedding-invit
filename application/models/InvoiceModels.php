<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class InvoiceModels extends CI_Model {

	private $_table_ship = "shipment_information";
	private $_table_order = "order";
	private $_table_buyer = "buyer";

	public function rulesBuyer(){
		return [
			[
				'field' => 'name_receiver',
				'label' => 'Name Receiver',
				'rules' => 'required'
			],
			[
				'field' => 'name_company',
				'label' => 'Name Company',
				'rules' => 'required'
			],
			[
				'field' => 'email',
				'label' => 'Email',
				'rules' => 'required'
			],
			[
				'field' => 'website',
				'label' => 'Website',
				'rules' => 'required'
			],
			[
				'field' => 'address',
				'label' => 'Address',
				'rules' => 'required'
			],
		];
	}
	public function rulesShipment(){
		return [
		
			[
				'field' => 'pre_order',
				'label' => 'PO',
				'rules' => 'required'
			],
			
			[
				'field' => 'pre_order_date',
				'label' => 'Date',
				'rules' => 'required'
			],
			[
				'field' => 'lc_or_credit',
				'label' => 'Lc Or Credit',
				'rules' => 'required'
			],
			[
				'field' => 'currency',
				'label' => 'Currency',
				'rules' => 'required'
			],
			[
				'field' => 'payment_terms',
				'label' => 'Payment Terms',
				'rules' => 'required'
			],
			[
				'field' => 'est_ship_date',
				'label' => 'Est Ship Daet',
				'rules' => 'required'
			],
			[
				'field' => 'mode_transportation',
				'label' => 'Mode Transportation',
				'rules' => 'required'
			],
			[
				'field' => 'number_package',
				'label' => 'Num Package',
				'rules' => 'required'
			],
			[
				'field' => 'gross_weight',
				'label' => 'Gross Weight',
				'rules' => 'required'
			],
			[
				'field' => 'net_weight',
				'label' => 'Net Weight',
				'rules' => 'required'
			],
			[
				'field' => 'container_tot',
				'label' => 'Container Total',
				'rules' => 'required'
			],
			[
				'field' => 'reason_export',
				'label' => 'Reason Export',
				'rules' => 'required'
			],
			[
				'field' => 'port_embarkation',
				'label' => 'Port Of Embarkation',
				'rules' => 'required'
			],
			[
				'field' => 'country_origin',
				'label' => 'Country Of Origin',
				'rules' => 'required'
			],
			[
				'field' => 'port_discharge',
				'label' => 'Port Of Discharge',
				'rules' => 'required'
			]
			
		];
	}

	
	
	public function saveBuyer($params){
		$this->db->insert($this->_table_buyer, $params);
		return $this->db->insert_id();
	}
	public function saveShipment($params){
		$this->db->insert($this->_table_ship, $params);
		$insert_id = $this->db->insert_id();
		return $insert_id;
	}

	public function saveOrder($params){
		return $this->db->insert($this->_table_order, $params);
	}

	public function updateOrder($params){
		return $this->db->update($this->_table_order, $params, array('id_order' => $params['id_order']));
	}

	public function updateShipment($params){
		return $this->db->update($this->_table_ship, $params, array('id_shipment' => $params['id_shipment']));
	} 

	public function updateBuyer($params){
		return $this->db->update($this->_table_buyer, $params, array('id_buyer' => $params['id_buyer']));
	}

	public function deleteBuyer($id_buyer)
	{
		return $this->db->delete($this->_table_buyer, array("id_buyer" => $id_buyer));
	}
	public function deleteOrder($id_order)
	{
		return $this->db->delete($this->_table_order, array("id_order" => $id_order));
	}
	public function deleteShipment($id_shipment)
	{
		return $this->db->delete($this->_table_ship, array("id_shipment" => $id_shipment));
	}

	public function getInvoiceInnerJoinOrderbyBuyer($id_buyer){
		$this->db->select('buyer.id_buyer,buyer.name, buyer.name_company, buyer.email
			, buyer.website, buyer.city, buyer.zip_code, buyer.address,shipment_information.invoice,shipment_information.image_barcode,
			shipment_information.id_shipment,shipment_information.pre_order,shipment_information.date, shipment_information.lc_or_credit,
			shipment_information.currency,shipment_information.payment_terms,shipment_information.est_ship_date,
			shipment_information.mode_of_transport,shipment_information.num_of_package,shipment_information.gross_weight,
			shipment_information.net_weight,shipment_information.container_total,shipment_information.reason_for_exp,
			shipment_information.port_of_embarkation,shipment_information.country_of_orgn,shipment_information.port_of_discharge,
			shipment_information.awb_or_bl,
			')
         ->from('buyer')
		 ->join('shipment_information', 'shipment_information.id_buyer = buyer.id_buyer')
		 ->where('buyer.id_buyer',$id_buyer);
		$query = $this->db->get();
		return $query->result();
	}

	public function getOrderByBuyer($id_buyer){
		$this->db->select('*')
		->from('order')
		->where('id_buyer',$id_buyer);
		$query = $this->db->get();
		return $query->result();
	}
	public function getOrderById($id_order){
		$this->db->select('*')
		->from('order')
		->where('id_order',$id_order);
		$query = $this->db->get();
		return $query->result();
	}

	public function getInvoiceInnerJoin($params){
		$search = $params['search'] ? $params['search'] : '';
		$order_field = $params['order_field'] ? $params['order_field'] : 'id_buyer';
		$order_ascdesc = $params['order_ascdesc'] ? $params['order_ascdesc'] : 'asc';
		$limit = $params['limit'] ? $params['limit'] : 0;
		$start = $params['start'] ? $params['start'] : 0;

		$this->db->select('buyer.id_buyer,buyer.name, buyer.name_company, buyer.email
		, buyer.website, buyer.city, buyer.zip_code, buyer.address,shipment_information.status,shipment_information.invoice,
		shipment_information.pre_order,shipment_information.date, shipment_information.lc_or_credit,
		shipment_information.currency,shipment_information.payment_terms,shipment_information.est_ship_date,
		shipment_information.mode_of_transport,shipment_information.num_of_package,shipment_information.gross_weight,
		shipment_information.net_weight,shipment_information.container_total,shipment_information.reason_for_exp,
		shipment_information.port_of_embarkation,shipment_information.country_of_orgn,shipment_information.port_of_discharge,
		shipment_information.awb_or_bl')
		->from('buyer')
		->join('shipment_information', 'shipment_information.id_buyer = buyer.id_buyer');

		if($search) $this->db->like('buyer.name', $search);
		if($search) $this->db->or_like('buyer.name_company', $search);
		if($search) $this->db->or_like('shipment_information.port_of_discharge', $search);
		if($search) $this->db->or_like('shipment_information.country_of_orgn', $search);
		if($search) $this->db->or_like('shipment_information.port_of_embarkation', $search);
		
		$this->db->order_by($order_field, $order_ascdesc); // Untuk menambahkan query ORDER BY 
		$this->db->limit($limit, $start);
		$query = $this->db->get();
		return $query->result_array();

	}	
	function count_filter(){  
		$this->db->select("*"); 
		$this->db->from($this->_table_buyer);  
		$query = $this->db->get();  
		return $query->num_rows();  
   }       
   function count_all()  
   {  
		$this->db->select("*");  
		$this->db->from($this->_table_buyer);  
		return $this->db->count_all_results();  
   }  
}
