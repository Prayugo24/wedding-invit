<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class SructurData {
    
    public static function WebPage($param =[],$default = False){
        // home list pusat bantuan anime ongoing genre list
        $webPageJson = array();
        
        if(count($param) > 0){
            $webPageJson = array(
                "@context" => "https://schema.org",
                "@type" => "WebPage",
                "potentialAction" => [
                    "@type" => "SearchAction",
                    "@id" => $param['main_url'].'form',
                    "target" => [
                        "@type" => "EntryPoint",
                        "urlTemplate" =>site_url('search/')."?KeyW={query}"
                    ],
                ],
            );
        }
        
        $response = '<script type="application/ld+json">'.json_encode($webPageJson).'</script>';
        return $response;
    }
    public static function WebPageDetail($param =[],$default = False){
        $webPageJson = array();
        
        if(count($param) > 0){
            $webPageJson = [
                [
                    "@context" => "https://schema.org",
                    "@type" => "WebPage",
                    "@id" => $param['url_detail'].'#webpage',
                    "url" => $param['url_detail'],
                    "name" => $param['Title'].' - '.$param['name_website'],
                    "datePublished" => $param['date_published'],
                    "dateModified" => $param['date_modified'],
                    "description" => $param['description'],
                    "inLanguage" => "id-ID", 
                    "isPartOf" => [
                        "@type" => "WebSite",
                        "@id" => $param['main_url']."#website",
                        "url" => $param['main_url'],
                        "name" => $param['name_website'],
                        "description" => $param['Summary'],
                        "inLanguage" => "id-ID", 
                        "publisher" => [
                            "@type" => "Organization",
                            "@id" => $param['main_url']."#organization",
                            "name" => $param['name_website'],
                            "url" => $param['main_url'],
                            "sameAs" => [
                                "https://www.facebook.com/nimeindo24-108112447258606/",
                                "https://www.instagram.com/nimeindotv/",
                                "https://id.pinterest.com/nimeindotv/",
                                "https://twitter.com/nimeindotv",
                            ],
                            "logo" =>  [
                                "@type" =>  "ImageObject", 
                                "@id" => $param['main_url']."#logo", 
                                "inLanguage" => "id-ID", 
                                "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                                "width" => 128, 
                                "height" => 128, 
                                "caption" => $param['name_website']
                            ],
                            "image" => [
                                "@type" =>  "ImageObject", 
                                "@id" => $param['main_url']."#logo", 
                                "inLanguage" => "id-ID", 
                                "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                                "width" => 128, 
                                "height" => 128, 
                                "caption" => $param['name_website']
                            ]
                        ],
                        "potentialAction" => [
                            "@type" => "SearchAction",
                            "target" => [
                                "@type" => "EntryPoint",
                                "urlTemplate" => $param['url_search']."?KeyW={search_term_string}"
                            ],
                            "query-input" => [
                                "@type" => "PropertyValueSpecification",
                                "valueRequired" => "https://schema.org/True",
                                "valueName" => "search_term_string"
                            ]
                        ],
                    ],
                    "primaryImageOfPage" => [
                        "@type" =>  "ImageObject", 
                        "@id" => $param['url_detail']."#primaryimage", 
                        "inLanguage" => "id-ID", 
                        "url" => $param['url_image_detail'], 
                        "width" => 128, 
                        "height" => 128, 
                    ],
                    "potentialAction" => [
                        "@type" => "ReadAction",
                        "target" => [
                            "@type" => "EntryPoint",
                            "urlTemplate" => $param['url_detail']
                        ],
                    ]
                ],
                [
                    "@context" => "https://schema.org",
                    "@type" => "WebPage",
                    "potentialAction" => [
                        "@type" => "SearchAction",
                        "@id" => $param['main_url'].'form',
                        "target" => [
                            "@type" => "EntryPoint",
                            "urlTemplate" =>$param['url_search']."?KeyW={query}"
                        ],
                    ],
                ]
            ];
            
        }
        
        $response = '<script type="application/ld+json">'.json_encode($webPageJson).'</script>';
        return $response;
    }

    public static function WebPage2($param =[],$default = False){
        // home list pusat bantuan anime ongoing genre list
        $webPageJson = array();
        
        if(count($param) > 0){
            $webPageJson = [
                [
                    "@context" => "https://schema.org",
                    "@type" => "WebPage",
                    "@id" => $param['url_detail'].'#webpage',
                    "url" => $param['url_detail'],
                    "name" => $param['Title'].' - '.$param['name_website'],
                    "datePublished" => $param['date_published'],
                    "dateModified" => $param['date_modified'],
                    "description" => $param['description'],
                    "inLanguage" => "id-ID", 
                    "isPartOf" => [
                        "@type" => "WebSite",
                        "@id" => $param['main_url']."#website",
                        "url" => $param['main_url'],
                        "name" => $param['name_website'],
                        "description" => $param['Summary'],
                        "inLanguage" => "id-ID", 
                        "publisher" => [
                            "@type" => "Organization",
                            "@id" => $param['main_url']."#organization",
                            "name" => $param['name_website'],
                            "url" => $param['main_url'],
                            "sameAs" => [
                                "https://www.facebook.com/nimeindo24-108112447258606/",
                                "https://www.instagram.com/nimeindotv/",
                                "https://id.pinterest.com/nimeindotv/",
                                "https://twitter.com/nimeindotv",
                            ],
                            "logo" =>  [
                                "@type" =>  "ImageObject", 
                                "@id" => $param['main_url']."#logo", 
                                "inLanguage" => "id-ID", 
                                "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                                "width" => 128, 
                                "height" => 128, 
                                "caption" => $param['name_website']
                            ],
                            "image" => [
                                "@type" =>  "ImageObject", 
                                "@id" => $param['main_url']."#logo", 
                                "inLanguage" => "id-ID", 
                                "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                                "width" => 128, 
                                "height" => 128, 
                                "caption" => $param['name_website']
                            ]
                        ],
                        "potentialAction" => [
                            "@type" => "SearchAction",
                            "target" => [
                                "@type" => "EntryPoint",
                                "urlTemplate" => $param['url_search']."?KeyW={search_term_string}"
                            ],
                            "query-input" => [
                                "@type" => "PropertyValueSpecification",
                                "valueRequired" => "https://schema.org/True",
                                "valueName" => "search_term_string"
                            ]
                        ],
                    ],
                    
                    "potentialAction" => [
                        "@type" => "ReadAction",
                        "target" => [
                            "@type" => "EntryPoint",
                            "urlTemplate" => $param['url_detail']
                        ],
                    ]
                ],
                [
                    "@context" => "https://schema.org",
                    "@type" => "WebPage",
                    "potentialAction" => [
                        "@type" => "SearchAction",
                        "@id" => $param['main_url'].'form',
                        "target" => [
                            "@type" => "EntryPoint",
                            "urlTemplate" =>$param['url_search']."?KeyW={query}"
                        ],
                    ],
                ]
            ];
            
        }
        
        $response = '<script type="application/ld+json">'.json_encode($webPageJson).'</script>';
        return $response;
    }
    
    public static function Brand($param = [], $default = False){
        $websiteJson = array();
        if(count($param) > 0){
            $websiteJson = array(
                "@context" => "https://schema.org",
                "@type" => "Brand",
                "url" => $param['url'],
                "name" =>  $param['Summary'],
            );
        }
        $response = '<script type="application/ld+json">'.json_encode($websiteJson).'</script>';
        return $response;
    }

    public static function Website($param = [], $default = False){
        $websiteJson = array();
        if(count($param) > 0){
            $websiteJson = array(
                "@context" => "https://schema.org",
                "@type" => "WebSite",
                "@id" => $param['url']."#website",
                "url" => $param['url'],
                "name" =>  $param['name_website'],
                "inLanguage" => "id-ID",
                "description" => "Nonton Streaming Anime Sub Indonesia",
                "publisher" =>  [
                    "@id" => $param['main_url']."#organization"
                ],
                "potentialAction" => [ 
                    "@type" => "SearchAction",
                    "target" => $param['main_url']."search?KeyW={search_term_string}",
                    "query-input" => "required name=search_term_string"
                ]
            );
        }
        $response = '<script type="application/ld+json">'.json_encode($websiteJson).'</script>';
        return $response;
        
    }

    public static function SearchResultsPage($param = [], $default = false){
        $SearchResultsPageJson = array();
        if(count($param) > 0){
                $SearchResultsPageJson = [
                    "@context" => "https://schema.org",
                    "@type" => "CollectionPage / SearchResultsPage",
                    "@id" => $param['url_page'],
                    "name" => $param['Summary'],
                    "inLanguage" => "id-ID", 
                    "isPartOf" => [
                        "@type" => "WebSite",
                        "@id" => $param['main_url']."#website",
                        "url" => $param['main_url'],
                        "name" => $param['name_website'],
                        "description" => $param['Summary'],
                        "inLanguage" => "id-ID", 
                        "publisher" => [
                            "@type" => "Organization",
                            "@id" => $param['main_url']."#organization",
                            "name" => $param['name_website'],
                            "url" => $param['main_url'],
                            "sameAs" => [
                                "https://www.facebook.com/nimeindo24-108112447258606/",
                                "https://www.instagram.com/nimeindotv/",
                                "https://id.pinterest.com/nimeindotv/",
                                "https://twitter.com/nimeindotv",
                            ],
                            "logo" =>  [
                                "@type" =>  "ImageObject", 
                                "@id" => $param['main_url']."#logo", 
                                "inLanguage" => "id-ID", 
                                "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                                "width" => 128, 
                                "height" => 128, 
                                "caption" => $param['name_website']
                            ],
                            "image" => [
                                "@type" =>  "ImageObject", 
                                "@id" => $param['main_url']."#logo", 
                                "inLanguage" => "id-ID", 
                                "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                                "width" => 128, 
                                "height" => 128, 
                                "caption" => $param['name_website']
                            ]
                        ],
                        "potentialAction" => [
                            "@type" => "SearchAction",
                            "target" => [
                                "@type" => "EntryPoint",
                                "urlTemplate" =>$param['url_search']."?KeyW={search_term_string}"
                            ],
                            "query-input" => [
                                "@type" => "PropertyValueSpecification",
                                "valueRequired" => "https://schema.org/True",
                                "valueName" => "search_term_string"
                            ]
                        ]
    
                    ],
                ];
        }
        $response = '<script type="application/ld+json">'.json_encode($SearchResultsPageJson).'</script>';
        return $response;
    }

    public static function CollectionPage($param = [], $default = false){
        $CollectionPageJson = array();
        if(count($param) > 0){

            $CollectionPageJson = array(
                "@context" => "https://schema.org",
                "@type" => "CollectionPage",
                "@id" => $param['main_url'],
                "url" => $param['main_url'],
                "name" => $param['Summary'],
                "description" => $param['description'],
                "inLanguage" => "id-ID", 
                "isPartOf" => [
                    "@type" => "WebSite",
                    "@id" => $param['main_url']."#website",
                    "url" => $param['main_url'],
                    "name" => $param['name_website'],
                    "description" => $param['Summary'],
                    "inLanguage" => "id-ID", 
                    "publisher" => [
                        "@type" => "Organization",
                        "@id" => $param['main_url']."#organization",
                        "name" => $param['name_website'],
                        "url" => $param['main_url'],
                        "sameAs" => [
                            "https://www.facebook.com/nimeindo24-108112447258606/",
                            "https://www.instagram.com/nimeindotv/",
                            "https://id.pinterest.com/nimeindotv/",
                            "https://twitter.com/nimeindotv",
                        ],
                        "logo" =>  [
                            "@type" =>  "ImageObject", 
                            "@id" => $param['main_url']."#logo", 
                            "inLanguage" => "id-ID", 
                            "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                            "width" => 128, 
                            "height" => 128, 
                            "caption" => $param['name_website']
                        ],
                        "image" => [
                            "@type" =>  "ImageObject", 
                            "@id" => $param['main_url']."#logo", 
                            "inLanguage" => "id-ID", 
                            "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                            "width" => 128, 
                            "height" => 128, 
                            "caption" => $param['name_website']
                        ]
                    ],
                    "potentialAction" => [
                        "@type" => "SearchAction",
                        "target" => [
                            "@type" => "EntryPoint",
                            "urlTemplate" =>site_url('search/')."?KeyW={search_term_string}"
                        ],
                        "query-input" => [
                            "@type" => "PropertyValueSpecification",
                            "valueRequired" => "https://schema.org/True",
                            "valueName" => "search_term_string"
                        ]
                    ]

                ],
                "about" => [
                    "@type" => "Organization",
                    "@id" => $param['main_url']."#organization",
                    "name" => $param['name_website'],
                    "url" => $param['main_url'],
                    "sameAs" => [
                        "https://www.facebook.com/nimeindo24-108112447258606/",
                        "https://www.instagram.com/nimeindotv/",
                        "https://id.pinterest.com/nimeindotv/",
                        "https://twitter.com/nimeindotv",
                    ],
                    "logo" =>  [
                        "@type" =>  "ImageObject", 
                        "@id" => $param['main_url']."#logo", 
                        "inLanguage" => "id-ID", 
                        "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                        "width" => 128, 
                        "height" => 128, 
                        "caption" => $param['name_website']
                    ],
                    "image" => [
                        "@type" =>  "ImageObject", 
                        "@id" => $param['main_url']."#logo", 
                        "inLanguage" => "id-ID", 
                        "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                        "width" => 128, 
                        "height" => 128, 
                        "caption" => $param['name_website']
                    ]
                ]
            );
        }
        $response = '<script type="application/ld+json">'.json_encode($CollectionPageJson).'</script>';
        return $response;
    }

    public static function Organization($param = [], $default = false){
        $Organization = array(
            "@context" => "https://schema.org",
            "@type" => "Organization",
            "@id" => $param['url']."#organization",
            "name" => $param['name_website'],
            "url" => $param['url'],
            "sameAs" => [
                // "https://www.facebook.com/nimeindo24-108112447258606/",
                "https://www.instagram.com/nimeindotv/",
            ],
            
        );
        $response = '<script type="application/ld+json">'.json_encode($Organization).'</script>';
        return $response;
    }

    public static function Article($param = [], $default = false){

        $webPageJson = array();
        
        if(count($param) > 0){
            $webPageJson = [
                [
                    "@context" => "https://schema.org",
                    "@type" => "WebSite",
                    "@id" => $param['url_detail'].'#article',
                    "url" => $param['url_detail'],
                    "headline" => $param['title_episode'],
                    "datePublished" => $param['date_published'],
                    "dateModified" => $param['date_modified'],
                    "description" => $param['description'],
                    // "articleSection" => $param['title_episode'],
                    "inLanguage" => "id-ID", 
                    "isPartOf" => [
                        "@type" => "WebPage",
                        "@id" => $param['url_detail']."#website",
                        "url" => $param['url_detail'],
                        "name" => $param['title_episode'].' - '.$param['name_website'],
                        "datePublished" => $param['date_published'],
                        "dateModified" => $param['date_modified'],
                        "description" => $param['description'],
                        "inLanguage" => "id-ID", 
                        "isPartOf" => [
                            "@type" => "WebSite",
                            "@id" => $param['main_url']."#website",
                            "url" => $param['main_url'],
                            "name" => $param['name_website'],
                            "description" => $param['Summary'],
                            "inLanguage" => "id-ID", 
                            "publisher" => [
                                "@type" => "Organization",
                                "@id" => $param['main_url']."#organization",
                                "name" => $param['name_website'],
                                "url" => $param['main_url'],
                                "sameAs" => [
                                    "https://www.facebook.com/nimeindo24-108112447258606/",
                                    "https://www.instagram.com/nimeindotv/",
                                    "https://id.pinterest.com/nimeindotv/",
                                    "https://twitter.com/nimeindotv",
                                ],
                                "logo" =>  [
                                    "@type" =>  "ImageObject", 
                                    "@id" => $param['main_url']."#logo", 
                                    "inLanguage" => "id-ID", 
                                    "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                                    "width" => 128, 
                                    "height" => 128, 
                                    "caption" => $param['name_website']
                                ],
                                "image" => [
                                    "@type" =>  "ImageObject", 
                                    "@id" => $param['main_url']."#logo", 
                                    "inLanguage" => "id-ID", 
                                    "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                                    "width" => 128, 
                                    "height" => 128, 
                                    "caption" => $param['name_website']
                                ]
                            ],
                            "potentialAction" => [
                                "@type" => "SearchAction",
                                "target" => [
                                    "@type" => "EntryPoint",
                                    "urlTemplate" => $param['url_search']."?KeyW={search_term_string}"
                                ],
                                "query-input" => [
                                    "@type" => "PropertyValueSpecification",
                                    "valueRequired" => "https://schema.org/True",
                                    "valueName" => "search_term_string"
                                ]
                            ],
                        ],
                        "potentialAction" => [
                            "@type" => "ReadAction",
                            "target" => [
                                "@type" => "EntryPoint",
                                "urlTemplate" => $param['url_detail']
                            ]
                        ],
                    ],
                    "author" => [
                        "@type" => "Person",
                        "@id" => $param['url_detail'].'#article',
                        "name" => $param['name_author']
                    ],
                    'mainEntityOfPage' => [
                        "@context" => "https://schema.org",
                        "@type" => "WebPage",
                        "@id" => $param['url_detail'].'#webpage',
                        "url" => $param['url_detail'],
                        "name" => $param['title_episode'].' - '.$param['name_website'],
                        "datePublished" => $param['date_published'],
                        "dateModified" => $param['date_modified'],
                        "description" => $param['description'],
                        "inLanguage" => "id-ID", 
                        "isPartOf" => [
                            "@type" => "WebSite",
                            "@id" => $param['main_url']."#website",
                            "url" => $param['main_url'],
                            "name" => $param['name_website'],
                            "description" => $param['Summary'],
                            "inLanguage" => "id-ID", 
                            "publisher" => [
                                "@type" => "Organization",
                                "@id" => $param['main_url']."#organization",
                                "name" => $param['name_website'],
                                "url" => $param['main_url'],
                                "sameAs" => [
                                    "https://www.facebook.com/nimeindo24-108112447258606/",
                                    "https://www.instagram.com/nimeindotv/",
                                    "https://id.pinterest.com/nimeindotv/",
                                    "https://twitter.com/nimeindotv",
                                ],
                                "logo" =>  [
                                    "@type" =>  "ImageObject", 
                                    "@id" => $param['main_url']."#logo", 
                                    "inLanguage" => "id-ID", 
                                    "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                                    "width" => 128, 
                                    "height" => 128, 
                                    "caption" => $param['name_website']
                                ],
                                "image" => [
                                    "@type" =>  "ImageObject", 
                                    "@id" => $param['main_url']."#logo", 
                                    "inLanguage" => "id-ID", 
                                    "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                                    "width" => 128, 
                                    "height" => 128, 
                                    "caption" => $param['name_website']
                                ]
                            ],
                            "potentialAction" => [
                                "@type" => "SearchAction",
                                "target" => [
                                    "@type" => "EntryPoint",
                                    "urlTemplate" => $param['url_search']."?KeyW={search_term_string}"
                                ],
                                "query-input" => [
                                    "@type" => "PropertyValueSpecification",
                                    "valueRequired" => "https://schema.org/True",
                                    "valueName" => "search_term_string"
                                ]
                            ],
                        ],
                        "potentialAction" => [
                            "@type" => "ReadAction",
                            "target" => [
                                "@type" => "EntryPoint",
                                "urlTemplate" => $param['url_detail']
                            ]
                        ],
                    ],
                    "publisher" => [
                        "@type" => "Organization",
                        "@id" => $param['main_url']."#organization",
                        "name" => $param['name_website'],
                        "url" => $param['main_url'],
                        "sameAs" => [
                            "https://www.facebook.com/nimeindo24-108112447258606/",
                            "https://www.instagram.com/nimeindotv/",
                            "https://id.pinterest.com/nimeindotv/",
                            "https://twitter.com/nimeindotv",
                        ],
                        "logo" =>  [
                            "@type" =>  "ImageObject", 
                            "@id" => $param['main_url']."#logo", 
                            "inLanguage" => "id-ID", 
                            "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                            "width" => 128, 
                            "height" => 128, 
                            "caption" => $param['name_website']
                        ],
                        "image" => [
                            "@type" =>  "ImageObject", 
                            "@id" => $param['main_url']."#logo", 
                            "inLanguage" => "id-ID", 
                            "url" => $param['main_url']."assets/template_2/assets/img/icon_N.jpg", 
                            "width" => 128, 
                            "height" => 128, 
                            "caption" => $param['name_website']
                        ]
                    ],
                ]
            ];
            
        }
        
        $response = '<script type="application/ld+json">'.json_encode($webPageJson).'</script>';
        return $response;
    }
}