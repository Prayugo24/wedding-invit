<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class InvoiceViewController extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->library('form_validation');
		$this->load->model('InvoiceModels');
		$this->load->helper('url');
		$this->load->model('AuthModels');
		$this->load->library('zend');
		if(!$this->AuthModels->current_user()){
			redirect('super-power');
		}
	}

	
	public function proforma_invoice($id){
		$invoiceJoin = $this->InvoiceModels->getInvoiceInnerJoinOrderbyBuyer($id);
		$getOrderByIdBuyer = $this->InvoiceModels->getOrderByBuyer($id);
		$invoiceJoin = json_encode($invoiceJoin[0]);
		$params = [
			'Shipment' => json_decode($invoiceJoin,true),
			'ItemOrder' => $getOrderByIdBuyer
		];
		$this->load->view('admin/laporan/proforma_invoice',$params);
	}
	public function comercial_invoice($id){
		$invoiceJoin = $this->InvoiceModels->getInvoiceInnerJoinOrderbyBuyer($id);
		$getOrderByIdBuyer = $this->InvoiceModels->getOrderByBuyer($id);
		$invoiceJoin = json_encode($invoiceJoin[0]);
		$params = [
			'Shipment' => json_decode($invoiceJoin,true),
			'ItemOrder' => $getOrderByIdBuyer
		];
		$this->load->view('admin/laporan/comercial_invoice',$params);
	}

	function bikin_barcode($kode){
		$this->load->library('zend');
		$this->zend->load('Zend/Barcode');
		
			  $barcodeOptions = array('text' => $kode);
			  $rendererOptions = array('imageType'          =>'png', 
									   'horizontalPosition' => 'center', 
									   'verticalPosition'   => 'middle');
			
		// $imageResource=Zend_Barcode::factory('code128', 'image', $barcodeOptions, $rendererOptions)->render();
		$imageResource = Zend_Barcode::draw('code128', 'image', array('text' => $kode), array());
		$path_to_file =FCPATH.'/assets/img/barcode/';
		$file_name = $kode.'.png';
		$store_image = imagepng($imageResource,$path_to_file.$file_name);
		return $file_name;


	 }

}
