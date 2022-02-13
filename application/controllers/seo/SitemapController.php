<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class SitemapController extends CI_Controller {

    public function __construct(){
		parent::__construct();
		$this->load->helper('url');
	}
 
    public function sitemap(){
		$PTR_API['sitemapList'] = [
			'home',
			'about',
			'craftsmen',
			'terms-and-conditions',
			'product',
			'faq',
			'contact-us',
		];
        $this->load->view('seo/sitemap',$PTR_API);
	}

	
}
 
