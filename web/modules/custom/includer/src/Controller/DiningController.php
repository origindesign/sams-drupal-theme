<?php

/**
 * @file
 * Contains \Drupal\includer\Controller\DiningController
 */

namespace Drupal\includer\Controller;


/**
 * The specific class to gather includes and pass to template
 *
 */
class DiningController extends ContentController {



  public function getIncludes () {

    $this->result["listing_isotope"] = $this->getNodes();
    $this->result["filters_links"] = $this->createFilters();
    $this->result["additional_classes"] = 'dining';

    return $this->result;

  }



  protected function getNodes (){

    $conditions = array(
      "status" => 1,
    );

    $sort = array(
      "field" => 'field_order_weight',
      "direction" => "ASC"
    );

    $range = array(
      "start" => 0,
      "length" => 1000
    );


    $nodes = $this->efqService->getEntities('dining', 'card', $conditions, $range, $sort);

    if ($nodes){
      return $nodes;
    }

    return false;

  }



  protected function createFilters(){

    $terms = $this->taxoHelper->getTaxoTerms('dining_category');

    return [
      '#type' => 'markup',
      '#markup' => $this->getTermsAsLinks($terms)
    ];

  }




}
