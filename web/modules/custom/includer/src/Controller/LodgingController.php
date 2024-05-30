<?php

/**
 * @file
 * Contains \Drupal\includer\Controller\LodgingController
 */

namespace Drupal\includer\Controller;


/**
 * The specific class to gather includes and pass to template
 *
 */
class LodgingController extends ContentController {



    public function getIncludes () {

        $this->result["listing_simple"] = $this->getNodes();
        $this->result["additional_classes"] = 'lodging';

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


        $nodes = $this->efqService->getEntities('lodging', 'teaser', $conditions, $range, $sort);

        if ($nodes){
            return $nodes;
        }

        return false;

    }



    protected function createFilters(){

        $terms = $this->taxoHelper->getTaxoTerms('lodging_category');

        return [
            '#type' => 'markup',
            '#markup' => $this->getTermsAsLinks($terms, false)
        ];

    }




}