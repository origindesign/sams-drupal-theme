<?php

/**
 * @file
 * Contains \Drupal\includer\Controller\LiftsTrailsController
 */

namespace Drupal\includer\Controller;


/**
 * The specific class to gather includes and pass to template
 *
 */
class LiftsTrailsController extends ContentController {



    public function getIncludes () {


        $this->result["listing_simple"][] = $this->renderTitle("Lifts");
        $this->result["listing_simple"][] = $this->getNodes( 17 );
        $this->result["listing_simple"][] = $this->renderTitle("Trails");
        $this->result["listing_simple"][] = $this->getNodes( 18 );
        $this->result["additional_classes"] = 'simple lifts-trails';

        return $this->result;

    }



    protected function getNodes ($type){

        $conditions = array(
            "status" => 1,
            "field_type.entity.tid" => $type
        );

        $range = array(
            "start" => 0,
            "length" => 150
        );

        $sort = array(
            array(
                "field" => 'field_level.entity.tid',
                "direction" => "ASC"
            ),
            array(
                "field" => 'title',
                "direction" => "ASC"
            )
        );

        $nodes = $this->efqService->getEntities('lift_trail', 'row', $conditions, $range, $sort);

        if ($nodes){
            return $nodes;
        }

        return false;

    }


    protected function renderTitle ( $title ){

        return [
            '#type' => 'markup',
            '#markup' => '<h2>'.t($title).'</h2>',
        ];

    }


}
